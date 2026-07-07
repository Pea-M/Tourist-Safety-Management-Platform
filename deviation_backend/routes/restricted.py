from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database

router = APIRouter(prefix="/restricted", tags=["Restricted Areas"])

@router.post("/add")
def add_restricted_area(data: schemas.RestrictedAreaCreate, db: Session = Depends(database.get_db)):
    area = models.RestrictedArea(
        name=data.name,
        polygon=data.polygon.model_dump_json()  # Correct way to store Pydantic model as JSON
    )
    db.add(area)
    db.commit()
    db.refresh(area)
    return {"message": "Restricted area added successfully", "id": area.id}
