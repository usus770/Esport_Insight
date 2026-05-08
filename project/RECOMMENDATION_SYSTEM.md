# Hero Recommendation System

## Overview
The Hero Recommendation System provides real-time, ML-powered hero suggestions for Dota 2 drafts. It analyzes the current Radiant and Dire picks to suggest the top 3 heroes that maximize the win probability for the selected side.

## Architecture

### Backend (`backend/app/`)
- **Data Source**: High-MMR public matches (Immortal rank) fetched from OpenDota.
- **Model**: `XGBoost` classifier trained on draft composition (Radiant vs Dire heroes).
- **API**: `POST /api/recommend` endpoint serving predictions.
- **Files**:
    - `recommendation.py`: Core logic for loading model and generating recommendations.
    - `recommendation_train.py`: Training pipeline (fetch -> process -> train -> save).
    - `data_pipeline/fetch_data.py`: Data fetching script.

### Frontend (`frontend/src/`)
- **Component**: `HeroRecommendation.tsx` provides the UI for draft input and results.
- **Service**: `api.ts` handles communication with the backend.

## Data Flow
1. **User Action**: User enters draft picks and selects a role/side in Frontend.
2. **API Request**: Frontend sends `radiant_picks`, `dire_picks`, `role`, `side` to Backend (`/api/recommend`).
3. **Inference**:
    - Backend constructs a feature vector (1 for Radiant, -1 for Dire, 0 for others).
    - Model predicts win probability for all available heroes.
    - Heroes are filtered by Role (using OpenDota constants).
4. **Response**: Top 3 heroes with highest win likelihood are returned.
5. **Display**: Frontend shows hero names, win dates, and confidence levels.

## Model Details
- **Algorithm**: XGBoost (or RandomForest baseline).
- **Features**: One-Hot Encoded Hero IDs (Sparse Vector).
- **Target**: Radiant Win (Binary: 0 or 1).
- **Metrics**: ROC-AUC, Accuracy (Tracked in `recommendation_metrics.json`).

## Usage
1. **Train Model**:
   ```bash
   python backend/app/recommendation_train.py
   ```
2. **Run Server**:
   ```bash
   uvicorn backend.app.main:app --reload
   ```
3. **Get Recommendations**:
   Use the UI in the web app or curl:
   ```bash
   curl -X POST "http://localhost:8000/api/recommend" \
        -H "Content-Type: application/json" \
        -d '{"radiant_picks": [1, 5], "dire_picks": [2], "side": "radiant"}'
   ```
