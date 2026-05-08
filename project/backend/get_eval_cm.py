import os
import pandas as pd
from sklearn.model_selection import train_test_split
import xgboost as xgb
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, accuracy_score
import sys

# Ensure backend acts as root module for imports if needed
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.ml_models.evaluate_models import calculate_stats, build_features

matches_path = "dataset/match.csv"
players_path = "dataset/players.csv"

matches = pd.read_csv(matches_path)[['match_id', 'radiant_win']].dropna()
players = pd.read_csv(players_path)[['match_id', 'account_id', 'hero_id', 'player_slot', 'gold_per_min']]

if len(matches) > 20000:
    matches = matches.sample(20000, random_state=42)

all_match_ids = matches['match_id'].unique()
train_ids, test_ids = train_test_split(all_match_ids, test_size=0.2, random_state=42)

train_matches_df = matches[matches['match_id'].isin(train_ids)]
train_players_df = players[players['match_id'].isin(train_ids)]
hero_stats = calculate_stats(train_matches_df, train_players_df)

X_train, y_train = build_features(train_ids, matches, players, hero_stats)
X_test, y_test = build_features(test_ids, matches, players, hero_stats)

model = xgb.XGBClassifier(n_estimators=500, max_depth=5, learning_rate=0.05, eval_metric='logloss')
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("--- FULL EVALUATION REPORT ---")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("ROC AUC:", roc_auc_score(y_test, y_prob))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))
