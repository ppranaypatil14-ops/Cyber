from app.schemas.activity import Activity

def calculate_risk(activity: Activity):
    score = 0
    reasons = []

    if 0 <= activity.login_hour <= 5:
        score += 15
        reasons.append("Login occurred at an unusual time")
    
    if activity.failed_logins > 5:
        score += 20
        reasons.append("Multiple failed login attempts detected")
        
    if activity.known_device == 0:
        score += 20
        reasons.append("Unknown device detected")
        
    if activity.download_mb > 5000:
        score += 20
        reasons.append("Large data download detected")
        
    if activity.sensitive_file_access == 1:
        score += 15
        reasons.append("Sensitive files accessed")
        
    if activity.antivirus_active == 0:
        score += 10
        reasons.append("Antivirus protection disabled")
        
    # Cap score at 100 just in case
    score = min(score, 100)
    
    # Determine severity
    if score <= 29:
        severity = "Low"
    elif score <= 59:
        severity = "Medium"
    elif score <= 79:
        severity = "High"
    else:
        severity = "Critical"
        
    return {
        "risk_score": score,
        "severity": severity,
        "reasons": reasons
    }
