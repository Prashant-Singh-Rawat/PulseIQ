import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// MULTI-PATIENT PROFILES
const PATIENT_PROFILES = {
    athlete: { name: 'Madhav (Athlete)', age: 26, weight: 68, height: 178, bpm: 52, bp: 105, stress: 2, sleep: 90 },
    average: { name: 'Default Patient', age: 45, weight: 75, height: 175, bpm: 72, bp: 120, stress: 3, sleep: 80 },
    elderly:  { name: 'Senior Risk Profile', age: 70, weight: 82, height: 168, bpm: 84, bp: 155, stress: 6, sleep: 60 },
};

const DEFAULT_STATE = {
    // SYSTEM METADATA
    modelVersion:       'v1.4.2-Guardian-Elite',
    dataSource:         'SIMULATED',
    computationTime:    0,
    simulationSpeed:    1,
    activePatient:      'average',
    activeNodes:        5,
    highRiskRegions:    2,
    isAiThinking:       false,

    // EXPLAINABILITY
    explainabilityScore: 72,

    // PERSONALIZATION
    age: 45, weight: 75, height: 175, gender: 'Male', medicalHistory: [],

    // VITALS
    bpm: 72, bp: 120, stress: 3, sleep: 80, risk: 15, healthScore: 85,

    // ELITE METRICS
    confidence: 98, stability: 94, cardiacLoad: 'LOW',
    isAnomalyDetected: false, isStabilizing: false, isDriftDetected: false,

    // SYSTEM STATE
    history: [],
    auditLogs: [],
    lastUpdated:    new Date().toISOString(),
    emergencyState: 'NORMAL',
    systemMode:     'MONITORING',   // MONITORING | EMERGENCY | RECOVERY
    systemStatus:   'Guardian Engine Active',
    isDoctorMode:   false,
    hospitalAcknowledged: false,
    isMainSidebarCollapsed: false,
};

