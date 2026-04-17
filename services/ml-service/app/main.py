from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import warnings

# Import Agents
from .agents.prediction_agent import PredictionAgent
from .agents.simulation_agent import SimulationAgent
from .agents.coaching_agent import CoachingAgent

warnings.filterwarnings('ignore')

app = FastAPI(title="Priocardix AI PulseIQ Guardian Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Multi-Agent System
predictor = PredictionAgent()
simulator = SimulationAgent()
coach = CoachingAgent()

class PatientData(BaseModel):
    Age: int
    RestingBP: int
    Cholesterol: int
    Stress_Level: int = 5
    Sleep_Hours: float = 7.0
    # Additional enterprise features
    Sodium_mg: int = 2400
    Caffeine_mg: int = 150

@app.get("/")
def health_check():
    return {
        "status": "PulseIQ Guardian Engine Active",
        "agents": ["Prediction", "Simulation", "Coaching"],
        "version": "4.0.0-Enterprise"
    }

@app.post("/api/predict")
def predict_risk(data: dict):
    """Core prediction endpoint for legacy and UI integration."""
    # Convert keys to TitleCase if needed by the agent
    mapped_data = {
        "Age": data.get("age", 45),
        "RestingBP": data.get("resting_bp", 120),
        "Cholesterol": data.get("cholesterol", 190),
        "MaxHeartRate": data.get("max_heart_rate", 150),
        "Stress_Level": data.get("stress", 5),
        "Sleep_Hours": data.get("sleep", 7.0)
    }
    prediction = predictor.get_risk(mapped_data)
    return {
        **prediction,
        "engine": "PulseIQ Guardian Engine"
    }

@app.post("/api/simulate")
def run_twin_orchestration(data: PatientData):
    """Orchestrates all agents to provide a unified digital twin response."""
    data_dict = data.model_dump()
    
    # 1. Prediction Agent (Core Risk)
    prediction_result = predictor.get_risk(data_dict)
    
    # 2. Simulation Agent (Biological Age & Forecasts)
    simulation_result = simulator.get_simulation(data_dict, prediction_result['risk_score'])
    
    # 3. Coaching Agent (Insights & Advice)
    coaching_result = coach.get_coaching(data_dict)
    
    # Merge results (Multi-Agent Fusion)
    return {
        **prediction_result,
        **simulation_result,
        **coaching_result,
        "engine": "PulseIQ Guardian Engine"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
