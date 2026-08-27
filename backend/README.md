# Healthra Backend

Django + Django REST Framework API for the Healthra appointment-booking
frontend. As simple as it gets: **one table, static login, no authorization.**

## Design

| File                 | Responsibility                                    |
|----------------------|-------------------------------------------------------|
| `api/models.py`      | `Appointment` — the only table                         |
| `api/serializers.py` | Login input shape + appointment serializer             |
| `api/views.py`       | Static-credential login + open appointment CRUD        |
| `api/urls.py`        | Routes, mounted under `/api/` in `config/urls.py`       |
| `api/admin.py`       | Admin registration for `Appointment`                     |

There is no user/account model, no JWT, no login sessions, and no per-request
authorization. Every endpoint is public (`AllowAny`). This mirrors what the
frontend's `localStorage` demo already does:

- **Login** just checks the submitted email/password against one hardcoded
  pair (`STATIC_LOGIN` in settings, configurable via `.env`). No token is
  issued — a `200` with `{name, email}` means "correct", a `401` means
  "wrong."
- **Appointments** are plain CRUD, filterable by `?patient_email=` so a
  frontend can show "my bookings" the same way the old `getBookings(email)`
  helper did — just against a real API and database instead of
  `localStorage`.

## Data model

```
Appointment
  id
  department, doctor, time_slot   (plain text)
  date
  patient_name, patient_phone, patient_email, reason
  status: pending | confirmed | cancelled | completed
  created_at
```

## Setup

```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
```

**Quickest path (SQLite, no DB install):** in `.env`, set `USE_SQLITE=True`,
then:

```bash
python manage.py migrate
python manage.py runserver
```

**Postgres:** leave `USE_SQLITE` unset/`False`, edit the `DB_*` values in
`.env`, make sure Postgres is running and the DB exists (e.g.
`createdb healthra`), then run the same two commands above.

The API is served at `http://127.0.0.1:8000/`. `/admin/` also works if you
run `python manage.py createsuperuser` (uses Django's own default admin
login — unrelated to the static frontend login below).

## API

No `Authorization` header needed anywhere.

### Login
`POST /api/auth/login/`

Request:
```json
{ "email": "human@booking.com", "password": "123456" }
```
Response `200`:
```json
{ "name": "Human", "email": "human@booking.com" }
```
Response `401` (wrong email/password):
```json
{ "detail": "Invalid email or password." }
```

Change the accepted credentials via `.env`:
`STATIC_LOGIN_EMAIL`, `STATIC_LOGIN_PASSWORD`, `STATIC_LOGIN_NAME`.

### Appointments

| Method | Endpoint                    | Notes                                         |
|--------|------------------------------|------------------------------------------------|
| GET    | `/api/appointments/`         | List all. Filter: `?patient_email=`, `?status=`, `?department=`, `?doctor=`, `?date=` |
| POST   | `/api/appointments/`         | Create one                                      |
| GET    | `/api/appointments/<id>/`    | Retrieve one                                    |
| PATCH  | `/api/appointments/<id>/`    | Update one (e.g. `{"status": "cancelled"}`)      |
| DELETE | `/api/appointments/<id>/`    | Delete one                                      |

`POST` body:
```json
{
  "department": "Cardiology",
  "doctor": "Dr. Smith",
  "date": "2026-08-01",
  "time_slot": "10:00 AM",
  "patient_name": "Human",
  "patient_phone": "9998887777",
  "patient_email": "human@booking.com",
  "reason": "Checkup"
}
```
`status` defaults to `"pending"`. Booking the same doctor + date + time_slot
twice (while `pending`/`confirmed`) is rejected with a `400`.