const useHealthStore = create(
    persist(
        (set, get) => ({
            ...DEFAULT_STATE,
            patientProfiles: PATIENT_PROFILES,

            // ─── AUDIT ─────────────────────────────────────────────────────────
            _log: (event, detail = '') => {
                const entry = {
                    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    event,
                    detail,
                    timestamp: new Date().toISOString(),
                };
                set(s => {
                    const newLogs = [entry, ...s.auditLogs].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
                    return { auditLogs: newLogs.slice(0, 100) };
                });
            },

            // ─── VITALS UPDATE ─────────────────────────────────────────────────
            setVitals: (vitals) => {
                const state  = get();
                const { risk } = vitals;

                // Emergency state
                let emergencyState = 'NORMAL';
                let systemMode     = 'MONITORING';
                let isStabilizing  = false;
                let hospitalAcknowledged = state.hospitalAcknowledged;

                if (state.emergencyState !== 'DISPATCH_INITIATED') {
                    if (risk > 95)      { emergencyState = 'CRITICAL';   systemMode = 'EMERGENCY'; }
                    else if (risk > 85) { emergencyState = 'EMERGENCY';  systemMode = 'EMERGENCY'; }
                    else if (risk > 70) { emergencyState = 'WARNING';    systemMode = 'EMERGENCY'; }
                    else if (state.emergencyState !== 'NORMAL') {
                        isStabilizing = true;
                        systemMode    = 'RECOVERY';
                        hospitalAcknowledged = false;
                    }
                } else if (risk < 60) {
                    emergencyState = 'NORMAL';
                    isStabilizing  = true;
                    systemMode     = 'RECOVERY';
                    hospitalAcknowledged = false;
                } else {
                    emergencyState = 'DISPATCH_INITIATED';
                    systemMode     = 'EMERGENCY';
                }

                // Anomaly detection
                const isAnomalyDetected = Math.abs(risk - state.risk) > 25;

                // Cardiac load
                let cardiacLoad = 'LOW';
                if (risk > 75)      cardiacLoad = 'HIGH';
                else if (risk > 45) cardiacLoad = 'MEDIUM';

                // Health drift (compare last 5 vs previous 5)
                const hist = state.history;
                let isDriftDetected = state.isDriftDetected;
                if (hist.length >= 10) {
                    const recent = hist.slice(0, 5).reduce((a, b) => a + b.risk, 0) / 5;
                    const older  = hist.slice(5, 10).reduce((a, b) => a + b.risk, 0) / 5;
                    isDriftDetected = recent - older > 5;
                }

                // Explainability (count strong factors)
                let factors = 0;
                const bp    = vitals.bp    ?? state.bp;
                const stress= vitals.stress ?? state.stress;
                const sleep = vitals.sleep  ?? state.sleep;
                if (bp     > 140) factors++;
                if (stress > 6)   factors++;
                if (sleep  < 60)  factors++;
                if (state.age > 55) factors++;
                const explainabilityScore = Math.min(100, 40 + factors * 20);

                // High-risk regions (from hotspots risk)
                const highRiskRegions = risk > 70 ? 3 : risk > 50 ? 2 : 1;

                const healthScore = Math.max(0, 100 - risk);

                const newHistEntry = { ...vitals, timestamp: new Date().toISOString() };

                set(s => ({
                    ...s,
                    ...vitals,
                    healthScore,
                    emergencyState,
                    systemMode,
                    isAnomalyDetected,
                    isStabilizing,
                    isDriftDetected,
                    cardiacLoad,
                    explainabilityScore,
                    highRiskRegions,
                    hospitalAcknowledged,
                    lastUpdated: new Date().toISOString(),
                    history: [newHistEntry, ...s.history].slice(0, 50),
                }));

                // Audit events
                if (isAnomalyDetected)        get()._log('ANOMALY_DETECTED',      `Risk spike: ${state.risk}% → ${risk}%`);
                if (emergencyState !== state.emergencyState) get()._log('EMERGENCY_STATE',  emergencyState);
                if (isDriftDetected && !state.isDriftDetected) get()._log('HEALTH_DRIFT',   'Worsening trend detected');

                if (isStabilizing) setTimeout(() => set({ isStabilizing: false }), 4000);
            },

            setAiThinking: (val) => set({ isAiThinking: val }),

            acknowledgeEmergency: () => {
                set({ hospitalAcknowledged: true });
                get()._log('HOSPITAL_ACKNOWLEDGED', 'AIIMS Heart Specialty accepted dispatch');
            },

            loadPatient: (key) => {
                const profile = PATIENT_PROFILES[key];
                if (!profile) return;
                get()._log('PATIENT_SWITCH', `Loaded profile: ${profile.name}`);
                set({
                    activePatient: key,
                    age:    profile.age,
                    weight: profile.weight,
                    height: profile.height,
                    bpm:    profile.bpm,
                    bp:     profile.bp,
                    stress: profile.stress,
                    sleep:  profile.sleep,
                    dataSource: 'USER_INPUT',
                    history: [],
                });
            },

            setComputationTime: (ms) => set({ computationTime: ms }),
            setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
            setDataSource:      (src)   => set({ dataSource:   src  }),
            updateProfile:      (data)  => set(s => ({ ...s, ...data })),
            setEmergencyState:  (ns)    => set({ emergencyState: ns }),
            toggleDoctorMode:   ()      => set(s => ({ isDoctorMode: !s.isDoctorMode })),
            toggleMainSidebar:  ()      => set(s => ({ isMainSidebarCollapsed: !s.isMainSidebarCollapsed })),
            setSystemStatus:    (status)=> set({ systemStatus: status }),

            resetSimulation: () => {
                set({ ...DEFAULT_STATE, patientProfiles: PATIENT_PROFILES, auditLogs: [] });
                get()._log('SYSTEM_RESET', 'All vitals and event logs purged to baseline');
            },

            resetToSafety: () => {
                get()._log('FAIL_SAFE', 'Guardian fail-safe triggered — resetting to baseline');
                set({
                    bpm: 72, bp: 120, stress: 3, risk: 15,
                    healthScore: 85, isAnomalyDetected: false,
                    emergencyState: 'NORMAL', systemMode: 'MONITORING',
                    isStabilizing: false, systemStatus: 'FAIL_SAFE_RECOVERY_ACTIVE',
                });
            },
        }),
        { name: 'priocardix-guardian-elite-v4' }
    )
);

export { PATIENT_PROFILES };
export default useHealthStore;
