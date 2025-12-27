from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import get_db
from services.drug_interaction import check_drug_interactions
from services.notifications import send_medication_reminder

router = APIRouter()

@router.post("/", response_model=schemas.MedicationResponse, status_code=status.HTTP_201_CREATED)
def create_medication(medication: schemas.MedicationCreate, db: Session = Depends(get_db)):
    """Create a new medication with schedule"""
    db_medication = models.Medication(**medication.dict())
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)
    
    # Send notification (console log)
    send_medication_reminder(db_medication.name, db_medication.schedule_time)
    
    return db_medication

@router.get("/", response_model=List[schemas.MedicationResponse])
def list_medications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all medications"""
    medications = db.query(models.Medication).filter(models.Medication.is_active.is_(True)).offset(skip).limit(limit).all()
    return medications

@router.get("/{medication_id}", response_model=schemas.MedicationResponse)
def get_medication(medication_id: int, db: Session = Depends(get_db)):
    """Get a specific medication by ID"""
    medication = db.query(models.Medication).filter(models.Medication.id == medication_id).first()
    if medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")
    return medication

@router.put("/{medication_id}", response_model=schemas.MedicationResponse)
def update_medication(medication_id: int, medication_update: schemas.MedicationUpdate, db: Session = Depends(get_db)):
    """Update a medication"""
    db_medication = db.query(models.Medication).filter(models.Medication.id == medication_id).first()
    if db_medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    update_data = medication_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_medication, key, value)
    
    db.commit()
    db.refresh(db_medication)
    return db_medication

@router.delete("/{medication_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medication(medication_id: int, db: Session = Depends(get_db)):
    """Delete (deactivate) a medication"""
    db_medication = db.query(models.Medication).filter(models.Medication.id == medication_id).first()
    if db_medication is None:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    # Soft delete by marking as inactive
    db_medication.is_active = False
    db.commit()
    return None

@router.post("/check-interactions", response_model=schemas.DrugInteractionResponse)
async def check_interactions(interaction_check: schemas.DrugInteractionCheck, db: Session = Depends(get_db)):
    """Check for drug-drug interactions"""
    try:
        result = await check_drug_interactions(interaction_check.medications)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking interactions: {str(e)}")
