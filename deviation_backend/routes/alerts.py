from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from shapely.geometry import Point, shape, LineString
import json
from .. import models, database

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("/check")
def check_alert(tourist_id: int, db: Session = Depends(database.get_db)):
    # 1. Get latest location
    location = (
        db.query(models.TouristLocation)
        .filter(models.TouristLocation.tourist_id == tourist_id)
        .order_by(models.TouristLocation.id.desc())
        .first()
    )
    if not location:
        return {"alert": False, "reasons": ["No location found"]}

    point = Point(location.lon, location.lat)
    alerts = []

    # 2. Check restricted areas
    restricted_areas = db.query(models.RestrictedArea).all()
    for area in restricted_areas:
        try:
            polygon_geojson = json.loads(area.polygon)
            polygon_shape = shape(polygon_geojson)
            if polygon_shape.contains(point):
                alerts.append(f"Entered restricted area: {area.name}")
        except json.JSONDecodeError:
            alerts.append(f"Invalid polygon data for area: {area.name}")

    # 3. Check off-route
    route = (
        db.query(models.Route)
        .filter(models.Route.tourist_id == tourist_id)
        .order_by(models.Route.id.desc())
        .first()
    )
    if route:
        try:
            route_geometry = json.loads(route.geometry)
            route_line = LineString(route_geometry["coordinates"])
            distance = point.distance(route_line) * 111139  # degrees -> meters
            if distance > 50:  # 50m threshold
                alerts.append(f"Off-route detected! {int(distance)}m away")
        except json.JSONDecodeError:
            alerts.append("Invalid route geometry")

    if alerts:
        return {"alert": True, "reasons": alerts}

    return {"alert": False, "reasons": ["On route & safe"]}
