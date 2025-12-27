from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class MedicationBase(BaseModel):
    name: str = Field(..., min_length=1, description="Medication name")
    dosage: Optional[str] = Field(None, description="Dosage information")
    frequency: str = Field(..., description="Frequency (daily, twice_daily, weekly, etc.)")
    schedule_time: str = Field(..., description="Time(s) for medication (HH:MM format, comma-separated for multiple)")

class MedicationCreate(MedicationBase):
    pass

class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    schedule_time: Optional[str] = None
    is_active: Optional[bool] = None

class MedicationResponse(MedicationBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class DrugInteractionCheck(BaseModel):
    medications: list[str] = Field(..., description="List of medication names to check for interactions")

class DrugInteractionResponse(BaseModel):
    has_interactions: bool
    interactions: list[dict]
    message: str
