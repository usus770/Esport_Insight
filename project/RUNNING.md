# Running EsportInsight

This file summarizes how to run the project both with Docker and locally (dev) and includes debug steps if `docker compose up` fails.

Prerequisites:
- Docker Desktop (Windows)
- Node.js + npm (for frontend dev, optional)
- Python 3.11+ and `virtualenv` (for backend dev, optional)

Docker recommended
------------------
From the project root (d:\project):

1. Create `.env` if missing:

```powershell
if (-not (Test-Path ".env")) {
  @"
OPENDOTA_BASE=https://api.opendota.com/api
CACHE_DIR=/data/cache
"@ | Out-File -FilePath .env -Encoding utf8
}
```

2. Start with Docker Compose:

```powershell
# Build and run in foreground
docker compose up --build

# Or in detached mode
docker compose up --build -d
```

If docker compose fails, helpful commands:

```powershell
# Show logs (all services)
docker compose logs -f

# Show logs for backend only
docker compose logs -f api

# Rebuild with no cache
docker compose build --no-cache

# Remove existing containers and volumes
docker compose down -v
```

Common issues and fixes:
- If the `api` service fails during pip install, check for build tool errors. Consider adding build dependencies in the `backend/Dockerfile` if the error mentions GCC, "failed building wheel", or missing headers.
- If the Docker service cannot mount `d:\project\backend\app` to `/app/app`, confirm Docker Desktop file sharing settings for your drive and that your user has permission to mount the path.
- If the frontend `web` fails, check `package.json` and run `npm ci` locally.

Local dev (without Docker)
-------------------------
Backend (Python venv):

```powershell
cd d:\project\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Use .env from project root for OPENDOTA_BASE and CACHE_DIR
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Frontend (node):

```powershell
cd d:\project\frontend
npm install
$env:VITE_API_URL="http://localhost:8000"
npm run dev
```

Tests
-----
To run backend tests (locally in Python venv):

```powershell
.\.venv\Scripts\Activate.ps1
pytest tests/
```

Or using Docker:

```powershell
docker compose exec api pytest tests/
```

If you hit a specific error running `docker compose up`, please copy-paste the `docker compose logs api --no-color --tail 200` output here — that will help me pinpoint the failure.


If you'd like, I can also add a PowerShell helper `run-local.ps1` to start both backend and frontend in dev mode. Let me know if you'd prefer that and whether you want me to assume Node is installed on the host or prefer Docker for both services.