import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_curve, auc, confusion_matrix, ConfusionMatrixDisplay
import os
import sys

# Add backend to path
# Add backend to path - need to go up two levels from app/
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.core.config import settings
from app.ml_models.evaluate_models import calculate_stats, build_features

def generate_plots():
    print("Generating ROC and Confusion Matrix plots...")
    
    # 1. Load Data
    # Fixed path logic: app -> backend -> project -> dataset
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "dataset"))
    matches_path = os.path.join(base_path, "match.csv")
    players_path = os.path.join(base_path, "players.csv")
    
    matches = pd.read_csv(matches_path)[['match_id', 'radiant_win']].dropna()
    players = pd.read_csv(players_path)[['match_id', 'account_id', 'hero_id', 'player_slot', 'gold_per_min']]
    
    # Sample for speed (similar to evaluate_models.py)
    if len(matches) > 10000:
        matches = matches.sample(10000, random_state=42)
        
    all_match_ids = matches['match_id'].unique()
    train_ids, test_ids = train_test_split(all_match_ids, test_size=0.2, random_state=42)
    
    # 2. Prepare Features
    train_matches_df = matches[matches['match_id'].isin(train_ids)]
    train_players_df = players[players['match_id'].isin(train_ids)]
    hero_stats = calculate_stats(train_matches_df, train_players_df)
    
    X_train, y_train = build_features(train_ids, matches, players, hero_stats)
    X_test, y_test = build_features(test_ids, matches, players, hero_stats)
    
    # 3. Train Model
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.05,
        eval_metric='logloss'
    )
    model.fit(X_train, y_train)
    
    # 4. Predict
    y_prob = model.predict_proba(X_test)[:, 1]
    y_pred = model.predict(X_test)
    
    # 5. Plot ROC Curve
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    roc_auc = auc(fpr, tpr)
    
    plt.figure(figsize=(8, 6))
    plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic (Mid-Game Model)')
    plt.legend(loc="lower right")
    plt.grid(True)
    
    roc_path = "roc_curve_generated.png"
    plt.savefig(roc_path)
    print(f"Saved ROC curve to {roc_path}")
    
    # 6. Plot Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=["Dire Win", "Radiant Win"])
    
    fig, ax = plt.subplots(figsize=(8, 6))
    disp.plot(cmap=plt.cm.Blues, ax=ax)
    plt.title("Confusion Matrix")
    
    cm_path = "confusion_matrix_generated.png"
    plt.savefig(cm_path)
    print(f"Saved Confusion Matrix to {cm_path}")

if __name__ == "__main__":
    try:
        generate_plots()
    except Exception as e:
        import traceback
        traceback.print_exc()
