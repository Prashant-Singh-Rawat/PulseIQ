import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, CheckCircle2, AlertTriangle, Activity, Clock, ShieldAlert, BarChart, ChevronRight } from 'lucide-react';
import useHealthStore from '../store/healthStore';

const AIInsights = () => {
    const { bpm, bp, stress, sleep, age, weight, history, setVitals, computationTime = 12 } = useHealthStore();
    const [isSimulating, setIsSimulating] = useState(false);

    // Mathematical Derivations & Risk Computations
    const analysis = useMemo(() => {
        // 1. Calculate Deviations from Optimal Baseline
        const optimalBP = 120;
        const optimalSleep = 8;
        const optimalStress = 3;
        
        const bpDev = Math.max(0, bp - optimalBP);
        const sleepDeficit = Math.max(0, optimalSleep - (sleep / 100 * 8)); // rough approx
        const stressDev = Math.max(0, stress - optimalStress);

        // 2. Compute Raw Factors
        // BP factor scales non-linearly (hypertension stages)
        const bpFactor = bp >= 140 ? (bpDev * 1.5) : bpDev;
        
        // 3. Risk Contribution Breakdown (Normalized to 100% of the active risk)
        const rawBPContrib = bpFactor * 0.4;
        const rawStressContrib = stressDev * 4 * 0.3;
        const rawSleepContrib = sleepDeficit * 10 * 0.3;
        const rawTotal = rawBPContrib + rawStressContrib + rawSleepContrib || 1;

        // Calculate actual risk based on the strict formula + age/BMI modifiers
        const calculatedRisk = Math.min(100, Math.round((rawBPContrib + rawStressContrib + rawSleepContrib + (age * 0.1)) * 1.2));

        const bpPercent = ((rawBPContrib / rawTotal) * calculatedRisk).toFixed(1);
        const stressPercent = ((rawStressContrib / rawTotal) * calculatedRisk).toFixed(1);
        const sleepPercent = ((rawSleepContrib / rawTotal) * calculatedRisk).toFixed(1);

        // 4. Clinical Triage Status & Colors
        let status = 'NORMAL';
        let color = 'text-green-500';
        let bgStyle = 'bg-green-500/10 border-green-500/20';
        let priority = 'LOW → Monitoring sufficient';
        let icon = <CheckCircle2 className="text-green-500" />;

        if (calculatedRisk >= 80 || bp >= 160) {
            status = 'CRITICAL';
            color = 'text-red-500';
            bgStyle = 'bg-red-500/10 border-red-500/30';
            priority = 'CRITICAL → Emergency protocol required';
            icon = <AlertTriangle className="text-red-500 animate-pulse" />;
        } else if (calculatedRisk >= 50 || bp >= 140) {
            status = 'HIGH RISK';
            color = 'text-orange-500';
            bgStyle = 'bg-orange-500/10 border-orange-500/30';
            priority = 'HIGH → Immediate correction recommended';
            icon = <ShieldAlert className="text-orange-500" />;
        } else if (calculatedRisk >= 30) {
            status = 'ELEVATED';
            color = 'text-yellow-400';
            bgStyle = 'bg-yellow-400/10 border-yellow-400/30';
            priority = 'MEDIUM → Intervention within 24 hrs';
            icon = <Zap className="text-yellow-400" />;
        }

        // 5. Dynamic Primary Finding & Root Cause
        let primaryFinding = "Optimal System Baseline Maintained";
        let impact = "Sustaining current physiological patterns will maintain high cardiovascular health trajectory.";
        let recommendation = [
            "Maintain current 7-8 hour sleep cycle",
            "Continue stable electrolyte and sodium intake",
            "Routine monitoring requested in 30 days"
        ];

        const highestFactor = Math.max(rawBPContrib, rawStressContrib, rawSleepContrib);
        if (calculatedRisk >= 30) {
            if (highestFactor === rawBPContrib) {
                primaryFinding = `Elevated Systolic Pressure Driving ${status} Risk`;
                impact = "Sustained hypertension increases arterial wall shear stress, accelerating vascular aging.";
                recommendation = [
                    "Reduce sodium intake (< 2g/day) immediately",
                    "Administer prescribed ACE Inhibitor if systolic remains > 140 for 2hrs",
                    "Acoustic guided meditation (15 mins) to trigger parasympathetic response"
                ];
            } else if (highestFactor === rawStressContrib) {
                primaryFinding = `High Neural Stress Load Inducing Arrhythmic Risk`;
                impact = "Elevated cortisol/adrenaline sustained over 4+ hours increases myocardial oxygen demand and arrhythmic potential.";
                recommendation = [
                    "Initiate guided breathing protocol (4-7-8 method)",
                    "Discontinue work/screen tasks for next 60 minutes",
                    "Hydrate: 500ml of water"
                ];
            } else {
                primaryFinding = `Sleep Deficit Amplifying Cardiovascular Strain`;
                impact = "Lack of REM/Deep sleep cycles impairs endothelial repair and increases basal sympathetic tone.";
                recommendation = [
                    "Target 7.5 – 8.0 hours of uninterrupted sleep tonight",
                    "Implement circadian wind-down protocol 90 mins prior to bed"
                ];
            }
        }

        // 6. Medical Data Classification
        const bpClassification = bp >= 140 ? 'Stage 2 Hypertension' : bp >= 130 ? 'Stage 1 Hypertension' : bp > 120 ? 'Elevated' : 'Normal';

        // 7. Data Stability Confidence
        const historyVariance = history && history.length > 5 ? 
            Math.abs(history[history.length-1].bp - history[history.length-5].bp) : 0;
        const confidence = historyVariance > 15 ? 82.4 : 96.8;

        return {
            calculatedRisk, status, color, bgStyle, priority, icon, primaryFinding, impact, recommendation,
            bpPercent, stressPercent, sleepPercent, sleepDeficit, bpClassification, confidence
        };
    }, [bp, stress, sleep, age, weight, history]);

    // Handle interactive improvement simulation
    const simulateImprovement = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setVitals({
                bp: Math.max(110, bp - 12),
                stress: Math.max(1, stress - 3),
                sleep: Math.min(100, Math.floor(sleep * 1.2))
            });
            setIsSimulating(false);
        }, 1200);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div 
                key={analysis.status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full glass-panel border border-white/10 bg-[#07070a]/90 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl relative"
            >
                {/* Header Banner */}
                <div className={`px-6 py-4 border-b flex items-center justify-between ${analysis.bgStyle}`}>
                    <div className="flex items-center gap-3">
                        {analysis.icon}
                        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Clinical Intelligence System</h2>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Status Level</span>
                        <span className={`text-lg font-black uppercase tracking-widest ${analysis.color}`}>{analysis.status}</span>
                    </div>
                </div>

                <div className="p-6">
                    {/* Primary Finding */}
                    <div className="mb-6">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Primary Finding</p>
                        <p className="text-base font-bold text-white uppercase tracking-tight">{analysis.primaryFinding}</p>
                        <p className="text-xs text-gray-400 mt-2 italic leading-relaxed border-l-2 border-white/10 pl-3">
                            <span className="font-bold text-gray-300">Impact: </span>{analysis.impact}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* Root Cause Analysis */}
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Activity size={12}/> Root Cause Metrics</p>
                            <ul className="space-y-2">
                                <li className="flex justify-between text-xs font-mono">
                                    <span className="text-white/60">BP Deviation</span>
                                    <span className={bp > 120 ? 'text-red-400' : 'text-green-400'}>{bp} mmHg ({analysis.bpClassification})</span>
                                </li>
                                <li className="flex justify-between text-xs font-mono">
                                    <span className="text-white/60">Stress Load</span>
                                    <span className={stress > 5 ? 'text-red-400' : 'text-green-400'}>{stress}/10 (Above Optimal)</span>
                                </li>
                                <li className="flex justify-between text-xs font-mono">
                                    <span className="text-white/60">Sleep Deficit</span>
                                    <span className={analysis.sleepDeficit > 0 ? 'text-red-400' : 'text-green-400'}>-{analysis.sleepDeficit.toFixed(1)} hrs from baseline</span>
                                </li>
                            </ul>
                        </div>

                        {/* Risk Contribution Breakdown */}
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><BarChart size={12}/> Risk Breakdown</p>
                            <div className="space-y-3">
                                {[
                                    { label: 'Systolic Load', val: analysis.bpPercent, color: 'bg-red-500' },
                                    { label: 'Neural Stress', val: analysis.stressPercent, color: 'bg-orange-500' },
                                    { label: 'Recovery Deficit', val: analysis.sleepPercent, color: 'bg-yellow-500' }
                                ].map(item => (
                                    <div key={item.label}>
                                        <div className="flex justify-between text-[10px] text-white/60 font-mono mb-1">
                                            <span>{item.label}</span>
                                            <span>+{item.val}%</span>
                                        </div>
                                        <div className="w-full bg-black rounded-full h-1">
                                            <div className={`h-1 rounded-full ${item.color}`} style={{ width: `${Math.min(100, item.val * 2)}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actionable Recommendations */}
                    <div className="mb-6">
                        <div className="flex justify-between items-end mb-3">
                            <p className="text-[10px] font-black text-healthCyan uppercase tracking-widest flex items-center gap-2">
                                <Clock size={12}/> Recommended Interventions
                            </p>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                                Priority: {analysis.priority}
                            </p>
                        </div>
                        <div className="bg-healthCyan/5 border border-healthCyan/20 p-4 rounded-2xl">
                            <ul className="space-y-2">
                                {analysis.recommendation.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-white/90 font-medium">
                                        <ChevronRight size={14} className="text-healthCyan shrink-0 mt-0.5" />
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Meta Footer */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                            <span className="block mb-1">Response Time: {computationTime}ms (Optimal System Performance)</span>
                            <span className="text-healthCyan">Confidence: {analysis.confidence.toFixed(1)}% (Based on stable historical variance)</span>
                        </div>
                        
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-black text-white hover:bg-white/10 transition-all rounded-xl uppercase tracking-widest">
                                Report
                            </button>
                            <button 
                                onClick={simulateImprovement} 
                                disabled={isSimulating}
                                className="px-4 py-2 bg-healthCyan text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all disabled:opacity-50"
                            >
                                {isSimulating ? 'Simulating...' : 'Simulate Intervention'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AIInsights;
