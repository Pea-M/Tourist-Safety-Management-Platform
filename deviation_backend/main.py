from fastapi import FastAPI
from .database import Base, engine
from .routes import tourist, restricted, route, alerts, location

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(tourist.router)
app.include_router(restricted.router)
app.include_router(route.router)
app.include_router(location.router)   # ✅ Add location route
app.include_router(alerts.router)
app.include_router(realtime.router)
