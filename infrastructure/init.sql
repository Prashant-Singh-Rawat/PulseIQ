-- Priocardix AI: Enterprise Database Initialization
-- Schema for PulseIQ Guardian Engine Expansion

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    identifier VARCHAR(255) UNIQUE NOT NULL, -- Email or Mobile
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'patient', -- patient, doctor, caregiver
    caregiver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    points INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS health_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    risk_score FLOAT,
    resting_bp INTEGER,
    cholesterol INTEGER,
    stress_level INTEGER,
    heart_rate INTEGER,
    sleep_hours FLOAT,
    sodium_mg INTEGER
);

CREATE TABLE IF NOT EXISTS intervention_tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50), -- DIET, EXERCISE, MEDICATION, MENTAL_HEALTH
    risk_impact_pct FLOAT,
    description TEXT
);

CREATE TABLE IF NOT EXISTS user_tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES intervention_tasks(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, skipped
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Seed Data (Interventions)
INSERT INTO intervention_tasks (title, category, risk_impact_pct, description) VALUES
('Morning Vascular Walk', 'EXERCISE', 12.5, '30 minutes of brisk walking to reduce arterial pressure.'),
('Zero-Sodium Meal Prep', 'DIET', 8.2, 'Replace salt with herbs for all meals today to stabilize BP.'),
('Deep Micro-Meditation', 'MENTAL_HEALTH', 5.0, '15 minutes of guided breathing to lower cortisol.'),
('Hydration Sync', 'DIET', 3.0, 'Intake 3L of water to optimize blood viscosity.'),
('Sleep Restoration Cycle', 'MENTAL_HEALTH', 7.5, 'Ensure 8 hours of uninterrupted sleep for neural recovery.'),
('Aspirin 81mg Maintenance', 'MEDICATION', 15.0, 'Daily low-dose aspirin as prescribed for arterial thinning.'),
('Atorvastatin Pulse Sync', 'MEDICATION', 20.0, 'Lipid-stabilizing medication to be taken before the restoration cycle.');
