# CyberShield AI — Security Lab API (Node.js + Express)

A standalone REST API that powers the Security Testing Lab module.

## Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/security-lab/simulate` | Analyse custom security activity data |
| `POST` | `/api/security-lab/upload` | Upload a file for static threat analysis |
| `GET` | `/api/security-lab/result` | Fetch the most recent analysis result |

---

## Quick Start

```bash
cd security-lab-server
npm install
npm start          # or: npm run dev (with auto-reload via nodemon)
```

Server runs on **http://localhost:3001**

---

## POST /api/security-lab/simulate

**Request body (JSON):**

```json
{
  "login_hour": 2,
  "failed_logins": 15,
  "known_device": 0,
  "download_mb": 12000,
  "sensitive_file_access": 1,
  "antivirus_active": 0
}
```

| Field | Type | Description |
|-------|------|-------------|
| `login_hour` | `number` (0–23) | Hour of login |
| `failed_logins` | `number` | Number of failed login attempts |
| `known_device` | `0` or `1` | Whether the device is recognised |
| `download_mb` | `number` | Data downloaded (MB) |
| `sensitive_file_access` | `0` or `1` | Whether sensitive files were accessed |
| `antivirus_active` | `0` or `1` | Whether antivirus is running |

**Response (JSON):**

```json
{
  "request_id": "uuid",
  "timestamp": "2026-07-16T...",
  "is_anomaly": true,
  "classification": "Anomaly",
  "severity": "Critical",
  "ml_anomaly_score": 95,
  "cybersecurity_risk_score": 100,
  "final_risk_score": 98,
  "behaviour_difference": "Extreme Deviation",
  "reasons": [
    "Login time 2:00 is outside normal working hours (06:00–20:00)",
    "15 failed login attempts — possible brute-force attack"
  ],
  "model": "Isolation Forest (Node heuristic)",
  "training_records": 50000,
  "input": { ... }
}
```

---

## POST /api/security-lab/upload

Upload a file using `multipart/form-data` with field name `file`.

```bash
curl -X POST http://localhost:3001/api/security-lab/upload \
  -F "file=@suspicious.exe"
```

**Response:**

```json
{
  "request_id": "uuid",
  "timestamp": "...",
  "file_name": "suspicious.exe",
  "file_size_bytes": 204800,
  "file_extension": ".exe",
  "verdict": "Malicious",
  "risk_score": 70,
  "threat_signatures": [
    "Executable file type detected (.exe)"
  ],
  "scan_engine": "CyberShield Static Analyser v1.0"
}
```

---

## GET /api/security-lab/result

Returns the most recent analysis result (from either `/simulate` or `/upload`).

```bash
curl http://localhost:3001/api/security-lab/result
```
