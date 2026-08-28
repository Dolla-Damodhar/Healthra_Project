# Healthra deployment runbook

## Architecture

- **EKS cluster**: `healthra-cluster` (us-east-1, 2 amd64 nodes, created via eksctl)
- **Container registry**: ECR repos `healthra-backend`, `healthra-frontend`
- **Database**: RDS Postgres `healthra-db` (db.t3.micro, private subnets, not
  publicly accessible; security group `healthra-rds-sg` allows port 5432 only
  from the EKS cluster security group)
- **Ingress**: `ingress-nginx` (installed via Helm) behind a Network Load
  Balancer bound to a static Elastic IP (`44.219.226.81`, allocation
  `eipalloc-0f16e43e30d0d677a`) routes `/` to the frontend and `/api`,
  `/admin` to the backend, on the custom domain `healthraa.duckdns.org` —
  frontend and backend are same-origin, which is why the frontend is built
  with a relative `VITE_HEALTHRA_BASEURL=/api/` and the backend uses
  cookie-based auth. TLS is a free, auto-renewing Let's Encrypt certificate
  issued by cert-manager. See "Custom domain + HTTPS" below for why this
  isn't a plain ALB + ACM setup and how it's wired up. The original ALB
  ingress controller (still installed, used only by future ALB-class
  resources if ever needed) auto-deleted the old ALB once the Ingress
  switched to the `nginx` class.
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
    # ClusterIP: Grafana is reached via the shared ingress-nginx + static-EIP
    # setup (kubernetes/grafana-ingress.yaml), not its own ELB.
    type: ClusterIP
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
7. **Deploy to EKS** — applies namespace/configmap/ClusterIssuer/secret, runs
   a one-off `migrate-job.yaml` Kubernetes Job for Django migrations against
   RDS *before* rolling out new backend pods, then applies
   services/deployments/ingress and waits for rollout. All `kubectl` calls
   use `--request-timeout=60s --validate=false` — the connection from this
   Jenkins agent to the EKS API has repeatedly been slow enough that
   `apply`'s default OpenAPI schema download times out; skipping client-side
   validation avoids that without disabling anything server-side.
8. **Deploy Monitoring** — applies the `ServiceMonitor` for the backend,
   Grafana's Ingress (`kubernetes/grafana-ingress.yaml`), and packages
   `kubernetes/grafana-dashboard.json` into a labeled `ConfigMap`
   (`grafana_dashboard=1`) so Grafana's sidecar auto-imports it.

## Accessing Grafana

**https://healthraa-grafana.duckdns.org/** — same shared ingress-nginx +
static EIP + cert-manager setup as the app (see "Custom domain + HTTPS"
above), via `kubernetes/grafana-ingress.yaml`. Grafana's own Service was
switched from `LoadBalancer` to `ClusterIP` (both in the live cluster and in
the Helm values used for the `prometheus` release) once it moved behind the
shared ingress — it no longer needs, and isn't billed for, its own
dedicated ELB.

Login: `admin` / the password set via `--set grafana.adminPassword=...` at
install time (rotate this in Grafana after first login, or manage it via a
proper secret going forward). The "Healthra Application Dashboard" (CPU,
memory, Django request rate, DB query rate) should appear automatically
within a minute of the pipeline's "Deploy Monitoring" stage running, under
Dashboards.

## Custom domain + HTTPS

`healthraa.duckdns.org` (free DuckDNS subdomain) points at the app. Two
constraints shaped this differently from the "ACM cert + ALB" default:

- **DuckDNS only supports A records** (no CNAME), but an ALB has no static
  IP — its underlying IPs can change at any time. Pointing an A record at a
  snapshot of an ALB's IP would eventually break.
- **AWS ACM can't issue a certificate for `healthraa.duckdns.org`** — ACM
  validates domain ownership, which isn't possible for a subdomain of a
  registrar-level domain (`duckdns.org`) this account doesn't control.

So instead: an Elastic IP gives a genuinely static address, `ingress-nginx`
(not the ALB controller) terminates TLS directly using a cert-manager /
Let's Encrypt certificate (HTTP-01 validation, which only needs the domain
to resolve to something that can answer the challenge — it doesn't care who
owns the parent domain).

```
Internet
   |
   v
Elastic IP 44.219.226.81 (static)
   |
   v
Network Load Balancer (AWS Load Balancer Controller, target-type=ip)
   |
   v
ingress-nginx controller  <-- cert-manager auto-renews the Let's Encrypt cert
   |
   +--> /        healthra-frontend
   +--> /api     healthra-backend
   +--> /admin   healthra-backend

DuckDNS A record: healthraa.duckdns.org -> 44.219.226.81  (set once, manually)
```

One-time setup (already done):

```bash
# Static IP for the ingress
aws ec2 allocate-address --domain vpc \
  --tag-specifications 'ResourceType=elastic-ip,Tags=[{Key=Name,Value=healthra-ingress-eip}]'

# ingress-nginx behind an NLB bound to that EIP, in a single AZ (matching
# the single EIP — see note below on why the controller is pinned to a zone)
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace \
  --set controller.service.type=LoadBalancer \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-type"=external \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-nlb-target-type"=ip \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-scheme"=internet-facing \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-subnets"=<PUBLIC_SUBNET_ID> \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-eip-allocations"=<EIP_ALLOCATION_ID> \
  --set controller.ingressClassResource.name=nginx \
  --set controller.ingressClassResource.default=false \
  --set controller.nodeSelector."topology\.kubernetes\.io/zone"=<AZ_OF_THAT_SUBNET>

# cert-manager
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager -n cert-manager --create-namespace --set crds.enabled=true

kubectl apply -f kubernetes/cluster-issuer.yaml
```

**Why `controller.nodeSelector` pins the ingress-nginx pod to one AZ**: the
NLB is only bound to one subnet/AZ (to keep it to a single EIP). An NLB
target in an AZ the load balancer isn't configured for shows as
`Target.NotInUse` and silently never receives traffic — connections just
hang. With only 1 ingress-nginx replica, Kubernetes could otherwise schedule
it onto the node in the *other* AZ, which is exactly what happened the first
time and looked like a stuck cert-manager HTTP-01 challenge (self-check
timing out) before the real cause — an AZ mismatch — was found. If this ever
needs multi-AZ ingress HA, that requires a second EIP + adding the second
public subnet to `aws-load-balancer-subnets`/`aws-load-balancer-eip-allocations`,
and DuckDNS can still only be pointed at one of the two IPs.

**Renewal**: cert-manager renews automatically (default ~30 days before the
90-day Let's Encrypt expiry) as long as `healthraa.duckdns.org` keeps
resolving to `44.219.226.81` — no action needed unless the EIP is ever
deallocated. If DuckDNS's own IP is ever changed, cert-manager also needs
the ClusterIssuer's HTTP-01 solver to reach the new address for the next
renewal to succeed.

## Known follow-ups / not done here

- The RDS instance is single-AZ (no standby) to keep cost down. Enable
  Multi-AZ if uptime during AZ failure/maintenance matters.
- Grafana admin password and the DB/Django secrets were generated once during
  this setup and handed to the account owner out-of-band — rotate
  periodically, and consider migrating to AWS Secrets Manager + External
  Secrets Operator instead of Jenkins-credential-injected plain `Secret`s if
  this grows beyond a single-cluster setup.
