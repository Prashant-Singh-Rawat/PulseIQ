from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://priocardix_admin:guardian_password@localhost:5432/priocardix_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    identifier = Column(String, unique=True)
    password = Column(String)
    role = Column(String)
    points = Column(Integer, default=0)
    streak = Column(Integer, default=0)

class InterventionTask(Base):
    __tablename__ = "intervention_tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    category = Column(String)
    risk_impact_pct = Column(Float)
    description = Column(Text)

class UserTask(Base):
    __tablename__ = "user_tasks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    task_id = Column(Integer, ForeignKey("intervention_tasks.id"))
    status = Column(String, default="pending")
    assigned_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class HealthHistory(Base):
    __tablename__ = "health_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    risk_score = Column(Float)
    resting_bp = Column(Integer)
    cholesterol = Column(Integer)
    stress_level = Column(Integer)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
