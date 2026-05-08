import joblib, pathlib
import xgboost as xgb
import pandas as pd
import numpy as np

MODEL_PATH = pathlib.Path(__file__).parent / "data" / "recommendation_model.joblib"

# Columns that are always expected (Meta features)
# OHE columns are dynamic but we trust training consistency
META_COLS = ["radiant_avg_wr", "dire_avg_wr", "wr_diff"]

def train_baseline(dfX, y):
    # XGBoost handles sparse/NaNs relatively well, but we should ensure consistency
    model = xgb.XGBClassifier(
        n_estimators=500,
        max_depth=6,
        learning_rate=0.05,
        eval_metric='logloss',
        use_label_encoder=False
    )
    model.fit(dfX, y)
    
    # Save model
    # Ensure directory exists
    if not MODEL_PATH.parent.exists():
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        
    joblib.dump(model, MODEL_PATH)
    return model

def load_model():
    if MODEL_PATH.exists():
        return joblib.load(MODEL_PATH)
    return None

def predict_proba(model, X: dict):
    # Convert single info dict to DataFrame
    # Need to ensure all columns from training exist
    
    # Simple conversion: dict -> DF
    df = pd.DataFrame([X])
    
    # Get model booster to align columns? 
    # XGBoost sklearn API is forgiving if columns are missing (sometimes), 
    # but best to reindex against model.feature_names_in_
    
    if hasattr(model, "feature_names_in_"):
        expected_cols = model.feature_names_in_
        # Reindex adds missing cols as NaN, which is fine (0) for OHE? 
        # Actually for OHE 0 is better than NaN.
        df = df.reindex(columns=expected_cols, fill_value=0)
        
    p = model.predict_proba(df)[0][1]
    return float(p)



