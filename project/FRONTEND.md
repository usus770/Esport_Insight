# Frontend Setup & Running Guide

## Quick Start

### 1. Start Both Services (Backend + Frontend)

```powershell
docker compose up -d --build
```

This will start:
- **Backend API** on port 8000
- **Frontend** on port 5173

### 2. Access the Frontend

Open your browser to: **http://localhost:5173**

### 3. Use the Application

1. Enter a match ID in the input field, or
2. Click "Use first pro match" to load a recent match
3. View:
   - Match features (GPM, XPM, duration, etc.)
   - Win probability prediction
   - Player performance summaries with role assignments
   - Feature visualization chart

## Frontend Features

### Match Analysis
- **Match Features**: Displays all 9 match-level features
- **Win Probability**: Shows ML model prediction for Radiant win probability
- **Player Summaries**: Shows all 10 players with:
  - Role assignment (Carry, Mid, Offlane, Support, Hard Support)
  - Performance metrics (GPM, XPM, KDA)
  - Benchmark comparisons (deltas vs pro standards)

### Visualizations
- **Feature Chart**: Bar chart showing all match features
- Color-coded features (green for positive, red for negative)

## Development

### Run Frontend Only (Development Mode)

If you want to run frontend separately (for development):

```powershell
cd frontend
npm install
npm run dev
```

### Build for Production

```powershell
cd frontend
npm run build
```

### Frontend Structure

```
frontend/
├── src/
│   ├── App.tsx              # Main application component
│   ├── api.ts                # API client functions
│   ├── main.tsx              # React entry point
│   └── components/
│       ├── MatchInfo.tsx     # Match and player info display
│       └── WinProbChart.tsx  # Feature visualization
├── package.json
├── vite.config.ts
└── Dockerfile
```

## API Integration

The frontend uses these backend endpoints:

- `GET /api/pro-matches` - Get list of pro matches
- `GET /api/match/{id}/features` - Get match features and player summaries
- `POST /api/predict` - Predict win probability

## Troubleshooting

### Frontend Won't Load

1. Check both containers are running:
   ```powershell
   docker compose ps
   ```

2. Check frontend logs:
   ```powershell
   docker compose logs web
   ```

3. Verify API is accessible:
   ```powershell
   Invoke-RestMethod -Uri http://localhost:8000/api/health
   ```

### CORS Issues

The backend has CORS enabled for all origins. If you see CORS errors:
- Check backend is running
- Verify `VITE_API_URL` environment variable in docker-compose.yml

### Port Already in Use

If port 5173 is in use:
1. Change port in `docker-compose.yml`:
   ```yaml
   ports: ["5174:5173"]
   ```
2. Or stop the service using port 5173

## Environment Variables

The frontend uses `VITE_API_URL` to connect to the backend:
- Default: `http://localhost:8000`
- Set in `docker-compose.yml` under `web` service `environment`

## Next Steps

- Customize the UI styling
- Add more visualizations
- Implement real-time updates via WebSocket
- Add match history
- Add player comparison features






