from pydantic import BaseModel
from typing import List, Literal

class GeoJSONPoint(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: List[float]  # [lon, lat]

class GeoJSONPolygon(BaseModel):
    type: Literal["Polygon"] = "Polygon"
    coordinates: List[List[List[float]]]

class RestrictedAreaCreate(BaseModel):
    name: str
    polygon: GeoJSONPolygon

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "Restricted Area",
                "polygon": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [77.216721, 28.644800],
                            [77.216721, 28.645800],
                            [77.217721, 28.645800],
                            [77.217721, 28.644800],
                            [77.216721, 28.644800]
                        ]
                    ]
                }
            }
        }
    }

class TouristCreate(BaseModel):
    name: str

class TouristLocationUpdate(BaseModel):
    tourist_id: int
    location: GeoJSONPoint
