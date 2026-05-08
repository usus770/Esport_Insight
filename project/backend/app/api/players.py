from fastapi import APIRouter
from app.data_pipeline.csv_loader import CsvLoader

router = APIRouter()
loader = CsvLoader()

@router.get("/")
async def get_top_players():
    # Fetch real top players from dataset
    return loader.get_top_players(limit=24)

@router.get("/{account_id}")
async def get_player_profile(account_id: int):
    profile = loader.get_player_profile(account_id)
    if profile:
        return profile
    # Fallback if ID is just not in our specific CSV slice
    return {
        "account_id": account_id,
        "name": f"Player {account_id}",
        "rank": "Unranked",
        "role": "Unknown",
        "team": "Unknown",
        "trend": [],
        "signature_heroes": [],
        "recent_matches": []
    }

@router.get("/{account_id}/performance")
async def get_player_performance(account_id: int):
    # Future: Implement using CsvLoader if dataset has time-series perf data
    return {"account_id": account_id, "recent_matches": []}
