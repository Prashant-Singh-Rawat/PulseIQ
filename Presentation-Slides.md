# 🫀 Priocardix AI — Presentation Slides (Content)

> **v6.0 — Guardian Elite Edition** | Updated April 2026
> Recommended Palette: Dark background (`#050810`), Pulse Red (`#ff3366`), Health Cyan (`#00f0ff`).

---

## SLIDE 1 — TITLE SLIDE
```
🫀 Priocardix AI
Autonomous Cardiovascular Intelligence Platform
Powered by PulseIQ Guardian Engine™ v1.4.2-Guardian-Elite

[Your Name] | INT 428 | [Date]
"Predict. Prevent. Protect — Intelligent Cardiac Care for the Future."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 Global Guardian Brain | 🛡️ Autonomous Sentinel | 🌐 Spatial Intelligence
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## SLIDE 2 — THE PROBLEM
- Heart disease is the **#1 killer** in India — 1 in 4 deaths.
- Most risk systems are **reactive, not proactive** — you see a doctor only after symptoms.
- Existing tools give a **single prediction, not continuous monitoring**.
- Emergency response in critical events is **manual and slow**.

---

## SLIDE 3 — THE SOLUTION: GUARDIAN ELITE ARCHITECTURE

**Title: One Brain. Every System. Zero Latency.**

```
┌────────────────────────────────────────────────────┐
│              GLOBAL GUARDIAN BRAIN                 │
│          (Zustand + Persist Middleware)             │
│   bpm · bp · risk · emergencyState · auditLogs     │
└────┬──────────┬──────────┬────────────┬────────────┘
     │          │          │            │
  3D Twin    Risk Map   Emergency   AI Insights
 (Three.js) (Leaflet)   System    (Explainability)
```

Every component reads/writes to a single source of truth. No desync. No stale data.

---

## SLIDE 4 — THE AUTONOMOUS SENTINEL ENGINE

| Feature | Description |
|---|---|
| ⏱️ **3-Second Simulation Loop** | Clinical vitals recalculated every 3s |
| 🧬 **Personalized Risk Formula** | Age + BMI penalty applied per patient profile |
| 🔁 **Fail-Safe Recovery** | try/catch resets to safe baseline on any error |
| ⚡ **Simulation Speed Control** | 1x / 2x / 5x — adjustable live |
| 🤖 **AI Thinking State** | "Analyzing physiological signals…" shown during each cycle |
| 📊 **Performance Metrics** | Computation time measured in ms per cycle |

---

## SLIDE 5 — EMERGENCY SENTINEL PROTOCOL

**Title: Autonomous Multi-Tier Safety System**

```
Risk > 70%  →  ⚠️  WARNING BANNER (Orange)
Risk > 85%  →  🚨  EMERGENCY MODAL + Hospital Data
Risk > 95%  →  🔴  CRITICAL HUD OVERLAY
After 6s    →  📡  DISPATCH INITIATED (Satellite Uplink Countdown)
Countdown=0 →  ✅  "Emergency Acknowledged by Hospital" (AIIMS)
Risk drops  →  🔵  SYSTEM STABILIZING... (4s Recovery Banner)
```

100% Autonomous — no user clicks required.

---

## SLIDE 6 — INTELLIGENCE & TRANSPARENCY

| Metric | Description |
|---|---|
| 🎯 **Explainability Score** | 0–100 — how many strong factors drive the current risk |
| 📈 **Health Drift Detection** | Flags worsening trends across recent history |
| ⚡ **Anomaly Detection** | Flags sudden risk spikes > 25% in one cycle |
| 🫀 **Cardiac Load** | LOW / MEDIUM / HIGH — real-time strain classification |
| 🔍 **System Mode** | MONITORING → EMERGENCY → RECOVERY |
| 📋 **Audit Log** | Timestamped trail of all system events |

---

## SLIDE 7 — SPATIAL INTELLIGENCE MAP

- **Leaflet + OpenStreetMap** — No API key required
- **Expansion Zones**: Dashed circles showing predicted population cluster spread
- **Live Updates**: Hotspot risk and zones update every 3 seconds
- **User Node**: Pulsing beacon at your location — changes color with your risk
- **Map Scale Context**: "X Active Nodes | Y High Risk Regions" — live header

---

## SLIDE 8 — MULTI-PATIENT MODE & UX

| Profile | Age | BP | Use Case |
|---|---|---|---|
| 🏃 Athlete  | 26 | 105 mmHg | Baseline low-risk demo |
| 👤 Average  | 45 | 120 mmHg | Standard clinical profile |
| 👴 Senior   | 70 | 155 mmHg | High-risk demonstration |

- **One-click patient switch** — Guardian Brain instantly reloads and history resets
- **Session Memory** — All data persists across browser reloads (Zustand persist)
- **System Reset** — Reset Simulation button available in sidebar and audit panel

---

## SLIDE 9 — THE TECH STACK (v6.0 Guardian Elite)

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Global State | Zustand (persist) |
| 3D Visualization | React Three Fiber, Three.js, GLB |
| Mapping | Leaflet, OpenStreetMap |
| Animations | Framer Motion |
| Charts | Recharts |
| Styling | Tailwind CSS |
| Backend API | FastAPI (Python), Uvicorn |
| ML Model | Random Forest Classifier (Scikit-learn) |
| Data | 600,000+ synthetic patient records |

---

## SLIDE 10 — CONCLUSION & LIVE DEMO

```
Priocardix AI Guardian Elite — What We Built:

✅ Global Guardian Brain — 1 store, all components synchronized
✅ Autonomous Sentinel — 3-second clinical loop, fail-safe protected
✅ Emergency Protocol — 6 autonomous stages, hospital acknowledgement
✅ Spatial Intelligence — Live map with expansion zones
✅ Audit Log — Enterprise-grade event trail
✅ Clinical Report — One-click, print-ready, explainable AI
✅ Multi-Patient Mode — Athlete, Average, Senior profiles
✅ Persistence — Session memory across reloads
```

> *"We didn't just build a prediction tool. We built an autonomous cardiovascular sentinel. This is Priocardix AI — Guardian Elite."*
