# Koperasi Mini - Installation Guide

## System Requirements (Termux/Android)

### Required Termux Packages
```bash
pkg install -y python python-pip nodejs cronie
```

### Start Cron Daemon (for automated backups)
```bash
crond
```

### Verify Cron Running
```bash
ps aux | grep crond
```

### Add Backup Cron Job
```bash
echo "0 2 * * * bash ~/koperasi_mini/backend/backup_db.sh >> ~/koperasi_mini/backend/backup.log 2>&1" | crontab -
```

## Python Dependencies

```bash
cd ~/koperasi_mini/backend
pip install -r requirements.txt
```

## Frontend Dependencies

```bash
cd ~/koperasi_mini/frontend
npm install
```

## Running the App

### Backend (Port 8006)
```bash
cd ~/koperasi_mini/backend
uvicorn app.main:app --host 0.0.0.0 --port 8006 --reload
```

### Frontend (Port 5173)
```bash
cd ~/koperasi_mini/frontend
npm run dev
```

## Verification

### Check Backend
```bash
curl http://localhost:8006/
```

### Check Frontend
Open browser: http://localhost:5173

### Check API with Auth
```bash
TOKEN=$(curl -s -X POST http://localhost:8006/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@koperasi.com","password":"admin123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
curl http://localhost:8006/api/v1/anggota/list \
  -H "Authorization: Bearer $TOKEN"
```
