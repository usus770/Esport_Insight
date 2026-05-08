# Setup Instructions

## Prerequisites

1. **Install Docker Desktop** (if not already installed):
   - Download from: https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop
   - Ensure Docker is running (you should see the Docker icon in your system tray)

2. **Verify Docker Installation**:
   ```powershell
   docker --version
   docker compose version
   ```

## Quick Start

### Step 1: Create Environment File

The `.env` file should already exist. If not, create it in the project root with:
```
OPENDOTA_BASE=https://api.opendota.com/api
CACHE_DIR=/data/cache
```

### Step 2: Build and Start Services

```powershell
docker compose up --build
```

This will:
- Build the backend Python container
- Build the frontend React container
- Start both services
- Backend API will be available at: http://localhost:8000
- Frontend UI will be available at: http://localhost:5173

### Step 3: Train the Model

Open a **new terminal** and run:

```powershell
docker compose exec api python -c "import app._train_once"
```

This will:
- Fetch 100 pro matches from OpenDota
- Extract features from each match
- Train a RandomForest model
- Save the model to `/data/model.joblib`

### Step 4: Access the Application

1. Open your browser to: **http://localhost:5173**
2. Enter a match ID or click "Use first pro match"
3. View match information and live win probability chart

## Troubleshooting

### Docker not found
- Ensure Docker Desktop is installed and running
- Restart your terminal after installing Docker
- Check Docker Desktop is running (system tray icon)

### Port already in use
- Stop other services using ports 8000 or 5173
- Or modify ports in `docker-compose.yml`

### Model training fails
- Ensure the API container is running: `docker compose ps`
- Check logs: `docker compose logs api`
- The OpenDota API may be rate-limited; wait a few minutes and retry

### Frontend can't connect to API
- Verify API is running: `docker compose ps`
- Check API logs: `docker compose logs api`
- Ensure `VITE_API_URL` in docker-compose.yml matches your setup

## Development Commands

```powershell
# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild after code changes
docker compose up --build

# Access API container shell
docker compose exec api bash

# Access frontend container shell
docker compose exec web sh
```

## API Endpoints

Once running, test the API:

- `GET http://localhost:8000/api/pro-matches` - List pro matches
- `GET http://localhost:8000/api/match/{match_id}` - Get match details
- `POST http://localhost:8000/api/predict` - Predict win probability
- `WS ws://localhost:8000/ws/live/{match_id}` - WebSocket live updates

## Next Steps

After the project is running:
1. Train the model (Step 3 above)
2. Open the UI and test with a real match ID
3. Check the API documentation at: http://localhost:8000/docs










