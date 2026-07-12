"""
CyberShield AI — Isolation Forest Model Training Script
=========================================================
Trains a StandardScaler + IsolationForest pipeline on the
normal employee activity dataset and saves it via Joblib.
"""

import os
import sys
import numpy as np
import pandas as pd
import joblib
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest

# ── Paths ───────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "app", "data", "normal_activity.csv")
MODEL_DIR = os.path.join(BASE_DIR, "app", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "anomaly_model.joblib")

FEATURES = [
    "login_hour",
    "failed_logins",
    "known_device",
    "download_mb",
    "sensitive_file_access",
    "antivirus_active",
]

# ═══════════════════════════════════════════════════════════════════
#  PRE-TRAINING VALIDATION
# ═══════════════════════════════════════════════════════════════════

print("=" * 65)
print("  CyberShield AI - Model Training")
print("=" * 65)

# 1. File exists
if not os.path.isfile(CSV_PATH):
    print(f"\n[FAIL] Dataset not found at: {CSV_PATH}")
    sys.exit(1)
print(f"\n[OK] Dataset found: {CSV_PATH}")

# 2. Load and check columns
df = pd.read_csv(CSV_PATH)
print(f"[OK] Loaded {len(df)} rows, {len(df.columns)} columns")

missing_cols = [c for c in FEATURES if c not in df.columns]
if missing_cols:
    print(f"[FAIL] Missing columns: {missing_cols}")
    sys.exit(1)
extra_cols = [c for c in df.columns if c not in FEATURES]
if extra_cols:
    print(f"[INFO] Extra columns ignored: {extra_cols}")
print("[OK] All 6 required columns present")

# 3. Missing values
nulls = df[FEATURES].isnull().sum()
total_nulls = nulls.sum()
if total_nulls > 0:
    print(f"[FAIL] Found {total_nulls} missing values:")
    print(nulls[nulls > 0])
    sys.exit(1)
print("[OK] No missing values")

# 4. Convert to numeric and check for invalid values
for col in FEATURES:
    df[col] = pd.to_numeric(df[col], errors="coerce")
coerced_nulls = df[FEATURES].isnull().sum().sum()
if coerced_nulls > 0:
    print(f"[FAIL] {coerced_nulls} values could not be converted to numeric")
    sys.exit(1)
print("[OK] All values are valid numeric")

# 5. Quick range sanity
print("\n-- Feature Ranges --")
for col in FEATURES:
    print(f"   {col:25s}  min={df[col].min():<10}  max={df[col].max()}")

# ═══════════════════════════════════════════════════════════════════
#  TRAINING
# ═══════════════════════════════════════════════════════════════════

print("\n-- Building Pipeline --")
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("isolation_forest", IsolationForest(
        n_estimators=200,
        contamination=0.03,
        random_state=42,
    )),
])

X = df[FEATURES]
print(f"   Training on {X.shape[0]} samples, {X.shape[1]} features ...")
pipeline.fit(X)
print("[OK] Pipeline trained successfully")

# ── Training-set stats ──────────────────────────────────────────────
train_preds = pipeline.predict(X)
n_normal = (train_preds == 1).sum()
n_anomaly = (train_preds == -1).sum()
print(f"\n-- Training Set Predictions --")
print(f"   Normal  (1) : {n_normal}  ({n_normal / len(X) * 100:.1f}%)")
print(f"   Anomaly (-1): {n_anomaly}  ({n_anomaly / len(X) * 100:.1f}%)")

# ═══════════════════════════════════════════════════════════════════
#  SAVE MODEL
# ═══════════════════════════════════════════════════════════════════

os.makedirs(MODEL_DIR, exist_ok=True)
joblib.dump(pipeline, MODEL_PATH)
file_size_kb = os.path.getsize(MODEL_PATH) / 1024
print(f"\n[OK] Model saved to: {MODEL_PATH}")
print(f"     File size: {file_size_kb:.1f} KB")

# ═══════════════════════════════════════════════════════════════════
#  RELOAD & VERIFY
# ═══════════════════════════════════════════════════════════════════

print("\n-- Reloading saved model --")
loaded_pipeline = joblib.load(MODEL_PATH)
print("[OK] Model loaded successfully from .joblib file")

