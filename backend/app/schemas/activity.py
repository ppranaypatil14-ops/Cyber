from pydantic import BaseModel, Field

class Activity(BaseModel):
    login_hour: int = Field(..., ge=0, le=23, description="Hour of login (0-23)")
    failed_logins: int = Field(..., ge=0, description="Number of failed logins before success")
    known_device: int = Field(..., ge=0, le=1, description="1 if known device, 0 otherwise")
    download_mb: float = Field(..., ge=0, description="Megabytes downloaded")
    sensitive_file_access: int = Field(..., ge=0, le=1, description="1 if accessed sensitive files, 0 otherwise")
    antivirus_active: int = Field(..., ge=0, le=1, description="1 if active, 0 otherwise")
