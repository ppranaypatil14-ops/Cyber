import os
from fastapi import FastAPI, HTTPException, status
import joblib
import pandas as pd

from app.schemas.activity import Activity
from app.services.risk_engine import calculate_risk
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CyberShield AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Model path ──────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "anomaly_model.joblib")


@app.get("/")
def read_root():
    return {"message": "CyberShield AI backend is running"}


@app.get("/health")
def read_health():
    if not os.path.isfile(MODEL_PATH):
        return {"status": "healthy", "ml_model": "not_trained"}

    try:
        joblib.load(MODEL_PATH)
        return {"status": "healthy", "ml_model": "loaded"}
    except Exception:
        return {"status": "degraded", "ml_model": "load_failed"}


@app.post("/api/analyze")
def analyze_activity(activity: Activity):
    # 1. Load the saved model
    if not os.path.isfile(MODEL_PATH):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model file missing"
        )
        
    try:
        model = joblib.load(MODEL_PATH)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Model loading failed"
        )

    # 2. Convert the request into the format expected by the model
    features = [
        "login_hour",
        "failed_logins",
        "known_device",
        "download_mb",
        "sensitive_file_access",
        "antivirus_active"
    ]
    
    input_data = pd.DataFrame([activity.model_dump()])[features]

    # 3. Run prediction using the real Isolation Forest model
    try:
        prediction_val = model.predict(input_data)[0]
        raw_score = model.decision_function(input_data)[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failure: {str(e)}"
        )
        
    is_anomaly = bool(prediction_val == -1)
    classification = "Anomaly" if is_anomaly else "Normal"
    
    # Map raw_score (typically -0.3 to 0.3) to 0-100 (100 = highly anomalous)
    # raw_score < 0 is anomaly. raw_score > 0 is normal.
    ml_anomaly_score = int(max(0, min(100, 50 - (raw_score * 200))))
    
    if ml_anomaly_score <= 29:
        behaviour_difference = "Low"
    elif ml_anomaly_score <= 59:
        behaviour_difference = "Moderate"
    elif ml_anomaly_score <= 79:
        behaviour_difference = "High"
    else:
        behaviour_difference = "Very High"

    # 4. Calculate Risk
    risk_data = calculate_risk(activity, ml_anomaly_score)

    # 5. Return the combined response
    return {
        "is_anomaly": is_anomaly,
        "classification": classification,
        "ml_anomaly_score": ml_anomaly_score,
        "cybersecurity_risk_score": risk_data["cybersecurity_risk_score"],
        "final_risk_score": risk_data["final_risk_score"],
        "severity": risk_data["severity"],
        "model": "Isolation Forest",
        "training_records": 3000,
        "behaviour_difference": behaviour_difference,
        "reasons": risk_data["reasons"]
    }
