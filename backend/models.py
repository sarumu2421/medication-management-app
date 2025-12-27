from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    dosage = Column(String, nullable=True)
    frequency = Column(String, nullable=False)  # e.g., "daily", "twice_daily", "weekly"
    schedule_time = Column(String, nullable=False)  # e.g., "09:00", "09:00,21:00"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Medication(name={self.name}, frequency={self.frequency})>"