# Verify it's a real pipeline with the right steps
assert isinstance(loaded_pipeline, Pipeline), "Loaded object is not a Pipeline"
step_names = [name for name, _ in loaded_pipeline.steps]
assert "scaler" in step_names, "Missing scaler step"
assert "isolation_forest" in step_names, "Missing isolation_forest step"
print("[OK] Pipeline structure verified (scaler -> isolation_forest)")

# ═══════════════════════════════════════════════════════════════════
#  TEST PREDICTIONS  (using the LOADED model, not the training one)
# ═══════════════════════════════════════════════════════════════════

test_cases = [
    {
        "name": "TEST 1 - Normal Activity",
        "data": {
            "login_hour": 10,
            "failed_logins": 0,
            "known_device": 1,
            "download_mb": 200,
            "sensitive_file_access": 0,
            "antivirus_active": 1,
        },
        "expected_hint": "Likely Normal",
    },
    {
        "name": "TEST 2 - Highly Suspicious Activity",
        "data": {
            "login_hour": 2,
            "failed_logins": 15,
            "known_device": 0,
            "download_mb": 15000,
            "sensitive_file_access": 1,
            "antivirus_active": 0,
        },
        "expected_hint": "Likely Anomaly",
    },
    {
        "name": "TEST 3 - Slightly Unusual Activity",
        "data": {
            "login_hour": 2,
            "failed_logins": 0,
            "known_device": 1,
            "download_mb": 200,
            "sensitive_file_access": 0,
            "antivirus_active": 1,
        },
        "expected_hint": "Actual model prediction (not forced)",
    },
]

print("\n" + "=" * 65)
print("  MODEL TEST RESULTS (using loaded model)")
print("=" * 65)

test_results = []

for tc in test_cases:
    sample = pd.DataFrame([tc["data"]])[FEATURES]
    raw_pred = loaded_pipeline.predict(sample)[0]
    raw_score = loaded_pipeline.decision_function(sample)[0]
    label = "Normal" if raw_pred == 1 else "Anomaly"

    test_results.append(label)

    print(f"\n  {tc['name']}")
    print(f"  {'─' * 50}")
    for k, v in tc["data"].items():
        print(f"    {k:25s}: {v}")
    print(f"    {'─' * 40}")
    print(f"    Raw prediction (1/-1)  : {raw_pred}")
    print(f"    Classification         : {label}")
    print(f"    Decision score         : {raw_score:.6f}")
    print(f"    Expected               : {tc['expected_hint']}")

# ── Confirm not hard-coded ──────────────────────────────────────────
print("\n-- Hard-code Check --")
# Predict two very different inputs and confirm different scores
a = pd.DataFrame([{
    "login_hour": 10, "failed_logins": 0, "known_device": 1,
    "download_mb": 200, "sensitive_file_access": 0, "antivirus_active": 1,
}])[FEATURES]
b = pd.DataFrame([{
    "login_hour": 3, "failed_logins": 20, "known_device": 0,
    "download_mb": 50000, "sensitive_file_access": 1, "antivirus_active": 0,
}])[FEATURES]
score_a = loaded_pipeline.decision_function(a)[0]
score_b = loaded_pipeline.decision_function(b)[0]
assert score_a != score_b, "Scores are identical — model may be hard-coded!"
print(f"[OK] Different inputs produce different scores ({score_a:.4f} vs {score_b:.4f})")
print("[OK] Predictions are NOT hard-coded")

# ═══════════════════════════════════════════════════════════════════
#  FINAL REPORT
# ═══════════════════════════════════════════════════════════════════

print("\n" + "=" * 65)
print("  TRAINING COMPLETE - FINAL REPORT")
print("=" * 65)
print(f"  Dataset rows used       : {len(df)}")
print(f"  Model                   : IsolationForest")
print(f"  Number of trees         : 200")
print(f"  Contamination           : 0.03")
print(f"  Model file path         : {os.path.abspath(MODEL_PATH)}")
print(f"  Normal test result      : {test_results[0]}")
print(f"  Suspicious test result  : {test_results[1]}")
print(f"  Slightly unusual result : {test_results[2]}")
print(f"  All checks passed       : Yes")
print("=" * 65)
