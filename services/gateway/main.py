from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os

app = FastAPI(title="Priocardix AI Enterprise Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SERVICE CONFIG
ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://ml-engine:8000")
INTERVENTION_SERVICE_URL = os.getenv("INTERVENTION_SERVICE_URL", "http://intervention-engine:3001")
ANALYTICS_SERVICE_URL = os.getenv("ANALYTICS_SERVICE_URL", "http://analytics-hub:3002")
ALERT_SERVICE_URL = os.getenv("ALERT_SERVICE_URL", "http://alert-hub:3003")

@app.get("/")
def read_root():
    return {"status": "Priocardix Gateway Active", "engine": "PulseIQ Guardian"}

@app.get("/api/health")
async def health_check():
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{ML_SERVICE_URL}/")
            return {
                "gateway": "online",
                "ml_engine": resp.json()
            }
    except Exception as e:
        return {"gateway": "online", "ml_engine": "offline", "error": str(e)}

# Proxy for existing Part 1 functionality
@app.post("/api/predict")
async def proxy_predict(data: dict):
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{ML_SERVICE_URL}/api/predict", json=data)
        return resp.json()

@app.post("/api/simulate")
async def proxy_simulate(data: dict):
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{ML_SERVICE_URL}/api/simulate", json=data)
        return resp.json()

# Analytics Proxy
@app.get("/api/analytics/history/{user_id}")
async def proxy_history(user_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{ANALYTICS_SERVICE_URL}/api/analytics/history/{user_id}")
        return resp.json()

@app.get("/api/analytics/forecast/population")
async def proxy_forecast():
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{ANALYTICS_SERVICE_URL}/api/analytics/forecast/population")
        return resp.json()

@app.get("/api/analytics/wearable/sync/{user_id}")
async def proxy_wearable(user_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{ANALYTICS_SERVICE_URL}/api/analytics/wearable/sync/{user_id}")
        return resp.json()

# Alerts & Social Proxy
@app.get("/api/alerts/emergency/route/{user_id}")
async def proxy_emergency(user_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{ALERT_SERVICE_URL}/api/alerts/emergency/route/{user_id}")
        return resp.json()

@app.get("/api/alerts/hospital/queue")
async def proxy_hospital_queue():
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{ALERT_SERVICE_URL}/api/alerts/hospital/queue")
        return resp.json()

# Interventions Proxy
@app.get("/api/interventions/tasks/{user_id}")
async def proxy_tasks(user_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{INTERVENTION_SERVICE_URL}/api/interventions/tasks/{user_id}")
        return resp.json()

@app.post("/api/interventions/complete/{task_id}")
async def proxy_complete_task(task_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{INTERVENTION_SERVICE_URL}/api/interventions/complete/{task_id}")
        return resp.json()

@app.get("/api/interventions/adherence/{user_id}")
async def proxy_adherence(user_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{INTERVENTION_SERVICE_URL}/api/interventions/adherence/{user_id}")
        return resp.json()

# Advanced Intelligence Proxies
@app.get("/api/analytics/causal")
async def proxy_causal():
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{ANALYTICS_SERVICE_URL}/api/analytics/causal")
        return resp.json()

@app.get("/api/analytics/federated/status")
async def proxy_federated():
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{ANALYTICS_SERVICE_URL}/api/analytics/federated/status")
        return resp.json()

@app.get("/api/analytics/hotspots")
async def proxy_hotspots():
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{ANALYTICS_SERVICE_URL}/api/analytics/hotspots")
        return resp.json()
