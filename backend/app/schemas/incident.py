from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

class Incident(BaseModel):
    incident_id: str = Field(...)
    employee_id: Optional[str] = None
    start_time: datetime = Field(...)
    latest_activity_time: datetime = Field(...)
    event_count: int = Field(...)
    status: str = Field(default='Open')
    severity: str = Field(...)
    evidence: List[str] = Field(default_factory=list)
    # New investigation summary fields (optional)
    attack_name: Optional[str] = None
    attack_description: Optional[str] = None
    attack_stage: Optional[str] = None
    recommended_actions: Optional[List[str]] = None
    risk_level: Optional[str] = None
