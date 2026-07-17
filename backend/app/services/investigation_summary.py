from typing import List, Dict

def determine_attack_name(events: List[Dict]) -> str:
    """Return attack name based on event patterns.
    - Failed Login + Unknown Device => Possible Account Compromise
    - Sensitive Files + Large Download => Possible Data Exfiltration
    - Both patterns => Account Compromise leading to Possible Data Exfiltration
    """
    has_failed_login = any(e["event_type"] == "Multiple Failed Login Attempts" for e in events)
    has_unknown_device = any(e["event_type"] == "Unknown Device Login" for e in events)
    has_sensitive = any(e["event_type"] == "Sensitive File Access" for e in events)
    has_large_download = any(e["event_type"] == "Large Download" for e in events)

    compromise = has_failed_login and has_unknown_device
    exfiltration = has_sensitive and has_large_download
    if compromise and exfiltration:
        return "Account Compromise leading to Possible Data Exfiltration"
    if compromise:
        return "Possible Account Compromise"
    if exfiltration:
        return "Possible Data Exfiltration"
    return "Unknown Attack"

def determine_attack_stage(events: List[Dict]) -> str:
    """Pick the most advanced stage based on present events.
    Order: Reconnaissance < Initial Access < Credential Compromise < Sensitive Data Access < Data Exfiltration < Completed Attack
    """
    stage_order = [
        "Reconnaissance",
        "Initial Access",
        "Credential Compromise",
        "Sensitive Data Access",
        "Data Exfiltration",
        "Completed Attack",
    ]
    # Simple heuristic: map event types to stages
    event_to_stage = {
        "Multiple Failed Login Attempts": "Credential Compromise",
        "Unknown Device Login": "Credential Compromise",
        "Sensitive File Access": "Sensitive Data Access",
        "Large Download": "Data Exfiltration",
        "Normal Activity": "Initial Access",
    }
    max_index = 0
    for e in events:
        stage = event_to_stage.get(e["event_type"], None)
        if stage and stage in stage_order:
            idx = stage_order.index(stage)
            if idx > max_index:
                max_index = idx
    return stage_order[max_index]

def gather_evidence(events: List[Dict]) -> List[str]:
    evidence_map = {
        "Multiple Failed Login Attempts": "✓ Multiple Failed Login Attempts",
        "Unknown Device Login": "✓ Unknown Device Login",
        "Sensitive File Access": "✓ Sensitive File Access",
        "Large Download": "✓ Large Download",
    }
    evidence = []
    for e in events:
        ev_type = e["event_type"]
        if ev_type in evidence_map and evidence_map[ev_type] not in evidence:
            evidence.append(evidence_map[ev_type])
    return evidence

def recommend_actions(attack_name: str) -> List[str]:
    base_actions = [
        "Lock User Account",
        "Terminate Active Session",
        "Reset Password",
        "Notify Security Team",
        "Block Unknown Device",
        "Review Download Activity",
    ]
    if "Account Compromise" in attack_name:
        return ["Lock User Account", "Terminate Active Session", "Notify Security Team"]
    if "Data Exfiltration" in attack_name:
        return ["Block Unknown Device", "Review Download Activity", "Notify Security Team"]
    return base_actions

def risk_level_from_severity(severity: str) -> str:
    # Assuming severity already matches desired levels
    mapping = {
        "low": "Low",
        "medium": "Medium",
        "high": "High",
        "critical": "Critical",
    }
    return mapping.get(severity.lower(), "Low")
