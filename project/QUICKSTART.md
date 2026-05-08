# EsportInsight - Quick Start Guide

## Prerequisites

- Docker Desktop installed and running
- Terminal/PowerShell access

## Step-by-Step Setup

### 1. Start Docker Desktop
Make sure Docker Desktop is running (check system tray for whale icon).

### 2. Navigate to Project Directory
```powershell
cd D:\project
```

### 3. Start the Services
```powershell
docker compose up -d --build
```

This will:
- Build the Docker image
- Start the API container
- Expose the API on port 8000

### 4. Wait for Services to Start
Wait about 10-15 seconds for the container to fully start, then check status:
```powershell
docker compose ps
```

You should see the container running.

### 5. Seed the Meta Database (First Time Only)
```powershell
Invoke-RestMethod -Uri http://localhost:8000/api/admin/meta/seed -Method POST
```

Or using curl (if available):
```powershell
curl -X POST http://localhost:8000/api/admin/meta/seed
```

### 6. Train the Model (First Time Only)
```powershell
docker compose exec api python -m app._train_once
```

This will:
- Fetch 100 pro matches
- Extract features
- Train the ML model
- Save model to `/data/model.joblib`

**Note**: This may take 2-5 minutes depending on API response times.

### 7. Verify Everything is Working

**Health Check:**
```powershell
Invoke-RestMethod -Uri http://localhost:8000/api/health
```

**Get Pro Matches:**
```powershell
Invoke-RestMethod -Uri http://localhost:8000/api/pro-matches | ConvertTo-Json
```

**View API Documentation:**
Open in browser: http://localhost:8000/docs

## Common Commands

### View Logs
```powershell
docker compose logs -f api
```

### Stop Services
```powershell
docker compose down
```

### Restart Services
```powershell
docker compose restart
```

### Rebuild After Code Changes
```powershell
docker compose up -d --build
```

### Access Container Shell
```powershell
docker compose exec api bash
```

## Testing Endpoints

### 1. Get Match Features
```powershell
# First, get a match ID
$matches = Invoke-RestMethod -Uri http://localhost:8000/api/pro-matches
$matchId = $matches[0].match_id

# Get features
Invoke-RestMethod -Uri "http://localhost:8000/api/match/$matchId/features" | ConvertTo-Json -Depth 5
```

### 2. Predict Win Probability
```powershell
$body = @{
    avg_gpm = 500.0
    avg_xpm = 600.0
    kill_participation_avg = 0.5
    first_blood_time = 120.0
    tower_status_delta = 2
    hero_diversity_delta = 0
    meta_wr_delta = 0.02
    meta_pk_delta = 0.01
    duration = 1800.0
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:8000/api/predict -Method POST -Body $body -ContentType "application/json"
```

### 3. Get Live Matches
```powershell
Invoke-RestMethod -Uri http://localhost:8000/api/live | ConvertTo-Json
```

## Troubleshooting

### Container Won't Start
1. Check Docker Desktop is running
2. Check port 8000 is not in use: `netstat -ano | findstr :8000`
3. View logs: `docker compose logs api`

### API Not Responding
1. Check container status: `docker compose ps`
2. Check logs: `docker compose logs api --tail 50`
3. Restart: `docker compose restart`

### Model Not Found
If prediction returns 0.5, the model hasn't been trained:
```powershell
docker compose exec api python -m app._train_once
```

### Permission Errors
On Windows, ensure Docker Desktop has proper permissions and WSL2 is enabled.

## Next Steps

Once everything is running:
1. Explore the API docs at http://localhost:8000/docs
2. Test different match IDs
3. Experiment with predictions
4. Check player summaries and role assignments

## Project Structure

```
D:\project\
├── backend/
│   ├── app/          # Application code
│   ├── Dockerfile    # Container definition
│   └── requirements.txt
├── tests/            # Unit tests
├── docker-compose.yml
├── .env              # Environment variables
└── README.md         # Full documentation
```

## Support

- API Documentation: http://localhost:8000/docs
- Status: See `STATUS.md`
- Full README: See `README.md`






