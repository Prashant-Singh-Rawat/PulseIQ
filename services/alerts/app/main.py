from fastapi import FastAPI, Depends, HTTPException
from typing import List
import random

app = FastAPI(title="Priocardix Alert & Crisis Hub")

@app.get("/api/alerts/emergency/route/{user_id}")
def get_emergency_route(user_id: int):
    """
    FEATURE 15: EMERGENCY ROUTING
    """
    return {
        "status": "EMERGENCY_MODE_ACTIVE",
        "nearest_cardiac_center": "St. Marys General ICU",
        "distance_km": 2.4,
        "estimated_arrival_mins": 8,
        "traffic_status": "MODERATE",
        "routing_coordinates": [[12.9716, 77.5946], [12.9801, 77.6012]]
    }

@app.get("/api/alerts/hospital/queue")
def get_hospital_triage_queue():
    """
    FEATURE 9: ENTERPRISE DASHBOARD / TRIAGE
    """
    return [
        {"id": "P-4491", "name": "A. Sharma", "risk": 88, "status": "CRITICAL", "arrival": "2 mins ago"},
        {"id": "P-2201", "name": "K. Gupta", "risk": 72, "status": "HIGH", "arrival": "15 mins ago"},
        {"id": "P-9912", "name": "M. Patel", "risk": 45, "status": "STABLE", "arrival": "1 hour ago"},
    ]

@app.get("/api/alerts/caregiver/status/{user_id}")
def get_caregiver_sync_status(user_id: int):
    """
    FEATURE 6: CAREGIVER DASHBOARD
    """
    return {
        "caregiver_linked": True,
        "caregiver_name": "Dr. Sarah J.",
        "last_sync": "4 mins ago",
        "monitoring_level": "PREMIUM_ACTIVE"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3003)
