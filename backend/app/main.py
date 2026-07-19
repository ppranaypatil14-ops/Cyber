import os
from dotenv import load_dotenv
import json
from datetime import datetime
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import joblib
import pandas as pd
from google import genai

# Load .env explicitly from the same directory as main.py
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

from fastapi.middleware.cors import CORSMiddleware

from app.schemas.activity import Activity
from app.schemas.security_event import SecurityEvent
from app.schemas.incident import Incident
from app.services.risk_engine import calculate_risk
from app.services.correlation_engine import correlate_new_event
from app.services.investigation_summary import determine_attack_name, determine_attack_stage, gather_evidence, recommend_actions, risk_level_from_severity

app = FastAPI(title="CyberShield AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model path
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
    # Load model
    if not os.path.isfile(MODEL_PATH):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model file missing",
        )
    try:
        model = joblib.load(MODEL_PATH)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Model loading failed",
        )
    # Prepare features
    features = [
        "login_hour",
        "failed_logins",
        "known_device",
        "download_mb",
        "sensitive_file_access",
        "antivirus_active",
    ]
    input_data = pd.DataFrame([activity.model_dump()])[features]
    # Predict
    try:
        prediction_val = model.predict(input_data)[0]
        raw_score = model.decision_function(input_data)[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failure: {str(e)}",
        )
    is_anomaly = bool(prediction_val == -1)
    classification = "Anomaly" if is_anomaly else "Normal"
    # Map raw_score to 0-100
    ml_anomaly_score = int(max(0, min(100, 50 - (raw_score * 200))))
    if ml_anomaly_score <= 29:
        behaviour_difference = "Low"
    elif ml_anomaly_score <= 59:
        behaviour_difference = "Moderate"
    elif ml_anomaly_score <= 79:
        behaviour_difference = "High"
    else:
        behaviour_difference = "Very High"
    # Calculate risk
    risk_data = calculate_risk(activity, ml_anomaly_score)
    # Store security event
    event = SecurityEvent(
        employee_id=getattr(activity, "employee_id", None),
        login_time=datetime.utcnow(),
        device_status=activity.known_device,
        ip_address=getattr(activity, "ip_address", None),
        login_location=getattr(activity, "login_location", None),
        failed_login_attempts=activity.failed_logins,
        download_size=activity.download_mb,
        sensitive_file_access=activity.sensitive_file_access,
        antivirus_status=activity.antivirus_active,
        ml_classification=classification,
        risk_score=risk_data["final_risk_score"],
        severity=risk_data["severity"],
    )
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(data_dir, exist_ok=True)
    events_path = os.path.join(data_dir, "events.json")
    try:
        with open(events_path, "r", encoding="utf-8") as f:
            events = json.load(f)
    except FileNotFoundError:
        events = []
    events.append(event.model_dump())
    with open(events_path, "w", encoding="utf-8") as f:
        json.dump(events, f, indent=2)
    # Correlation engine triggers incident creation/update
    correlate_new_event(event)
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
        "reasons": risk_data["reasons"],
    }

@app.get("/incidents")
def get_incidents():
    """Return incidents sorted newest first, each enriched with a chronological timeline of related events."""
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    incidents_path = os.path.join(data_dir, "incidents.json")
    if not os.path.isfile(incidents_path):
        return []
    try:
        with open(incidents_path, "r", encoding="utf-8") as f:
            content = f.read().strip()
            incidents = json.loads(content) if content else []
    except Exception:
        return []
    # Load all events for timeline construction
    events_path = os.path.join(data_dir, "events.json")
    try:
        with open(events_path, "r", encoding="utf-8") as f_events:
            events_content = f_events.read().strip()
            all_events = json.loads(events_content) if events_content else []
    except Exception:
        all_events = []
    def get_event_type(ev):
        if ev.get("failed_login_attempts", 0) > 5:
            return "Multiple Failed Login Attempts"
        if ev.get("device_status", 1) == 0:
            return "Unknown Device Login"
        if ev.get("sensitive_file_access", 0) == 1:
            return "Sensitive File Access"
        if ev.get("download_size", 0) > 5000:
            return "Large Download"
        return "Normal Activity"
    for inc in incidents:
        employee_id = inc.get("employee_id")
        start_time = inc.get("start_time")
        end_time = inc.get("latest_activity_time")
        timeline = []
        for ev in all_events:
            if ev.get("employee_id") != employee_id:
                continue
            ev_time = ev.get("login_time")
            if not ev_time:
                continue
            if start_time and ev_time < start_time:
                continue
            if end_time and ev_time > end_time:
                continue
            timeline.append({
                "time": ev_time,
                "event_type": get_event_type(ev),
                "risk_score": ev.get("risk_score"),
                "ml_classification": ev.get("ml_classification"),
                "description": f"{get_event_type(ev)} detected.",
            })
        timeline.sort(key=lambda x: x["time"])  # oldest first
        inc["timeline"] = timeline
        # Investigation summary
        attack_name = determine_attack_name(timeline)
        inc["attack_name"] = attack_name
        inc["attack_description"] = f"Generated attack based on observed events: {attack_name}"
        inc["attack_stage"] = determine_attack_stage(timeline)
        inc["evidence"] = gather_evidence(timeline)
        inc["recommended_actions"] = recommend_actions(attack_name)
        inc["risk_level"] = risk_level_from_severity(inc.get("severity", ""))
    incidents.sort(key=lambda x: x.get("latest_activity_time", ""), reverse=True)
    return incidents

# --- COPILOT AI ENDPOINT ---

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@app.post("/api/copilot/chat")
def copilot_chat(request: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GEMINI_API_KEY is not set in the environment variables."
        )

    # Gather context from local JSON files
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    try:
        with open(os.path.join(data_dir, "incidents.json"), "r") as f:
            incidents_data = f.read()
    except Exception:
        incidents_data = "No incidents recorded."
        
    try:
        with open(os.path.join(data_dir, "events.json"), "r") as f:
            events_data = f.read()
    except Exception:
        events_data = "No events recorded."

    system_prompt = f"""You are CyberShield AI, a highly advanced cybersecurity Copilot and Security Operations Center (SOC) assistant.
    
    You have direct access to the live monitoring data of this network. 
    Here are the recent active incidents:
    {incidents_data[:2000]} # Truncating to avoid overwhelming context
    
    Here are the recent raw security events:
    {events_data[:2000]}
    
    Instructions:
    - Answer the user's questions confidently and professionally as a senior security analyst.
    - IMPORTANT FORMATTING RULE: NEVER output a giant wall of text. Always break your answers into short bullet points.
    - Use clear headings and lists. 
    - Keep sentences short, concise, and highly readable.
    - Emphasize critical keywords using **bold** text.
    - Keep your overall response under 150 words unless specifically asked for a detailed report.
    """

    client = genai.Client(api_key=api_key)
    
    # Convert chat history to Gemini format, skipping the very last user message to pass it separately
    contents = []
    for m in request.messages[:-1]:
        # role in gemini is typically 'user' or 'model'
        gemini_role = 'model' if m.role == 'assistant' else 'user'
        contents.append({"role": gemini_role, "parts": [{"text": m.content}]})

    last_user_message = request.messages[-1].content

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents + [{"role": "user", "parts": [{"text": last_user_message}]}],
            config={
                "system_instruction": system_prompt,
                "temperature": 0.2
            }
        )
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gemini API Error: {str(e)}"
        )
