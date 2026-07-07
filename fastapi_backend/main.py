import datetime
import requests
from typing import List, Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import our custom helper functions from other files
from blockchain_utils import create_tourist_id_on_chain, verify_tourist_id_on_chain
from orsm_client import get_route

# --- App Setup ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for hackathon simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-Memory Data Stores for Prototype ---
broadcast_store = []
restricted_areas = []
trespassing_alerts = []
user_specific_alerts = {}
planned_routes = {}
incidents_store = []

# --- Pydantic Models (Data Blueprints) ---

class BroadcastIn(BaseModel): title: str; body: str; priority: str
class BroadcastOut(BaseModel): title: str; body: str; priority: str; timestamp: str
class GeoJSONPoint(BaseModel): type: Literal["Point"] = "Point"; coordinates: List[float]
class GeoJSONPolygon(BaseModel): type: Literal["Polygon"] = "Polygon"; coordinates: List[List[List[float]]]
class RestrictedAreaIn(BaseModel): name: str; polygon: GeoJSONPolygon
class TouristLocationIn(BaseModel): tourist_id: str; location: GeoJSONPoint
class TrespassingAlertOut(BaseModel): tourist_id: str; area_name: str; location: GeoJSONPoint; timestamp: str; type: Literal["TRESPASSING", "DEVIATION"]
class TouristIdIn(BaseModel): unique_tourist_id: str
class SosIncidentIn(BaseModel): touristId: str; location: str; type: str; severity: str; description: str; touristInfo: dict
class SosIncidentOut(SosIncidentIn): id: str; timestamp: str; status: str

# --- Helper Function for Geo-fencing Check ---
def is_point_in_polygon(point_coords, polygon_coords):
    lon, lat = point_coords
    poly = polygon_coords[0]
    n = len(poly)
    inside = False
    if n < 3: return False
    p1lon, p1lat = poly[0]
    for i in range(n + 1):
        if len(poly[i % n]) != 2: continue
        p2lon, p2lat = poly[i % n]
        if lat > min(p1lat, p2lat):
            if lat <= max(p1lat, p2lat):
                if lon <= max(p1lon, p2lon):
                    if p1lat != p2lat:
                        xinters = (lat - p1lat) * (p2lon - p1lon) / (p2lat - p1lat) + p1lon
                    if p1lon == p2lon or lon <= xinters:
                        inside = not inside
        p1lon, p1lat = p2lon, p2lat
    return inside

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Smart Tourist Safety System Backend is running!"}

# Blockchain Endpoints
@app.post("/tourist/create-id")
async def create_id(data: TouristIdIn):
    result = create_tourist_id_on_chain(data.unique_tourist_id)
    return result

@app.get("/tourist/verify-id")
async def verify_id(tourist_id: str):
    result = verify_tourist_id_on_chain(tourist_id)
    return result

# Broadcast Endpoints
@app.post("/broadcast", response_model=BroadcastOut)
def send_broadcast(data: BroadcastIn):
    broadcast_data = { "title": data.title, "body": data.body, "priority": data.priority, "timestamp": datetime.datetime.utcnow().isoformat() + "Z" }
    broadcast_store.append(broadcast_data)
    return broadcast_data

# Note: The endpoint for users to get alerts is now /user-alerts/{tourist_id}
# This /alerts endpoint is kept for simplicity or can be removed.
@app.get("/alerts", response_model=List[BroadcastOut])
def get_broadcast_alerts():
    return broadcast_store

# Restricted Areas Management
@app.post("/restricted-areas", status_code=201)
def add_restricted_area(data: RestrictedAreaIn):
    restricted_areas.append({"name": data.name, "polygon": data.polygon.model_dump()})
    return {"message": f"Restricted area '{data.name}' added."}

@app.get("/trespassing-alerts", response_model=List[TrespassingAlertOut])
def get_admin_trespassing_alerts():
    return trespassing_alerts

# OSRM Route Endpoint
@app.get("/route/create")
def create_route(tourist_id: str, start_lat: float, start_lon: float, end_lat: float, end_lon: float):
    route_data = get_route((start_lat, start_lon), (end_lat, end_lon))
    if "routes" in route_data and route_data["routes"]:
        geometry = route_data["routes"][0]["geometry"]
        planned_routes[tourist_id] = geometry
        return {"message": "Route created successfully", "route_geometry": geometry}
    return {"error": "No route found"}

# Location Update and Geo-fencing Check
@app.post("/location")
def update_location(data: TouristLocationIn):
    if data.tourist_id not in user_specific_alerts: user_specific_alerts[data.tourist_id] = []
    for area in restricted_areas:
        if is_point_in_polygon(data.location.coordinates, area["polygon"]["coordinates"]):
            trespass_alert = {"tourist_id": data.tourist_id, "area_name": area["name"], "location": data.location.model_dump(), "timestamp": datetime.datetime.utcnow().isoformat() + "Z", "type": "TRESPASSING", "title": "Trespassing Alert", "body": f"You have entered the restricted area: {area['name']}.", "priority": "CRITICAL"}
            trespassing_alerts.append(trespass_alert)
            user_specific_alerts[data.tourist_id].append(trespass_alert)
    return {"status": "Location updated."}
    
# Deviation Alert Simulation Endpoint
@app.post("/simulate/deviation-alert", status_code=201)
def trigger_deviation_alert(tourist_id: str):
    if tourist_id not in user_specific_alerts: user_specific_alerts[tourist_id] = []
    deviation_alert = {"tourist_id": tourist_id, "area_name": "Route Deviation", "location": {"type": "Point", "coordinates": [77.2167, 28.6448]}, "timestamp": datetime.datetime.utcnow().isoformat() + "Z", "type": "DEVIATION", "title": "Route Deviation Alert", "body": "You have deviated from your planned route.", "priority": "HIGH"}
    trespassing_alerts.append(deviation_alert)
    user_specific_alerts[tourist_id].append(deviation_alert)
    return {"message": "Deviation alert created successfully for " + tourist_id}

# SOS Incident Endpoints
@app.post("/incidents/sos", response_model=SosIncidentOut, status_code=201)
def create_sos_incident(data: SosIncidentIn):
    new_incident = { **data.model_dump(), "id": f"T-{datetime.datetime.utcnow().timestamp():.0f}", "timestamp": datetime.datetime.utcnow().isoformat() + "Z", "status": "NEW" }
    incidents_store.append(new_incident)
    return new_incident

@app.get("/incidents", response_model=List[SosIncidentOut])
def get_incidents():
    return sorted(incidents_store, key=lambda x: x['timestamp'], reverse=True)

# Unified Endpoint for User Website to get all alerts
@app.get("/user-alerts/{tourist_id}")
def get_all_user_alerts(tourist_id: str):
    personal_alerts = user_specific_alerts.get(tourist_id, [])
    typed_broadcasts = [{**b, "type": "BROADCAST"} for b in broadcast_store]
    all_alerts = personal_alerts + typed_broadcasts
    all_alerts.sort(key=lambda x: x["timestamp"], reverse=True)
    return all_alerts

