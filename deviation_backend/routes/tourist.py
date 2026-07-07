from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database

router = APIRouter(prefix="/tourist", tags=["Tourist"])

@router.post("/create")
def create_tourist(data: schemas.TouristCreate, db: Session = Depends(database.get_db)):
    tourist = models.Tourist(name=data.name)
    db.add(tourist)
    db.commit()
    db.refresh(tourist)
    return {"id": tourist.id, "name": tourist.name}
