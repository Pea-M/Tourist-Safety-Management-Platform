from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database

router = APIRouter(prefix="/location", tags=["Location"])

@router.post("/update")
def update_location(data: schemas.TouristLocationUpdate, db: Session = Depends(database.get_db)):
    # Extract lon, lat from GeoJSONPoint
    lon, lat = data.location.coordinates

    loc = models.TouristLocation(
        tourist_id=data.tourist_id,
        lat=lat,
        lon=lon
    )
    db.add(loc)
    db.commit()
    db.refresh(loc)

    return {
        "message": "Location updated successfully",
        "data": {
            "tourist_id": loc.tourist_id,
            "lat": loc.lat,
            "lon": loc.lon
        }
    }
