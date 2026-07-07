from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models
from shapely.geometry import Point, shape, LineString
import json

router = APIRouter(prefix="/realtime", tags=["RealTime"])
connections = {}


@router.websocket("/tourist/{tourist_id}")
async def tourist_ws(websocket: WebSocket, tourist_id: int):
    # Accept connection
    await websocket.accept()
    connections[tourist_id] = websocket

    # Create a new DB session for this connection
    db: Session = SessionLocal()

    try:
        while True:
            data = await websocket.receive_json()
            lat = data["lat"]
            lon = data["lon"]

            # Save latest location in DB
            loc = models.TouristLocation(
                tourist_id=tourist_id,
                lat=lat,
                lon=lon
            )
            db.add(loc)
            db.commit()
            db.refresh(loc)

            point = Point(lon, lat)
            alerts = []

            # 1. Check restricted areas
            restricted_areas = db.query(models.RestrictedArea).all()
            for area in restricted_areas:
                try:
                    polygon_shape = shape(json.loads(area.polygon))
                    if polygon_shape.contains(point):
                        alerts.append(f"Entered restricted area: {area.name}")
                except json.JSONDecodeError:
                    alerts.append(f"Invalid polygon data for area: {area.name}")

            # 2. Check off-route using latest route from DB
            route = (
                db.query(models.Route)
                .filter(models.Route.tourist_id == tourist_id)
                .order_by(models.Route.id.desc())
                .first()
            )
            if route:
                try:
                    route_geojson = json.loads(route.geometry)
                    route_line = LineString(route_geojson["coordinates"])
                    distance = point.distance(route_line) * 111139  # meters
                    if distance > 50:
                        alerts.append(f"Off-route detected! {int(distance)}m away")
                except Exception:
                    alerts.append("Invalid route geometry")

            # Send alert or safe status back to frontend
            await websocket.send_json({"alert": bool(alerts), "reasons": alerts or ["Safe"]})

    except WebSocketDisconnect:
        # Remove connection on disconnect
        connections.pop(tourist_id, None)
    finally:
        db.close()

