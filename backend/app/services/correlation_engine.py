import os, json, uuid
from datetime import datetime, timedelta
from typing import List
from app.schemas.security_event import SecurityEvent
from app.schemas.incident import Incident

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
EVENTS_PATH = os.path.join(DATA_DIR, 'events.json')
INCIDENTS_PATH = os.path.join(DATA_DIR, 'incidents.json')

def _load_json(path: str) -> List[dict]:
    # Load JSON list, return [] if missing or empty
    os.makedirs(os.path.dirname(path), exist_ok=True)
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            return json.loads(content) if content else []
    except FileNotFoundError:
        return []

def _save_json(path: str, data: List[dict]):
    # Save list as pretty JSON
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def _is_suspicious(event: SecurityEvent) -> List[str]:
    evidence = []
    if getattr(event, 'ml_classification', None) == 'Anomaly':
        evidence.append('ML Classification = Anomaly')
    if getattr(event, 'failed_login_attempts', 0) > 5:
        evidence.append('Failed Login Attempts > 5')
    if getattr(event, 'device_status', None) == 0:
        evidence.append('Unknown Device')
    if getattr(event, 'sensitive_file_access', 0) == 1:
        evidence.append('Sensitive File Access')
    if getattr(event, 'download_size', 0) > 5000:
        evidence.append('Large Download (>5GB)')
    if getattr(event, 'antivirus_status', None) == 0:
        evidence.append('Antivirus Disabled')
    return evidence

def _severity_from_count(count: int) -> str:
    if count >= 4:
        return 'Critical'
    if count == 3:
        return 'High'
    if count == 2:
        return 'Medium'
    return 'Low'

def correlate_new_event(event: SecurityEvent) -> None:
    # Correlate event into incidents
    evidence = _is_suspicious(event)
    if not evidence:
        return

    incidents_data = _load_json(INCIDENTS_PATH)
    incidents = [Incident(**inc) for inc in incidents_data]

    matching = None
    for inc in incidents:
        if inc.employee_id != getattr(event, 'employee_id', None):
            continue
        # Use login_time field as timestamp
        delta = datetime.fromisoformat(event.login_time.isoformat()) - datetime.fromisoformat(inc.latest_activity_time.isoformat())
        if abs(delta) <= timedelta(minutes=15):
            matching = inc
            break

    if matching:
        matching.latest_activity_time = event.login_time
        matching.event_count += 1
        matching.evidence = list(set(matching.evidence + evidence))
        matching.severity = _severity_from_count(matching.event_count)
    else:
        new_incident = Incident(
            incident_id=str(uuid.uuid4()),
            employee_id=getattr(event, 'employee_id', None),
            start_time=event.login_time,
            latest_activity_time=event.login_time,
            event_count=1,
            status='Open',
            severity=_severity_from_count(1),
            evidence=evidence,
        )
        incidents.append(new_incident)

    _save_json(INCIDENTS_PATH, [inc.model_dump() for inc in incidents])
