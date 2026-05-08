# Step-by-Step Guide to Run the Project

## Current Status ✅
- **Docker Desktop**: Running
- **Backend API**: Running on http://localhost:8000
- **Frontend**: Running on http://localhost:5173
- **Containers**: Both `project-api-1` and `project-web-1` are up

---

## Quick Start (If Already Running)

### Step 1: Verify Services Are Running
```powershell
docker compose ps
```

You should see both containers with status "Up".

### Step 2: Access the Application
- **Frontend UI**: Open http://localhost:5173 in your browser
- **API Documentation**: Open http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

---

## Complete Setup Steps (First Time or After Restart)

### Step 1: Ensure Docker Desktop is Running
- Check system tray for Docker whale icon
- If not running, start Docker Desktop from Start Menu
- Wait until it shows "Docker Desktop is running"

### Step 2: Navigate to Project Directory
```powershell
cd D:\project
```

### Step 3: Check/Create .env File
```powershell
if (-not (Test-Path ".env")) {
    @"
OPENDOTA_BASE=https://api.opendota.com/api
CACHE_DIR=/data/cache
"@ | Out-File -FilePath .env -Encoding utf8
}
```

### Step 4: Start the Services
```powershell
docker compose up -d --build
```

This will:
- Build Docker images (if needed)
- Start backend API container
- Start frontend web container
- Expose API on port 8000
- Expose frontend on port 5173

### Step 5: Wait for Services to Start
Wait 10-15 seconds, then verify:
```powershell
docker compose ps
```

Both containers should show status "Up".

### Step 6: Verify Services Are Responding
```powershell
# Check backend
Invoke-RestMethod -Uri http://localhost:8000/api/health

# Check frontend (should return HTML)
Invoke-WebRequest -Uri http://localhost:5173 -UseBasicParsing
```

### Step 7: Seed Meta Database (First Time Only)
```powershell
Invoke-RestMethod -Uri http://localhost:8000/api/admin/meta/seed -Method POST
```

This populates hero meta data (win rates, pick rates).

### Step 8: Train the ML Model (First Time Only)
```powershell
docker compose exec api python -m app._train_once
```

This will:
- Fetch 100 pro matches from OpenDota
- Extract features
- Train a RandomForest model
- Save model to `/data/model.joblib`

**Note**: This may take 2-5 minutes depending on API response times.

---

## Access Points

### Frontend Application
- **URL**: http://localhost:5173
- **Features**: Match analysis, win probability predictions, player stats

### Backend API
- **Base URL**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

### API Endpoints
- `GET /api/health` - Health check
- `GET /api/pro-matches` - Recent pro matches
- `GET /api/live` - Live matches
- `GET /api/match/{match_id}` - Match details
- `GET /api/match/{match_id}/features` - Match features with meta
- `POST /api/predict` - Predict win probability
- `POST /api/admin/meta/seed` - Seed meta database

---

## Useful Commands

### View Logs
```powershell
# All services
docker compose logs -f

# Backend only
docker compose logs -f api

# Frontend only
docker compose logs -f web
```

### Stop Services
```powershell
docker compose down
```

### Restart Services
```powershell
docker compose restart
```

### Rebuild and Restart
```powershell
docker compose up -d --build
```

### Check Container Status
```powershell
docker compose ps
```

### Access Container Shell
```powershell
# Backend container
docker compose exec api bash

# Frontend container
docker compose exec web sh
```

---

## Troubleshooting

### Services Won't Start
1. Check Docker Desktop is running
2. Check ports 8000 and 5173 are not in use:
   ```powershell
   netstat -ano | findstr ":8000 :5173"
   ```
3. View logs for errors:
   ```powershell
   docker compose logs
   ```

### Port Already in Use
If ports are occupied, stop the conflicting service or modify `docker-compose.yml` to use different ports.

### Container Keeps Restarting
Check logs for errors:
```powershell
docker compose logs api
docker compose logs web
```

### Model Predictions Return 0.5
The model hasn't been trained. Run:
```powershell
docker compose exec api python -m app._train_once
```

### Frontend Can't Connect to API
- Verify API is running: `docker compose ps`
- Check API health: `Invoke-RestMethod -Uri http://localhost:8000/api/health`
- Check frontend logs: `docker compose logs web`


### Model Evaluation
To run the model evaluation script (simulating mid-game win probability):
```powershell
docker compose exec api python app/ml_models/evaluate_models.py
```
Or locally (if setup):
```powershell
cd backend
.\.venv\Scripts\python.exe app/ml_models/evaluate_models.py
```

---

## Alternative: Run Locally (Without Docker)

### Backend Only
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Only
```powershell
cd frontend
npm install
$env:VITE_API_URL = "http://localhost:8000"
npm run dev
```

---

## Current Status Check

Run this to see current status:
```powershell
Write-Host "=== Project Status ===" -ForegroundColor Cyan
docker compose ps
Write-Host "`nBackend: " -NoNewline
try { 
    $h = Invoke-RestMethod -Uri http://localhost:8000/api/health -TimeoutSec 2
    Write-Host "Running - $($h.status)" -ForegroundColor Green
} catch { 
    Write-Host "Not responding" -ForegroundColor Red
}
Write-Host "Frontend: " -NoNewline
try { 
    $w = Invoke-WebRequest -Uri http://localhost:5173 -UseBasicParsing -TimeoutSec 2
    Write-Host "Running (HTTP $($w.StatusCode))" -ForegroundColor Green
} catch { 
    Write-Host "Not responding" -ForegroundColor Red
}
```


