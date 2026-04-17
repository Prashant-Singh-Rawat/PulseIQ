from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import random
from datetime import datetime, timedelta

from .database import get_db, User, InterventionTask, UserTask, HealthHistory
from pydantic import BaseModel

app = FastAPI(title="Priocardix Intervention & Adherence Engine")

class TaskResponse(BaseModel):
    id: int
    title: str
    category: str
    risk_impact_pct: float
    status: str

@app.get("/api/interventions/tasks/{user_id}", response_model=List[TaskResponse])
def get_daily_tasks(user_id: int, db: Session = Depends(get_db)):
    # Check if user has tasks for today
    today = datetime.utcnow().date()
    existing_tasks = db.query(UserTask).filter(
        UserTask.user_id == user_id,
        UserTask.assigned_at >= today
    ).all()
    
    if not existing_tasks:
        # Simple Logic: Assign 3 random tasks for now
        # Later: Use ML to assign tasks based on specific risk factors (e.g., high BP -> more exercise)
        all_tasks = db.query(InterventionTask).all()
        selected = random.sample(all_tasks, min(len(all_tasks), 3))
        
        for t in selected:
            new_ut = UserTask(user_id=user_id, task_id=t.id, status="pending")
            db.add(new_ut)
        db.commit()
        
        existing_tasks = db.query(UserTask).filter(
            UserTask.user_id == user_id,
            UserTask.assigned_at >= today
        ).all()

    results = []
    for ut in existing_tasks:
        task_info = db.query(InterventionTask).filter(InterventionTask.id == ut.task_id).first()
        results.append({
            "id": ut.id,
            "title": task_info.title,
            "category": task_info.category,
            "risk_impact_pct": task_info.risk_impact_pct,
            "status": ut.status
        })
    return results

@app.post("/api/interventions/complete/{user_task_id}")
def complete_task(user_task_id: int, db: Session = Depends(get_db)):
    ut = db.query(UserTask).filter(UserTask.id == user_task_id).first()
    if not ut:
        raise HTTPException(status_code=404, detail="Task not found")
    
    ut.status = "completed"
    ut.completed_at = datetime.utcnow()
    
    # Update Gamification Points & Streak
    user = db.query(User).filter(User.id == ut.user_id).first()
    if user:
        user.points += 10
        # Simple streak logic: if they complete something daily
        user.streak += 1 
        
    db.commit()
    return {"message": "Task marked as complete", "points_earned": 10}

@app.get("/api/interventions/adherence/{user_id}")
def get_task_adherence(user_id: int, db: Session = Depends(get_db)):
    """
    FEATURE 2: ADHERENCE PREDICTION & GAMIFICATION
    """
    user = db.query(User).filter(User.id == user_id).first()
    history = db.query(UserTask).filter(UserTask.user_id == user_id).all()
    
    if not history:
        return {"adherence_probability": 75.0, "reason": "No history - benchmark average applied"}
    
    completed = len([h for h in history if h.status == "completed"])
    total = len(history)
    rate = (completed / total) * 100
    
    # Artificial ML noise for demonstration
    probability = max(5, min(95, rate + random.uniform(-5, 5)))
    
    return {
        "adherence_probability": round(probability, 2),
        "status": "AT RISK" if probability < 40 else "STABLE",
        "trend": "improving" if rate > 50 else "declining"
    }
