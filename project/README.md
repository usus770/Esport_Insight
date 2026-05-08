# EsportInsight – Dota 2 (Backend API)

A FastAPI service implementing the first 5 functionalities for real-time Dota 2 match analysis with ML-based win probability predictions.

## Features

1. **Real-Time Data Ingestion** - Fetches live and recent pro matches from OpenDota API with file caching
2. **Data Preprocessing & Feature Engineering** - Match-level and player-level feature extraction
3. **Machine Learning Prediction Module** - RandomForest classifier with meta-aware features
4. **Meta-Awareness** - Patch and hero meta features (winrate, pickrate) influencing predictions
5. **Player-Centric Performance Analysis** - Role-aware summaries and benchmark comparisons

## Quick Start

### Prerequisites

- Docker and Docker Compose installed

### Setup

1. Create the environment file `.env` in the project root:
```bash
OPENDOTA_BASE=https://api.opendota.com/api
CACHE_DIR=/data/cache
```

2. Build and start services:
```bash
docker compose up --build
```

3. Seed meta database (optional):
```bash
curl -X POST http://localhost:8000/api/admin/meta/seed
```

4. Train the baseline model:
```bash
docker compose exec api python -m app._train_once
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/pro-matches` - List recent pro matches (cached 300s)
- `GET /api/live` - Get live matches (cached 30s)
- `GET /api/match/{match_id}` - Get raw match details
- `GET /api/match/{match_id}/features` - Build features, meta-fuse, and player summaries
- `POST /api/predict` - Predict win probability from features
- `POST /api/admin/meta/seed` - Seed meta database (idempotent)

## Sample Usage

### Get pro matches
```bash
curl http://localhost:8000/api/pro-matches
```

### Get match features
```bash
curl http://localhost:8000/api/match/8552688537/features
```

### Predict win probability
```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "avg_gpm": 500.0,
    "avg_xpm": 600.0,
    "kill_participation_avg": 0.5,
    "first_blood_time": 120.0,
    "tower_status_delta": 2,
    "hero_diversity_delta": 0,
    "meta_wr_delta": 0.02,
    "meta_pk_delta": 0.01,
    "duration": 1800.0
  }'
```

## Project Structure

```
esportinsight/
  backend/
    app/
      __init__.py
      main.py          # FastAPI application
      cache.py         # JSON file caching
      opendota.py      # OpenDota API client
      features.py      # Feature extraction
      meta.py          # Meta-awareness (patch/hero meta)
      benchmarks.py    # Pro benchmarks per role
      players.py       # Player-centric analysis
      model.py         # ML model training and prediction
      schemas.py       # Pydantic models
      _train_once.py   # Training script
    requirements.txt
    Dockerfile
  tests/
    test_features.py   # Feature engineering tests
    test_meta.py       # Meta feature tests
  docker-compose.yml
  .env.example
  README.md
```

## Tech Stack

- **Backend**: Python 3.11, FastAPI, scikit-learn, pandas, numpy==1.26.*
- **Storage**: SQLite for meta data, JSON files for cache
- **Infrastructure**: Docker Compose
- **Testing**: pytest

## Running Tests

```bash
docker compose exec api pytest tests/
```

## Notes

- NumPy is pinned to `1.26.4` to avoid binary compatibility issues with pandas/pyarrow
- Model data and cache are persisted in a Docker volume (`modeldata`)
- API responses are cached locally to reduce OpenDota API calls
- Meta database is seeded with dummy data on first run

## Feature Details

### Match Features
- `avg_gpm`, `avg_xpm` - Average gold/XP per minute
- `kill_participation_avg` - Average kill participation
- `first_blood_time` - Time of first blood
- `tower_status_delta` - Tower advantage (radiant - dire)
- `hero_diversity_delta` - Hero diversity difference
- `meta_wr_delta` - Meta winrate advantage
- `meta_pk_delta` - Meta pickrate advantage
- `duration` - Match duration in seconds

### Player Features
- Role inference (1=Carry, 2=Mid, 3=Offlane, 4=Support, 5=Hard Support)
- Performance metrics (GPM, XPM, KDA)
- Benchmark comparisons (deltas vs pro standards)
