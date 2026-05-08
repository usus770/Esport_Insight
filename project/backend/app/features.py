"""Feature engineering for match and player-level features."""
import pandas as pd
from typing import Dict, List, Any, Tuple, Optional
from .meta import get_hero_meta, add_meta_features

def build_match_features(match_json: dict) -> dict:
    """
    Extract Draft-based features.
    
    Returns:
        {
            "X": match_feats dict,
            "y": int(radiant_win),
            "players": [player_feats dict...]
        }
    """
    players_data = match_json.get("players", [])
    if not players_data:
        return {}
    
    # Standardize player data
    clean_players = []
    for p in players_data:
        clean_p = {
            "hero_id": int(p.get("hero_id", 0)),
            # Slot 0-4 (0-127) is Radiant
            "is_radiant": p.get("isRadiant", False) if "isRadiant" in p else (int(p.get("player_slot", 0)) < 128),
            "player_slot": int(p.get("player_slot", 0))
        }
        clean_players.append(clean_p)
        
    # Match-level features (Draft Only)
    match_feats = {}
    
    # 1. Meta Features (Hero Win Rates)
    hero_meta = get_hero_meta()
    match_feats = add_meta_features(match_feats, clean_players, hero_meta)
    
    # 2. One-Hot Encoding
    radiant_heroes = [p["hero_id"] for p in clean_players if p["is_radiant"]]
    dire_heroes = [p["hero_id"] for p in clean_players if not p["is_radiant"]]
    
    MAX_HERO_ID = 138
    for hid in range(1, MAX_HERO_ID + 1):
        if hid in radiant_heroes:
            match_feats[f"hero_{hid}"] = 1
        elif hid in dire_heroes:
            match_feats[f"hero_{hid}"] = -1
        else:
            match_feats[f"hero_{hid}"] = 0
            
    # Target
    y = 1 if match_json.get("radiant_win") else 0
    
    return {
        "X": match_feats,
        "y": y,
        "players": clean_players
    }

def to_dataframe(rows: List[Dict[str, Any]]) -> Tuple[pd.DataFrame, Optional[List[int]]]:
    """
    Convert list of feature dicts to DataFrame.
    """
    if not rows:
        return pd.DataFrame(), None
    
    dfX = pd.DataFrame([r["X"] for r in rows if "X" in r])
    y = [r["y"] for r in rows if "y" in r]
    
    # Ensure all OHE columns exist (in case of empty batch where some hero never appears)
    # Actually, pandas handles dense matrix fine, but for inference we might need to enforce schema.
    # For now, we assume training data has enough coverage or `model.py` handles missing cols.
    
    return dfX, y if y else None



