from sqlalchemy import Column, Integer, String, Float, Text
from .database import Base

class Tourist(Base):
    __tablename__ = "tourists"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

class RestrictedArea(Base):
    __tablename__ = "restricted_areas"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    polygon = Column(Text)  # GeoJSON polygon

class TouristLocation(Base):
    __tablename__ = "tourist_locations"
    id = Column(Integer, primary_key=True, index=True)
    tourist_id = Column(Integer)
    lat = Column(Float)
    lon = Column(Float)

class Route(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True, index=True)
    tourist_id = Column(Integer)
    geometry = Column(Text)  # Store OSRM route geometry as GeoJSON
