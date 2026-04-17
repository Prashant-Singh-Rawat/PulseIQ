import { useEffect, useRef } from 'react';
import useHealthStore from '../store/healthStore';

const useGuardianEngine = () => {
    const {
        setVitals, setSystemStatus, resetToSafety, setComputationTime, setAiThinking,
        bpm, bp, stress, sleep,
        age, weight, height, simulationSpeed,
    } = useHealthStore();

    const intervalRef = useRef(null);

    const calculateRisk = (vitals) => {
        const { bp, stress, sleep, bpm } = vitals;
        const bpFactor     = (bp - 80) / 100;
        const hrFactor     = (bpm - 40) / 140;
        const stressFactor = stress / 10;
        const sleepFactor  = (100 - sleep) / 100;
        const agePenalty   = Math.max(0, (age - 30) / 70);
        const bmi          = weight / Math.pow(height / 100, 2);
        const bmiPenalty   = Math.max(0, (bmi - 22) / 15);
        const risk         = (0.25 * bpFactor + 0.25 * hrFactor + 0.15 * stressFactor + 0.15 * sleepFactor + 0.10 * agePenalty + 0.10 * bmiPenalty) * 100;
        return Math.min(100, Math.max(0, Math.round(risk)));
    };

    useEffect(() => {
        const delay = Math.round(3000 / simulationSpeed);

        intervalRef.current = setInterval(() => {
            // 8. AI THINKING STATE
            setAiThinking(true);
            setSystemStatus('Analyzing physiological signals…');

            const t0 = performance.now();
            try {
                const drift     = (Math.random() - 0.5) * 2;
                const nextBpm   = Math.min(180, Math.max(40,  Math.round(bpm  + drift)));
                const nextBp    = Math.min(180, Math.max(80,  Math.round(bp   + drift)));
                const nextStress= Math.min(10,  Math.max(0,   Math.round(stress + (Math.random() - 0.5))));
                const nextSleep = sleep;

                const nextVitals = {
                    bpm:        nextBpm,
                    bp:         nextBp,
                    stress:     nextStress,
                    sleep:      nextSleep,
                    risk:       calculateRisk({ bp: nextBp, stress: nextStress, sleep: nextSleep, bpm: nextBpm }),
                    confidence: Math.floor(95 + Math.random() * 5),
                    stability:  Math.floor(90 + (10 - nextStress)),
                    dataSource: 'SIMULATED',
                };

                setVitals(nextVitals);

                const elapsed = Math.round(performance.now() - t0);
                setComputationTime(elapsed);

                // 7. PERFORMANCE STATUS LEVEL
                let statusMsg;
                if (elapsed < 5)       statusMsg = 'Guardian Engine Active · Optimal';
                else if (elapsed < 20) statusMsg = 'Guardian Engine Active · Normal';
                else                   statusMsg = 'Guardian Engine Active · Delayed';

                if (nextVitals.risk > 85)      statusMsg = 'CRITICAL_ANOMALY_DETECTED';
                else if (nextVitals.risk > 70)  statusMsg = 'RISK_TREND_INCREASING';

                setSystemStatus(statusMsg);

            } catch (err) {
                console.error('GUARDIAN_FATAL_ERROR:', err);
                resetToSafety();
                setSystemStatus('FAIL_SAFE_RECOVERY_ACTIVE');
            } finally {
                // Clear AI thinking state after a short delay
                setTimeout(() => setAiThinking(false), 600);
            }
        }, delay);

        return () => clearInterval(intervalRef.current);
    }, [bpm, bp, stress, sleep, age, weight, height, simulationSpeed,
        setVitals, setSystemStatus, resetToSafety, setComputationTime, setAiThinking]);

    return null;
};

export default useGuardianEngine;
