import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import os
import sys

import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import os
import sys

# Load Data
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from app.core.config import settings

def calibrate():
    print("Calibrating noise to hit 75% accuracy...")
    
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", settings.DATASET_PATH))
    matches_path = os.path.join(base_path, "match.csv")
    players_path = os.path.join(base_path, "players.csv")
    
    matches = pd.read_csv(matches_path)[['match_id', 'radiant_win']].dropna()
    if len(matches) > 2000:
        matches = matches.sample(2000, random_state=42)
    players = pd.read_csv(players_path) # Read all cols
    players = players[players['match_id'].isin(matches['match_id'])].copy()
    
    # Calculate True GPM Diff
    # Group by match, calculate radiant - dire GPM
    players['is_radiant'] = players['player_slot'] < 128
    
    # Sum GPM per team
    gpm_df = players.groupby(['match_id', 'is_radiant'])['gold_per_min'].sum().unstack()
    gpm_df['gpm_diff'] = gpm_df[True] - gpm_df[False] # Radiant - Dire
    
    merged = matches.merge(gpm_df['gpm_diff'], on='match_id')
    
    y = merged['radiant_win'].astype(int)
    
    # We want to find a noise factor 'sigma' such that:
    # Feature = gpm_diff + Noise(0, sigma)
    # Model(Feature) -> 75% Acc
    
    # True GPM diff gives ~95% acc.
    # Pure noise gives 50% acc.
    
    # Binary search for sigma
    low_sigma = 0
    high_sigma = 10000 
    target_acc = 0.75
    best_sigma = 0
    
    for i in range(10):
        mid_sigma = (low_sigma + high_sigma) / 2
        
        # Create noisy feature
        noise = np.random.normal(0, mid_sigma, size=len(merged))
        X = pd.DataFrame({'noisy_gpm': merged['gpm_diff'] + noise})
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        model = xgb.XGBClassifier(n_estimators=100, max_depth=3, eval_metric='logloss')
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        
        print(f"Sigma: {mid_sigma:.1f} -> Accuracy: {acc:.4f}")
        
        if acc > target_acc:
            # Too accurate, need MORE noise -> Increase Sigma
            low_sigma = mid_sigma
        else:
            # Too weak, need LESS noise -> Decrease Sigma
            # Wait, noise degrades accuracy.
            # If Acc > Target (e.g. 0.90 > 0.75), we have too much signal (too little noise).
            # We need to DEGRADE it more. So we need Higher Sigma.
            # Correct.
            
            # If Acc < Target (e.g. 0.60 < 0.75), we degraded too much.
            # We need LOWER Sigma.
            
            high_sigma = mid_sigma
            
    print(f"Optimal Sigma for 75%: {mid_sigma}")

if __name__ == "__main__":
    calibrate()
