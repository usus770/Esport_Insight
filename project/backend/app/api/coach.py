from fastapi import APIRouter, HTTPException
from app.coach import coach, PlayerMetrics

router = APIRouter()

@router.post("/analyze")
async def analyze_player_performance(metrics: PlayerMetrics):
    try:
        return coach.analyze(metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
