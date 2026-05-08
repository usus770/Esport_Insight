import joblib
import pandas as pd
import pathlib
import numpy as np
from typing import List, Dict, Any, Optional
from app.opendota import get_heroes

from app.meta import get_hero_meta

MODEL_PATH = pathlib.Path(__file__).parent / "data" / "recommendation_model.joblib"
MAX_HERO_ID = 138

class HeroRecommender:
    _instance = None
    model = None
    heroes_map = {}
    hero_meta = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(HeroRecommender, cls).__new__(cls)
            cls._instance._load_model()
            cls._instance._load_heroes()
            cls._instance._load_meta()
        return cls._instance
        
    def _load_model(self):
        if MODEL_PATH.exists():
            print(f"Loading recommendation model from {MODEL_PATH}...")
            self.model = joblib.load(MODEL_PATH)
        else:
            print(f"Model not found at {MODEL_PATH}")
            self.model = None
            
    def _load_heroes(self):
        print("Loading hero data...")
        try:
            heroes = get_heroes()
            self.heroes_map = {h["id"]: h for h in heroes}
        except Exception as e:
            print(f"Error loading heroes: {e}")
            self.heroes_map = {}

    def _load_meta(self):
        print("Loading hero meta stats...")
        try:
            self.hero_meta = get_hero_meta()
        except Exception as e:
            print(f"Error loading meta: {e}")
            self.hero_meta = {}

    def recommend(self, radiant_picks: List[int], dire_picks: List[int], role: Optional[str] = None, side: str = "radiant") -> List[Dict[str, Any]]:
        if not self.model:
            return []
            
        # available heroes
        picked = set(radiant_picks + dire_picks)
        candidates = []
        
        for hid, hdata in self.heroes_map.items():
            if hid in picked:
                continue
                
            # Role Filtering
            if role:
                hero_roles = [r.lower() for r in hdata.get("roles", [])]
                
                # Simple heuristic mapping
                required = []
                if role.lower() == "carry":
                    required = ["carry"]
                elif role.lower() == "support":
                    required = ["support"]
                elif role.lower() == "hard support":
                    required = ["support"] 
                elif role.lower() == "mid":
                    # Mid isn't a role tag in OD, usually "Nuker" + "Carry" 
                    pass
                elif role.lower() == "offlane":
                    required = ["initiator", "durable"]
                
                if required:
                    match = any(r in hero_roles for r in required)
                    if not match:
                        continue
            
            candidates.append(hid)
            
        results = []
        
        # Batch prediction
        rows = []
        valid_candidates = []
        
        for hid in candidates:
            # Simulate draft
            r_team = list(radiant_picks)
            d_team = list(dire_picks)
            
            if side.lower() == "radiant":
                r_team.append(hid)
            else:
                d_team.append(hid)
                
            # Create feature vector
            feats = {}
            
            # 1. Meta Features
            radiant_wrs = [self.hero_meta.get(h, 0.5) for h in r_team]
            dire_wrs = [self.hero_meta.get(h, 0.5) for h in d_team]
            
            rad_avg = sum(radiant_wrs) / len(radiant_wrs) if radiant_wrs else 0.5
            dire_avg = sum(dire_wrs) / len(dire_wrs) if dire_wrs else 0.5
            
            feats['radiant_avg_wr'] = rad_avg
            feats['dire_avg_wr'] = dire_avg
            feats['wr_diff'] = rad_avg - dire_avg

            # 2. Hero One-Hot Encoding
            for i in range(1, MAX_HERO_ID + 1):
                if i in r_team:
                    feats[f"hero_{i}"] = 1
                elif i in d_team:
                    feats[f"hero_{i}"] = -1
                else:
                    feats[f"hero_{i}"] = 0
            rows.append(feats)
            valid_candidates.append(hid)
            
        if not rows:
            return []
            
        df = pd.DataFrame(rows)
        # Ensure cols (align with model)
        if hasattr(self.model, "feature_names_in_"):
            missing = set(self.model.feature_names_in_) - set(df.columns)
            for c in missing:
                df[c] = 0
            df = df[self.model.feature_names_in_]
            
        # Predict
        try:
            probs = self.model.predict_proba(df)[:, 1] # Prob of Radiant Win
        except Exception as e:
            print(f"Prediction error: {e}")
            return []
        
        for i, hid in enumerate(valid_candidates):
            p_radiant = probs[i]
            
            # Score:
            # If we are Radiant, we want high p_radiant
            # If we are Dire, we want low p_radiant (high p_dire)
            
            win_prob = p_radiant if side.lower() == "radiant" else (1.0 - p_radiant)
            
            hero_info = self.heroes_map.get(hid, {})
            results.append({
                "hero_id": hid,
                "hero_name": hero_info.get("localized_name", f"Hero {hid}"),
                "win_probability": float(win_prob),
                "roles": hero_info.get("roles", [])
            })
            
        # Sort desc
        results.sort(key=lambda x: x["win_probability"], reverse=True)
        
        return results[:3]

recommendation_engine = HeroRecommender()
