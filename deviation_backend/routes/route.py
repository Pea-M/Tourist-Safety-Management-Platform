import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..orsm_client import get_route
from .. import database, models

router = APIRouter(prefix="/route", tags=["Route"])

@router.get("/create")
def create_route(
    tourist_id: int, 
    start_lat: float, start_lon: float, 
    end_lat: float, end_lon: float, 
    db: Session = Depends(database.get_db)
):
    route_data = get_route((start_lat, start_lon), (end_lat, end_lon))
    if "routes" in route_data:
        geometry = route_data["routes"][0]["geometry"]
        
        # Store as valid JSON string
        db_route = models.Route(
            tourist_id=tourist_id,
            geometry=json.dumps(geometry)  # ✅ Correct
        )
        db.add(db_route)
        db.commit()
        db.refresh(db_route)

        return {"route": geometry}
    
    return {"error": "No route found"}
