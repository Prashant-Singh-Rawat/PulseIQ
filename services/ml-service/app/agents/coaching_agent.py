class CoachingAgent:
    """Handles explanations, SHAP impacts, and personalized feedback."""
    def get_coaching(self, data_dict):
        # Calculate Simulated Impacts for UX (simplified SHAP)
        explanation = {
            "Blood Pressure": float(2.5 * (data_dict.get('RestingBP', 120) - 120)),
            "Cholesterol": float(1.8 * (data_dict.get('Cholesterol', 190) - 190)),
            "Age": float(1.4 * (data_dict.get('Age', 45) - 45))
        }
        
        top_feature = max(explanation, key=lambda k: abs(explanation[k]))
        
        return {
            "top_contributing_feature": top_feature,
            "feature_impacts": explanation,
            "clinical_advice": self._generate_advice(top_feature, explanation[top_feature])
        }

    def _generate_advice(self, feature, impact):
        if impact > 20:
            return f"Priority: Your {feature} is the dominant risk factor. Consider immediate clinical consultation."
        elif impact > 0:
            return f"Observation: Your {feature} is contributing to risk. Lifestyle adjustments recommended."
        return "Insight: Your biometric indicators are currently well-balanced relative to your demographic average."
