from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import uuid

class SecurityEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: f"EVT-{uuid.uuid4().hex[:8]}")
    employee_id: Optional[str] = None
    login_time: datetime = Field(default_factory=datetime.utcnow)
    device_status: int = Field(..., description="0=Unknown, 1=Known")
    ip_address: Optional[str] = None
    login_location: Optional[str] = None
    failed_login_attempts: int = 0
    download_size: float = 0.0  # MB
    sensitive_file_access: int = 0  # 0/1 flag
    antivirus_status: int = 1  # 0=Disabled,1=Enabled
    ml_classification: str = "Normal"
    risk_score: int = 0
    severity: str = "Low"
