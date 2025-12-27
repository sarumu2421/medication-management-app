from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import httpx  
from database import Medication, get_db, create_tables

app = FastAPI(title="Medication Management")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    create_tables()

class MedicationCreate(BaseModel):
    name: str
    time: str
    dosage: Optional[str] = None
    notes: Optional[str] = None

class MedicationResponse(BaseModel):
    id: int
    name: str
    time: str
    dosage: Optional[str]
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class InteractionWarning(BaseModel):
    drug_pair: List[str]
    severity: str
    description: str
    source: str 

#home page 
@app.get("/")
def home():
    return {
        "message": "Medication Reminder API with FDA Integration",
        "docs": "Visit /docs to see all endpoints",
        "fda_powered": True
    }

#gets all medications
@app.get("/medications", response_model=List[MedicationResponse])
def get_all_medications(db: Session = Depends(get_db)):
    meds = db.query(Medication).all()
    return meds

#add a new med
@app.post("/medications", response_model=MedicationResponse)
def add_medication(med: MedicationCreate, db: Session = Depends(get_db)):
    new_med = Medication(
        name=med.name,
        time=med.time,
        dosage=med.dosage,
        notes=med.notes
    )
    db.add(new_med)
    db.commit()
    db.refresh(new_med)
    
    return new_med

#delete a med
@app.delete("/medications/{med_id}")
def delete_medication(med_id: int, db: Session = Depends(get_db)):
    med = db.query(Medication).filter(Medication.id == med_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    db.delete(med)
    db.commit()
    
    return {"message": "Medication deleted successfully"}

#update med
@app.put("/medications/{med_id}", response_model=MedicationResponse)
def update_medication(med_id: int, med: MedicationCreate, db: Session = Depends(get_db)):
    db_med = db.query(Medication).filter(Medication.id == med_id).first()
    if not db_med:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    db_med.name = med.name
    db_med.time = med.time
    db_med.dosage = med.dosage
    db_med.notes = med.notes
    
    db.commit()
    db.refresh(db_med)
    
    return db_med


# check for drug interactions using FDA data
@app.get("/interactions", response_model=List[InteractionWarning])
async def check_interactions(db: Session = Depends(get_db)):

    meds = db.query(Medication).all()
    
    # needs at least 2 medications to have an interaction
    if len(meds) < 2:
        return []


#queries FDA database for a specific drug
@app.get("/fda/drug/{drug_name}")
async def get_fda_drug_info(drug_name: str):
    """
    Get information about a drug from the FDA database.
    This shows adverse events reported for this drug.
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            url = "https://api.fda.gov/drug/event.json" # FDA API endpoint for drug adverse events
            
            response = await client.get(
                url,
                params={
                    "search": f'patient.drug.medicinalproduct:"{drug_name}"',
                    "limit": 5  # gets the top 5 reports
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if "results" in data:
                    simplified = []
                    for result in data["results"][:5]:
                        # takes only the useful info
                        reactions = []
                        if "patient" in result and "reaction" in result["patient"]:
                            reactions = [r.get("reactionmeddrapt", "Unknown") 
                                       for r in result["patient"]["reaction"][:3]]
                        
                        simplified.append({
                            "drug": drug_name,
                            "reactions": reactions,
                            "serious": result.get("serious", "Unknown")
                        })
                    
                    return {
                        "drug": drug_name,
                        "total_reports": data.get("meta", {}).get("results", {}).get("total", 0),
                        "sample_events": simplified,
                        "source": "OpenFDA"
                    }
                else:
                    return {
                        "drug": drug_name,
                        "message": "No adverse events found in FDA database",
                        "note": "This might mean the drug is very safe, or the name doesn't match FDA records"
                    }
            else:
                raise HTTPException(status_code=response.status_code, detail="FDA API error")
                
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="FDA API timeout - try again")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying FDA: {str(e)}")


# search FDA for drug interactions between two specific drugs
@app.get("/fda/interaction/{drug1}/{drug2}")
async def check_fda_interaction(drug1: str, drug2: str):
    """
    Check FDA database for reported interactions between two drugs.
    This searches for cases where both drugs were taken together.
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            url = "https://api.fda.gov/drug/event.json"
            
            search_query = f'patient.drug.medicinalproduct:"{drug1}"+AND+patient.drug.medicinalproduct:"{drug2}"'
            
            response = await client.get(
                url,
                params={
                    "search": search_query,
                    "limit": 10
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                
                total_reports = data.get("meta", {}).get("results", {}).get("total", 0)
                
                if total_reports > 0:
                    return {
                        "drug_pair": [drug1, drug2],
                        "interaction_reports": total_reports,
                        "severity": "moderate" if total_reports > 10 else "low",
                        "description": f"FDA has {total_reports} reports where both drugs were involved",
                        "source": "OpenFDA",
                        "warning": "Consult your doctor about taking these together"
                    }
                else:
                    return {
                        "drug_pair": [drug1, drug2],
                        "interaction_reports": 0,
                        "message": "No interaction reports found in FDA database",
                        "note": "This doesn't guarantee safety - always consult your doctor"
                    }
            else:
                raise HTTPException(status_code=response.status_code, detail="FDA API error")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)