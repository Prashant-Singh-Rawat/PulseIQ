import pandas as pd
import numpy as np
import pickle

class PredictionAgent:
    def __init__(self, model_path="app/models/digital_twin_model.pkl"):
        self.model = None
        self.scaler = None
        self.expected_features = []
        try:
            with open(model_path, "rb") as f:
                payload = pickle.load(f)
                self.model = payload['model']
                self.scaler = payload['scaler']
                self.expected_features = payload['features']
        except Exception as e:
            print(f"PredictionAgent Init Error: {e}")

    def get_risk(self, data_dict):
        if not self.model:
            return {"error": "Model not loaded"}
        
        df = pd.DataFrame([data_dict])
        df = df[self.expected_features]
        scaled = self.scaler.transform(df)
        
        risk_prob = float(self.model.predict_proba(scaled)[0][1] * 100)
        
        # Clinical overrides
        if data_dict.get('RestingBP', 0) >= 180: risk_prob = max(risk_prob, 95.0)
        
        return {
            "risk_score": round(risk_prob, 2),
            "risk_category": self._get_category(risk_prob)
        }

    def _get_category(self, score):
        if score > 80: return "CRITICAL"
        if score > 55: return "HIGH"
        if score > 30: return "ELEVATED"
        return "STABLE"
