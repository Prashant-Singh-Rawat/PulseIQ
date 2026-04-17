class SimulationAgent:
    """Handles Digital Twin forecasts and biological age simulation."""
    def get_simulation(self, data_dict, risk_prob):
        # Biological heart age logic
        bpm_penalty = max(0, data_dict.get('RestingBP', 120) - 120) * 0.4
        stress_penalty = data_dict.get('Stress_Level', 5) * 0.8
        bio_age = float(data_dict.get('Age', 45) + bpm_penalty + stress_penalty - (data_dict.get('Sleep_Hours', 7) * 0.4))
        
        # Forecasts
        forecasts = {
            "1_Month": round(max(0, min(100, risk_prob + (data_dict.get('Stress_Level', 5) * 0.5))), 1),
            "1_Year": round(max(0, min(100, risk_prob + (data_dict.get('Stress_Level', 5) * 9.0))), 1),
        }
        
        return {
            "biological_heart_age": round(bio_age, 1),
            "forecasts": forecasts,
            "health_score": round(float(100 - risk_prob), 1)
        }
