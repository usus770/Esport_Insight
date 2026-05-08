from fastapi import APIRouter
from app.data_pipeline.ingest_opendota import OpenDotaIngestor

router = APIRouter()
ingestor = OpenDotaIngestor()

@router.get("/live")
async def get_live_matches():
    matches = ingestor.get_live_matches()
    # Transform for frontend if necessary, or return raw for now
    return matches

@router.get("/")
async def get_matches():
    return ingestor.get_pro_matches()

@router.get("/{match_id}")
async def get_match_details(match_id: int):
    # In a real scenario, we'd query our DB or OpenDota for specific match stats
    # and run our ML model for the predictions.
    # For now, we return a rich mock structure to power the UI.
    
    import random
    
    # Simulate win probability fluctuating over time
    timeline = list(range(0, 30)) # 30 minutes
    win_probs = [0.5]
    for _ in range(29):
        change = random.uniform(-0.05, 0.05)
        new_prob = max(0.1, min(0.9, win_probs[-1] + change))
        win_probs.append(new_prob)
        
    # Valid item IDs that correspond to images in frontend
    valid_ids = [
        1, 29, 36, 41, 44, 46, 63, 116, 137, 147, 152, 114, 
        102, 108, 110, 154, 158, 2, 3, 4, 5, 29, 30, 116, 137
    ]

    # Simulate players
    players = []
    # Radiant
    for i in range(5):
        players.append({
            "account_id": i,
            "name": ["Yatoro", "Mira", "Collapse", "Larl", "Miposhka"][i],
            "hero_name": ["Morphling", "Rubick", "Magnus", "Puck", "Bane"][i],
            "player_slot": i, # 0-4 for Radiant
            "team": "radiant",
            "kills": random.randint(0, 15),
            "deaths": random.randint(0, 10),
            "assists": random.randint(0, 20),
            "net_worth": random.randint(5000, 25000),
            "gold_per_min": random.randint(300, 900),
            "xp_per_min": random.randint(300, 900),
            "last_hits": random.randint(50, 400),
            "denies": random.randint(0, 30),
            "kda": f"{random.randint(0, 15)}/{random.randint(0, 10)}/{random.randint(0, 20)}",
            "hero_damage": random.randint(10000, 50000),
            "tower_damage": random.randint(0, 5000),
            "hero_healing": random.randint(0, 2000),
            "level": random.randint(15, 30),
            "gold": random.randint(0, 5000),
            "item_0": random.choice(valid_ids),
            "item_1": random.choice(valid_ids),
            "item_2": random.choice(valid_ids),
            "item_3": random.choice(valid_ids),
            "item_4": random.choice(valid_ids),
            "item_5": random.choice(valid_ids)
        })
    # Dire
    for i in range(5):
        players.append({
            "account_id": i+5,
            "name": ["Dyrachyo", "Quinn", "Ace", "tOfu", "Seleri"][i],
            "hero_name": ["Alchemist", "Leshrac", "Dark Seer", "Techies", "Chen"][i],
            "player_slot": i + 128, # 128-132 for Dire
            "team": "dire",
            "kills": random.randint(0, 15),
            "deaths": random.randint(0, 10),
            "assists": random.randint(0, 20),
            "net_worth": random.randint(5000, 25000),
            "gold_per_min": random.randint(300, 900),
            "xp_per_min": random.randint(300, 900),
            "last_hits": random.randint(50, 400),
            "denies": random.randint(0, 30),
            "kda": f"{random.randint(0, 15)}/{random.randint(0, 10)}/{random.randint(0, 20)}",
            "hero_damage": random.randint(10000, 50000),
            "tower_damage": random.randint(0, 5000),
            "hero_healing": random.randint(0, 2000),
            "level": random.randint(15, 30),
            "gold": random.randint(0, 5000),
            "item_0": random.choice(valid_ids),
            "item_1": random.choice(valid_ids),
            "item_2": random.choice(valid_ids),
            "item_3": random.choice(valid_ids),
            "item_4": random.choice(valid_ids),
            "item_5": random.choice(valid_ids)
        })

    return {
        "match_id": match_id,
        "status": "Live Analysis",
        "duration": random.randint(300, 2400), # Add simulated duration
        "radiant_team": "Team Spirit",
        "dire_team": "Gaimin Gladiators", 
        "radiant_score": sum(p['kills'] for p in players if p['team'] == 'radiant'),
        "dire_score": sum(p['kills'] for p in players if p['team'] == 'dire'),
        "players": players,
        "prediction": {
            "win_probability": win_probs[-1], 
            "timeline": timeline,
            "win_prob_series": win_probs
        }
    }
