import json
import pandas as pd
import numpy as np
import joblib
import pathlib
import matplotlib.pyplot as plt
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, confusion_matrix, classification_report
try:
    import xgboost as xgb
    USE_XGB = True
except ImportError:
    USE_XGB = False

# Config
DATASET_DIR = pathlib.Path(__file__).parent.parent / "dataset"
DATA_FILE = DATASET_DIR / "public_matches.json"
MODEL_DIR = pathlib.Path(__file__).parent / "data"
MODEL_FILE = MODEL_DIR / "recommendation_model.joblib"
METRICS_FILE = MODEL_DIR / "recommendation_metrics.json"

MAX_HERO_ID = 138  # Approx max hero ID in Dota 2

def load_data():
    """Load matches and prepare features."""
    if not DATA_FILE.exists():
        print(f"Data file not found: {DATA_FILE}")
        return None, None
        
    print(f"Loading data from {DATA_FILE}...")
    with open(DATA_FILE, "r") as f:
        matches = json.load(f)
        
    df = pd.DataFrame(matches)
    
    # Filter valid matches
    df = df.dropna(subset=['radiant_team', 'dire_team', 'radiant_win'])
    
    # Parse hero strings "1,2,3,4,5" -> [1, 2, 3, 4, 5]
    # In publicMatches, 'radiant_team' is usually correct, but let's check format
    # Sample format: {"radiant_team": [1, 2, 3, 4, 5], ...} or string?
    # OpenDota /publicMatches usually returns 'radiant_team': "1,2,3,4,5" (string)
    
    # Let's inspect first row if possible, but assume string based on common API response
    # Actually, previous fetch returned list of dicts. 
    # Let's handle both.
    
    X_rows = []
    y = []
    
    print("Processing features...")
    for _, match in df.iterrows():
        # Draft Encoding: Hero ID -> One Hot ( +1 for Radiant, -1 for Dire, or separate columns)
        # Using simple OHE: 1 to MAX_HERO_ID. 
        # For recommendation, input is (Draft, Side). 
        # If we predict "Radiant Win", then for Dire recommendation we want to MINIMIZE probability?
        # Or we flip the perspective.
        # Let's stick to predicting "Radiant Win".
        # Features: each hero ID is a feature. Value: 1 (Radiant), -1 (Dire), 0 (None).
        
        row_feats = {}
        
        # Parse teams
        # radiant_team is often a string "1,2,3,4,5" in publicMatches API
        r_team = match['radiant_team']
        d_team = match['dire_team']
        
        if isinstance(r_team, str):
            r_team = [int(x) for x in r_team.split(',')]
        if isinstance(d_team, str):
            d_team = [int(x) for x in d_team.split(',')]
            
        # Feature vector
        for hid in range(1, MAX_HERO_ID + 1):
            if hid in r_team:
                row_feats[f"hero_{hid}"] = 1
            elif hid in d_team:
                row_feats[f"hero_{hid}"] = -1
            else:
                row_feats[f"hero_{hid}"] = 0
                
        X_rows.append(row_feats)
        y.append(1 if match['radiant_win'] else 0)
        
    X_df = pd.DataFrame(X_rows)
    # Ensure all columns exist
    # Some heroes might not be picked in sample, but recommender needs fixed schema
    for hid in range(1, MAX_HERO_ID + 1):
        col = f"hero_{hid}"
        if col not in X_df.columns:
            X_df[col] = 0
            
    # Sort columns to ensure consistent order
    X_df = X_df.reindex(sorted(X_df.columns), axis=1)
    
    return X_df, np.array(y)

def train_model():
    X, y = load_data()
    if X is None:
        return

    print(f"Training on {len(X)} samples with {X.shape[1]} features...")
    
    # 5-Fold CV
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    if USE_XGB:
        clf = xgb.XGBClassifier(
            n_estimators=100, 
            max_depth=6, 
            learning_rate=0.1, 
            eval_metric='logloss',
            use_label_encoder=False
        )
        model_name = "XGBoost"
    else:
        clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
        model_name = "RandomForest"
        
    print(f"Using {model_name}...")
    
    cv_scores = cross_val_score(clf, X, y, cv=skf, scoring='roc_auc')
    print(f"5-Fold ROC-AUC: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    
    # Train final model
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    clf.fit(X_train, y_train)
    
    # Evaluate
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    roc = roc_auc_score(y_test, y_prob)
    
    print(f"Test Accuracy: {acc:.4f}")
    print(f"Test ROC-AUC: {roc:.4f}")
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Save Model
    if not MODEL_DIR.exists():
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        
    joblib.dump(clf, MODEL_FILE)
    print(f"Model saved to {MODEL_FILE}")
    
    # Save Metrics
    metrics = {
        "model": model_name,
        "cv_roc_auc_mean": float(cv_scores.mean()),
        "cv_roc_auc_std": float(cv_scores.std()),
        "test_accuracy": float(acc),
        "test_roc_auc": float(roc),
        "feature_importances": {}
    }
    
    # Feature Importances
    if hasattr(clf, "feature_importances_"):
        imps = clf.feature_importances_
        # Top 20
        indices = np.argsort(imps)[::-1][:20]
        top_feats = {X.columns[i]: float(imps[i]) for i in indices}
        metrics["feature_importances"] = top_feats
        
    with open(METRICS_FILE, "w") as f:
        json.dump(metrics, f, indent=4)
    print(f"Metrics saved to {METRICS_FILE}")
    
    # Optional: Basic plot for feature importance
    if hasattr(clf, "feature_importances_"):
        plt.figure(figsize=(10, 6))
        plt.title("Top 20 Feature Importances")
        plt.bar(range(20), imps[indices], align="center")
        plt.xticks(range(20), [X.columns[i] for i in indices], rotation=90)
        plt.tight_layout()
        plt.savefig(MODEL_DIR / "feature_importance.png")
        print("Feature importance plot saved.")

if __name__ == "__main__":
    train_model()
