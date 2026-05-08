from fastapi import APIRouter

router = APIRouter()

@router.post("/win-probability")
async def predict_win_probability(match_data: dict):
    # Integration with XGBoost model will happen here
    return {"radiant_win_prob": 0.5, "dire_win_prob": 0.5}

@router.post("/performance-trend")
async def predict_performance(player_id: int):
    # Integration with LSTM/Transformer will happen here
    return {"trend": "improving", "next_match_projection": "high"}
