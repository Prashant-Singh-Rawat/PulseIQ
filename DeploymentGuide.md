# 🫀 Priocardix AI — Deployment Guide
### PulseIQ Guardian Engine™ `v1.4.2-Guardian-Elite`

## System Architecture
Priocardix AI uses a decoupled microservices architecture:
1. **Frontend (Guardian AI Sentinel):** React, Vite, Tailwind CSS, Framer Motion, and Three.js (`react-three-fiber`).
2. **Backend (ML PulseIQ Interface):** FastAPI, Scikit-Learn (Simulated Neural Engine), and Uvicorn.

### Critical Application Asset: 3D Heart Model
**Important:** To enable the ultra-realistic "Guardian Elite" 3D visualization, you must independently download a `.glb` human heart model (e.g., from Sketchfab or Poly Pizza) and place it directly into the frontend directory before running:
```bash
/frontend/public/heart.glb
```
If this file is missing, the system will launch using a safe procedural medical primitive fallback.

---

## Overview

Priocardix AI has two parts running simultaneously:
1. **Frontend** — React + Vite app → `localhost:5173`
2. **ML Backend** — FastAPI (Python) → `localhost:8000`
3. **Guardian Brain** — Zustand (runs entirely client-side, no extra server needed)

> [!IMPORTANT]
> The Guardian Brain (Zustand store with localStorage persistence) is self-contained in the frontend. Even without the backend running, the simulation engine will still work — demonstrating live vitals, anomaly detection, emergency protocols, and all UI features.

---

## 🖥️ LOCAL DEVELOPMENT (Laptop Demo / Offline)

### Requirements
- Node.js 18+ (`node --version`)
- Python 3.9+ (`python --version`)
- pip (`pip --version`)

### Step 1 — Start Backend (ML Risk Engine)
```bash
cd services/ml-service
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
✅ Backend running at: `http://localhost:8000`
✅ Swagger API docs: `http://localhost:8000/docs`

### Step 2 — Start Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend running at: `http://localhost:5173`

---

## 🔑 Login Credentials

| Role | Login | Password |
|---|---|---|
| Doctor (Demo) | `doctor@hospital.com` | `admin` |
| Patient | Register via `/signup` | — |

---

## 🔑 Key Files — Guardian Elite Architecture

| File | Purpose |
|---|---|
| `frontend/src/store/healthStore.js` | Global Guardian Brain (Zustand v4.0 — all state including **Workspace Expansion**) |
| `frontend/src/hooks/useGuardianEngine.js` | Autonomous Sentinel Engine (3-second deterministic simulation loop) |
| `frontend/src/components/EmergencySystem.jsx` | Multi-tier emergency lifecycle (Warning → Dispatch → Acknowledged) |
| `frontend/src/components/RiskMap.jsx` | Global Leaflet map with expansion zones |
| `frontend/src/components/AuditLogPanel.jsx` | Real-time event audit log |
| `frontend/src/pages/DigitalTwin.jsx` | 3D Heart command center + patient selector + speed control |
| `frontend/src/layouts/MainLayout.jsx` | Global system mode, AI thinking, **Universal Expansion Hub**, Logo persistence |

---

## ☁️ PRODUCTION DEPLOYMENT

### Deploy Backend → Render.com (free tier)
1. Push project to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect repo → set root directory to `services/ml-service`
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Deploy Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set root directory to `frontend`
3. Framework: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`

---

## 🗄️ Data Persistence

The Guardian Brain uses **Zustand persist** middleware with the key `priocardix-guardian-elite-v4`.

| Data | Stored In | Persists? |
|---|---|---|
| Vitals + History | `localStorage` (Guardian Brain) | ✅ Yes — survives reload |
| Workspace State  | `localStorage` (Guardian Brain) | ✅ Yes — expands globally |
| Personalization  | `localStorage` (Guardian Brain) | ✅ Yes |
| Audit Logs       | `localStorage` (Guardian Brain) | ✅ Yes |
| Auth Session     | `localStorage` (authStore)      | ✅ Yes |

---

## ✅ PRE-DEMO CHECKLIST

Before any presentation:

- [ ] Backend running (`python -m uvicorn app.main:app --port 8000 --reload`)
- [ ] Frontend running (`npm run dev`) in a separate terminal
- [ ] Browser open to `http://localhost:5173`
- [ ] **Test Global Expansion**: Click the floating chevron in the bottom-left to expand the workspace. Verify logo visibility.
- [ ] **Test Determinism**: Use the same BP/Stress inputs twice. Verify identical Risk and BPM output (no jitter).
- [ ] **Check Accuracy**: Verify Simulation Accuracy shows realistically between 85-88%.
- [ ] **Switch patient profile**: Change to "Senior" profile — verify risk jumps predictably.
- [ ] **Enable 5x speed mode**: Verify simulation accelerates.
- [ ] **Set BP to 180**: Trigger emergency lifecycle.
- [ ] **Test "Reset Simulation"**: Verify all vitals and workspace state return to baseline.

---

## ❗ TROUBLESHOOTING

| Problem | Solution |
|---|---|
| Floating Button missing | Check `z-index` conflict in custom components |
| No BPM Jitter? | Intentional — system is now deterministic for medical consistency |
| Accuracy seems low | Re-calibrated to 85-88% for professional clinical realism |
| 3D heart not loading | Ensure `heart.glb` is in `/frontend/public/` |
| Sidebar won't expand | Global state block — refresh or Reset Simulation |
| Map not showing | Check Leaflet CSS import in `RiskMap.jsx` |
