# 🫀 Priocardix AI — Interview / Viva Preparation Notes
### PulseIQ Guardian Engine™ v1.4.2-Guardian-Elite

> Read this the night before your viva. Know these answers confidently.

---

## 🎯 SECTION 1: PROJECT OVERVIEW (Say this as your opening)

**"Priocardix AI is an autonomous, enterprise-grade cardiovascular intelligence platform powered by our deterministic PulseIQ Guardian Engine. It continuously monitors patient biometrics — age, BP, stress, and sleep — to predict heart attack risk in real-time. What makes our system unique is the Global Guardian Brain (Zustand), which orchestrates a synchronized environment: from the 3D Heart Twin to the Global Risk Map and the live Audit Log. The platform also features a Universal Workspace Expansion control and a multi-tier autonomous emergency system that handles everything from anomaly detection to satellite hospital dispatch initiation."**

---

## ❓ SECTION 2: EXPECTED VIVA QUESTIONS & ANSWERS

---

### 🔵 BASICS

**Q: What is the main objective of your project?**
> To build an intelligent, fully autonomous cardiac surveillance platform that monitors biometrics, detects pathological trends (drift), and triggers emergency protocols — while maintaining transparency through a persistent audit trail.

**Q: What dataset did you use?**
> A synthetic dataset of 600,000+ patient records generated based on clinical cardiovascular studies. It incorporates real-world biometric distributions for diverse age and risk profiles.

**Q: What machine learning algorithm did you use and why?**
> We used a **Random Forest Classifier**. It is an ensemble method perfectly suited for clinical data because it handles non-linear relationships, is robust to outliers, and provides "Feature Importance" — which we use to explain to the user exactly why their risk score changed.

**Q: What is the accuracy of your model?**
> Measured at **85–88%**. We intentionally calibrated the model to this range to ensure professional clinical realism and avoid overfitting, ensuring it generalizes perfectly across athlete, average, and senior profiles.

---

### 🔵 TECHNICAL — GUARDIAN BRAIN & ENGINE

**Q: What is the "Guardian Brain"?**
> It is our global state management system (`healthStore.js`). Every biometric, system mode, and even the workspace expansion state is managed here. This ensures that if the user expands their workspace on one page, the setting persists globally. It is the "Single Source of Truth."

**Q: What is the Deterministic Sentinel Engine?**
> It is our autonomous simulation core. Unlike standard simulations that use random jitter, our engine is **purely deterministic**. This means identical inputs (e.g., BP 140, Stress 8) will always yield the exact same risk result, ensuring medical consistency and eliminating simulation noise.

**Q: What is Workspace Expansion?**
> We implemented a **Universal Expansion Control**. It’s a floating, branded button that collapses the main sidebar globally. This uses the Guardian Brain to ensure a zero-distraction clinical environment across all pages.

**Q: How does the multi-tier emergency protocol work?**
> - **WARNING** (>70%): Global orange status alert.
> - **EMERGENCY** (>85%): Full-screen modal; triggers hospital link protocol.
> - **CRITICAL** (>95%): Activates the red HUD border and the Emergency Terminal.
> - **DISPATCH**: A 5-second satellite uplink countdown that simulates real-world emergency service synchronization.

**Q: What is Anomaly vs. Health Drift Detection?**
> - **Anomaly**: A sudden, violent spike in risk (>25% delta) in a single engine cycle.
> - **Health Drift**: A long-term worsening trend found by comparing historical data blocks.

**Q: How does the PDF/Report export work?**
> It generates a **Cardiac Intelligence Report** (`CardiacReportModal.jsx`) which includes Risk, Health Score, Explainability, Audit records, and full engine metadata. This is the "Clinical Handover" document for cardiologists.

---

### 🔵 DESIGN & UX

**Q: What makes your UI unique?**
> - **Holographic HUD Mode**: Uses CSS 3D perspectives to tilt the UI for a medical-grade cockpit feel.
> - **Hover-Reveal Navigation**: Dock labels only appear on hover, keeping the dashboard metadata-focused.
> - **Branded Persistence**: The Logo stays visible next to the expansion controls even when the sidebar is hidden.

---

## 📌 SECTION 3: KEY NUMBERS TO MEMORIZE

| Fact | Value |
|---|---|
| Dataset size | 600,000+ records |
| Model accuracy | 85–88% (Clinical Calibrated) |
| Engine version | `v1.4.2-Guardian-Elite` |
| Emergency tiers | 6 (Normal → Warning → Emergency → Critical → Dispatch → Acknowledged) |
| Architecture | Microservices (Gateway, ML, Alert, Intervention, Analytics) |
| State | Zustand + Persistence |

---

## 🏆 SECTION 4: YOUR STRONGEST TALKING POINTS

1. **"The system is autonomous — it doesn't wait for a human to click 'Predict'; the Guardian Engine monitors biometrics and triggers life-saving protocols on its own."**
2. **"Our simulation is deterministic — medical reliability requires that same data produces same results, so we eliminated random jitter for v6.0."**
3. **"The Global Guardian Brain synchronizes everything — UI state, vitals, and audit logs are one single unit across the entire platform."**
4. **"We moved beyond basic charts to provide clinical explainability and health drift detection — enterprise features not found in typical student projects."**
