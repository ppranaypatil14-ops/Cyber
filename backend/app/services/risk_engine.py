from app.schemas.activity import Activity

def calculate_risk(activity: Activity, ml_anomaly_score: float):
    cybersecurity_risk_score = 0
    reasons = []

    if 0 <= activity.login_hour <= 5:
        cybersecurity_risk_score += 15
        reasons.append("Login occurred at an unusual time")
    
    if activity.failed_logins > 5:
        cybersecurity_risk_score += 20
        reasons.append("Multiple failed login attempts detected")
        
    if activity.known_device == 0:
        cybersecurity_risk_score += 20
        reasons.append("Unknown device detected")
        
    if activity.download_mb > 5000:
        cybersecurity_risk_score += 20
        reasons.append("Large data download detected")
        
    if activity.sensitive_file_access == 1:
        cybersecurity_risk_score += 15
        reasons.append("Sensitive files accessed")
        
    if activity.antivirus_active == 0:
        cybersecurity_risk_score += 10
        reasons.append("Antivirus protection disabled")
        
    # Cap score at 100 just in case
    cybersecurity_risk_score = min(cybersecurity_risk_score, 100)
    
    # 40% ML anomaly + 60% Cybersecurity risk
    final_risk_score = int(round((0.4 * ml_anomaly_score) + (0.6 * cybersecurity_risk_score)))
    final_risk_score = min(max(final_risk_score, 0), 100)
    
    # Determine severity based on final combined risk
    if final_risk_score <= 29:
        severity = "Low"
    elif final_risk_score <= 59:
        severity = "Medium"
    elif final_risk_score <= 79:
        severity = "High"
    else:
        severity = "Critical"
        
    return {
        "cybersecurity_risk_score": cybersecurity_risk_score,
        "final_risk_score": final_risk_score,
        "severity": severity,
        "reasons": reasons
    }
