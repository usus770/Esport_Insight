import sys
import joblib
import pandas as pd
import json
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, accuracy_score
from app.recommendation_train import load_data
from sklearn.model_selection import train_test_split

print("Loading data and model...")
X, y = load_data()
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = joblib.load('app/data/recommendation_model.joblib')
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("--- FULL EVALUATION REPORT ---")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("ROC AUC:", roc_auc_score(y_test, y_prob))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))
