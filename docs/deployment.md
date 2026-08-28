# Healthra deployment runbook

## Architecture

- **EKS cluster**: `healthra-cluster` (us-east-1, 2 amd64 nodes, created via eksctl)
- **Container registry**: ECR repos `healthra-backend`, `healthra-frontend`
- **Database**: RDS Postgres `healthra-db` (db.t3.micro, private subnets, not
  publicly accessible; security group `healthra-rds-sg` allows port 5432 only
  from the EKS cluster security group)
- **Ingress**: a single ALB (via the `alb.ingress.kubernetes.io` annotations
  on `kubernetes/ingress.yaml`) routes `/` to the frontend and `/api`, `/admin`
  to the backend — frontend and backend are same-origin, which is why the
  frontend is built with a relative `VITE_HEALTHRA_BASEURL=/api/` and the
  backend uses cookie-based auth.
- **Monitoring**: kube-prometheus-stack (Prometheus Operator + Prometheus +
  Grafana + Alertmanager) installed via Helm into the `monitoring` namespace.
  The `healthra` app's `ServiceMonitor` (backend `/metrics` via
  django-prometheus) and Grafana dashboard are applied by the pipeline into
  the `healthra` namespace; the Grafana sidecar auto-discovers dashboards
  cluster-wide.
- **CI/CD**: Jenkins (`jenkins/Jenkinsfile`), job `Healthra-Pipeline`, watches
  `main` on GitHub via SCM polling (Jenkins here only listens on
  `localhost:8080`, so a webhook can't reach it — see "Trigger" below).

## One-time infrastructure setup (already done)

These aren't run by the pipeline — they're cluster/account-level setup done
once. Recorded here so they're reproducible if this ever needs to be rebuilt.

```bash
# EKS cluster + ECR repos + RDS: already provisioned in this account.
# If rebuilding from scratch, recreate in this order: VPC/EKS cluster (eksctl),
# ECR repos, then RDS (see below), then the EBS CSI driver + kube-prometheus-stack.

# RDS Postgres (private subnets, SG scoped to the EKS node SG only)
aws ec2 create-security-group --group-name healthra-rds-sg \
  --description "Allow Postgres from healthra EKS nodes" --vpc-id <VPC_ID>
aws ec2 authorize-security-group-ingress --group-id <RDS_SG_ID> \
  --protocol tcp --port 5432 --source-group <EKS_NODE_SG_ID>
aws rds create-db-subnet-group --db-subnet-group-name healthra-db-subnet-group \
  --db-subnet-group-description "Private subnets for healthra RDS" \
  --subnet-ids <PRIVATE_SUBNET_1> <PRIVATE_SUBNET_2>
aws rds create-db-instance --db-instance-identifier healthra-db \
  --db-instance-class db.t3.micro --engine postgres --engine-version 16.15 \
  --master-username postgres --master-user-password '<GENERATED>' \
  --allocated-storage 20 --storage-type gp3 --db-name healthra \
  --vpc-security-group-ids <RDS_SG_ID> --db-subnet-group-name healthra-db-subnet-group \
  --no-publicly-accessible --no-multi-az --backup-retention-period 7

# EBS CSI driver addon (needed for any PVC on this EKS version — the
# in-tree "gp2" StorageClass provisioner needs the CSI driver behind it)
eksctl utils associate-iam-oidc-provider --cluster healthra-cluster --approve
eksctl create iamserviceaccount --name ebs-csi-controller-sa --namespace kube-system \
  --cluster healthra-cluster --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
  --role-only --role-name AmazonEKS_EBS_CSI_DriverRole_healthra --approve
aws eks create-addon --cluster-name healthra-cluster --addon-name aws-ebs-csi-driver \
  --service-account-role-arn arn:aws:iam::<ACCOUNT_ID>:role/AmazonEKS_EBS_CSI_DriverRole_healthra
kubectl patch storageclass gp2 -p '{"metadata":{"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'

# kube-prometheus-stack (Prometheus + Grafana)
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
kubectl create namespace monitoring
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring \
  -f kube-prometheus-values.yaml --set grafana.adminPassword='<GENERATED>'
```

`kube-prometheus-values.yaml` used for the install:

```yaml
grafana:
  service:
    type: LoadBalancer
  persistence:
    enabled: true
    size: 5Gi
  sidecar:
    dashboards:
      enabled: true
      searchNamespace: ALL
      label: grafana_dashboard
      labelValue: "1"
prometheus:
  prometheusSpec:
    serviceMonitorSelectorNilUsesHelmValues: false
    podMonitorSelectorNilUsesHelmValues: false
    retention: 7d
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: gp2
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 10Gi
alertmanager:
  enabled: true
```

The Helm release is named `prometheus` specifically because
`kubernetes/monitoring-manifests.yaml`'s `ServiceMonitor`s carry the label
`release: prometheus`, which is what the Prometheus Operator's
`serviceMonitorSelector` matches on by default.

### EKS cluster access for Jenkins

EKS keeps Kubernetes RBAC separate from IAM policy. The Jenkins `aws-credentials`
binding uses the `boomi-cicd-admin` IAM user, which has AWS-level
`AdministratorAccess` but had **no EKS access entry**, so `kubectl` calls would
have failed with "Unauthorized" even though the AWS API calls succeeded. Fixed
with:

```bash
aws eks create-access-entry --cluster-name healthra-cluster \
  --principal-arn arn:aws:iam::<ACCOUNT_ID>:user/boomi-cicd-admin
aws eks associate-access-policy --cluster-name healthra-cluster \
  --principal-arn arn:aws:iam::<ACCOUNT_ID>:user/boomi-cicd-admin \
  --policy-arn arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy \
  --access-scope type=cluster
```

If the Jenkins credential ever changes to a different IAM identity, it needs
the same treatment.

## Jenkins credentials required

The pipeline (`jenkins/Jenkinsfile`) expects these credentials in the Jenkins
credential store (already-existing `aws-credentials` plus two new ones added
for this setup):

| Credential ID | Type | Purpose |
|---|---|---|
| `aws-credentials` | Username with password | ECR login + EKS API/kubectl auth (username = access key ID, password = secret access key) |
| `django-secret-key` | Secret text | Django `SECRET_KEY` for production |
| `db-password` | Secret text | RDS master password |

These are injected into a Kubernetes `Secret` at deploy time
(`kubectl create secret ... | kubectl apply -f -`) — production secret values
never live in git. `kubernetes/secrets.yaml` is kept only as a schema
reference for local testing and is **not** applied by the pipeline.

## Trigger: how a push deploys

Jenkins here binds to `127.0.0.1:8080` only, so GitHub can't reach it with a
webhook. `jenkins/Jenkinsfile` instead declares:

```groovy
triggers {
    pollSCM('* * * * *')
}
```

Jenkins checks the `main` branch once a minute and starts a build if there's
a new commit — up to ~1 minute of latency, no inbound exposure needed.
Declarative `triggers {}` blocks are only registered after a build has run at
least once with them present, so **the very first build after adding this
must be started manually** (Build Now) — after that, pushes trigger it
automatically.

If instant triggering is ever wanted instead: expose Jenkins (reverse proxy /
tunnel) and switch to `triggers { githubPush() }` with a webhook configured
on the GitHub repo pointing at `<jenkins-url>/github-webhook/`.

## Pipeline stages

1. **Checkout** — `checkout scm`
2. **Backend Unit Tests** — Django tests against SQLite
3. **Frontend Verification** — `npm ci` + lint
4. **AWS ECR Login**
5. **Build & Push Backend/Frontend Images** — `docker buildx build --platform
   linux/amd64 --push`. The platform pin matters: this Jenkins agent runs on
   Apple Silicon (arm64); without it, images built here fail on the amd64 EKS
   nodes with `exec format error` (this is what caused the initial outage).
6. **Configure kubectl** — `aws eks update-kubeconfig`
7. **Deploy to EKS** — applies namespace/configmap/secret, runs a one-off
   `migrate-job.yaml` Kubernetes Job for Django migrations against RDS
   *before* rolling out new backend pods, then applies services/deployments/
   ingress and waits for rollout.
8. **Deploy Monitoring** — applies the `ServiceMonitor` for the backend and
   packages `kubernetes/grafana-dashboard.json` into a labeled `ConfigMap`
   (`grafana_dashboard=1`) so Grafana's sidecar auto-imports it.

## Accessing Grafana

```bash
kubectl get svc prometheus-grafana -n monitoring
# EXTERNAL-IP column is the ALB/ELB hostname, port 80
```

Login: `admin` / the password set via `--set grafana.adminPassword=...` at
install time (rotate this in Grafana after first login, or manage it via a
proper secret going forward). The "Healthra Application Dashboard" (CPU,
memory, Django request rate, DB query rate) should appear automatically
within a minute of the pipeline's "Deploy Monitoring" stage running, under
Dashboards.

## Known follow-ups / not done here

- `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS` in
  `kubernetes/backend-deployment.yaml` are still `http://localhost,http://127.0.0.1`
  placeholders. Harmless while there's no custom domain (frontend/backend are
  same-origin via the ALB's own hostname), but should be updated if/when a
  real domain + TLS (ACM cert, commented out in `ingress.yaml`) is added.
- The RDS instance is single-AZ (no standby) to keep cost down. Enable
  Multi-AZ if uptime during AZ failure/maintenance matters.
- Grafana admin password and the DB/Django secrets were generated once during
  this setup and handed to the account owner out-of-band — rotate
  periodically, and consider migrating to AWS Secrets Manager + External
  Secrets Operator instead of Jenkins-credential-injected plain `Secret`s if
  this grows beyond a single-cluster setup.
