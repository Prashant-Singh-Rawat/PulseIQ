import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Phone, MapPin, Navigation, X, Siren, Radio, CheckCircle2 } from 'lucide-react';
import useHealthStore from '../store/healthStore';

const STAGE_LABELS = {
    WARNING:          'GUARDIAN_ALERT_ACTIVE',
    EMERGENCY:        'EMERGENCY_SENTINEL_ACTIVATED',
    CRITICAL:         'CRITICAL_RISK_BREACH',
    DISPATCH_INITIATED: 'DISPATCH_BROADCAST_ACTIVE',
};

const EmergencySystem = () => {
    // Selectors
    const risk = useHealthStore(state => state.risk);
    const emergencyState = useHealthStore(state => state.emergencyState);
    const setEmergencyState = useHealthStore(state => state.setEmergencyState);
    const resetToSafety = useHealthStore(state => state.resetToSafety);
    const isAnomalyDetected = useHealthStore(state => state.isAnomalyDetected);
    const isStabilizing = useHealthStore(state => state.isStabilizing);
    const hospitalAcknowledged = useHealthStore(state => state.hospitalAcknowledged);
    const acknowledgeEmergency = useHealthStore(state => state.acknowledgeEmergency);

    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let t;
        if (emergencyState === 'EMERGENCY' || emergencyState === 'CRITICAL') {
            t = setTimeout(() => setEmergencyState('DISPATCH_INITIATED'), 6000);
        }
        return () => clearTimeout(t);
    }, [emergencyState, setEmergencyState]);

    useEffect(() => {
        let interval;
        if (emergencyState === 'DISPATCH_INITIATED' && countdown > 0) {
            interval = setInterval(() => setCountdown(p => p - 1), 1000);
        }
        if (countdown === 0 && !hospitalAcknowledged && emergencyState === 'DISPATCH_INITIATED') {
            acknowledgeEmergency();
        }
        return () => clearInterval(interval);
    }, [emergencyState, countdown, hospitalAcknowledged, acknowledgeEmergency]);

    const isModalActive = ['EMERGENCY', 'CRITICAL', 'DISPATCH_INITIATED'].includes(emergencyState);

    return (
        <>
            {/* SYSTEM STABILIZING */}
            <AnimatePresence>
                {isStabilizing && (
                    <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}
                        className="fixed top-0 left-0 right-0 z-[10002] bg-healthCyan text-black px-6 py-4 flex items-center justify-between font-black uppercase tracking-[0.3em] text-[11px] shadow-xl">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-black animate-ping mr-4" />
                            System Stabilizing… Guardian Sentinel Recalibrating Baseline Vitals
                        </div>
                        <span className="text-[10px] font-black">RECOVERY_ACTIVE</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ANOMALY BANNER */}
            <AnimatePresence>
                {isAnomalyDetected && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-[10001] bg-red-600 text-white px-8 py-4 rounded-3xl flex items-center shadow-[0_0_50px_rgba(255,51,102,0.5)] border-2 border-white/20 font-black uppercase tracking-[0.2em] italic">
                        <AlertTriangle size={22} className="mr-4 animate-bounce" />
                        Anomaly_Detected: Sudden Risk Instability Detected!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* WARNING BANNER */}
            <AnimatePresence>
                {emergencyState === 'WARNING' && (
                    <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}
                        className="fixed top-0 left-0 right-0 z-[10000] bg-orange-500 text-black px-6 py-4 flex items-center justify-between font-black uppercase tracking-[0.3em] text-[11px] border-b-2 border-black/10 shadow-xl">
                        <div className="flex items-center">
                            <Siren size={18} className="mr-4 animate-pulse" />
                            Guardian Alert: Cardiovascular Trend Anomaly ({risk}%) — Sentinel Monitoring Active
                        </div>
                        <div className="flex items-center gap-6">
                            <span>Mode: EMERGENCY</span>
                            <div className="w-2 h-2 rounded-full bg-black animate-ping" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PRELOADED EMERGENCY / CRITICAL / DISPATCH MODAL (Optimized) */}
            <div 
                className={`fixed inset-0 z-[11000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl transition-opacity duration-300 ${isModalActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <div 
                    style={{ transform: isModalActive ? 'scale(1)' : 'scale(0.85)' }}
                    className={`transition-all duration-500 w-full max-w-2xl bg-[#0a0a0c] border-2 rounded-[50px] p-12 relative overflow-hidden ${emergencyState === 'CRITICAL' || emergencyState === 'DISPATCH_INITIATED' ? 'border-red-600 shadow-[0_0_150px_rgba(255,51,102,0.6)]' : 'border-white/10'}`}
                >
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-red-900/20" />

                    <button onClick={resetToSafety}
                        className="absolute top-10 right-10 text-gray-700 hover:text-white transition-all z-20">
                        <X size={28} />
                    </button>

                    <div className="relative z-10 text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-600/20 mb-10 border-2 border-red-600 animate-pulse">
                            {emergencyState === 'DISPATCH_INITIATED' ? <Radio size={48} className="text-red-500" /> : <ShieldAlert size={48} className="text-red-500" />}
                        </div>

                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic leading-none">
                            {STAGE_LABELS[emergencyState] || 'EMERGENCY_SYSTEM'}
                        </h1>
                        <p className="text-red-500 font-bold tracking-[0.5em] uppercase text-xs mb-12">Priocardix Guardian Elite Protocol</p>

                        {emergencyState === 'DISPATCH_INITIATED' && hospitalAcknowledged ? (
                            /* 6. EMERGENCY CONFIRMED */
                            <div className="mb-12 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                                    <CheckCircle2 size={40} className="text-green-400" />
                                </div>
                                <div className="glass-panel p-6 border-green-500/20 bg-green-500/5 w-full">
                                    <p className="text-sm font-black text-green-400 uppercase tracking-widest mb-2">✓ Emergency Acknowledged by Hospital</p>
                                    <p className="text-[11px] text-gray-400 font-medium italic">
                                        AIIMS Heart Specialty has accepted the dispatch and is preparing Cardiac Bay A for immediate intervention.
                                    </p>
                                </div>
                            </div>
                        ) : emergencyState === 'DISPATCH_INITIATED' ? (
                            <div className="space-y-6 mb-12">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="text-7xl font-black text-white font-mono">{countdown}s</div>
                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                                        Establishing Satellite Uplink with First Responders…
                                    </p>
                                </div>
                                <div className="glass-panel p-6 border-healthCyan/20 bg-healthCyan/5">
                                    <p className="text-sm font-bold text-white italic">
                                        "Guardian Sentinel has broadcasted your location to AIIMS Heart Specialty Dispatch Unit."
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
                                <div className="glass-panel p-7 border-white/5 bg-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <MapPin size={18} className="text-red-500" />
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Medical Hub Node</span>
                                    </div>
                                    <p className="text-xl font-black text-white uppercase italic">AIIMS Heart Specialty</p>
                                    <p className="text-[10px] text-gray-500 font-bold mt-2 uppercase">Active Sentinel Dispatch Available</p>
                                </div>
                                <div className="glass-panel p-7 border-white/5 bg-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Navigation size={18} className="text-red-500" />
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sentinel Navigation</span>
                                    </div>
                                    <p className="text-xl font-black text-white uppercase italic">2.8 KM | 4 MINS</p>
                                    <p className="text-[10px] text-red-500 font-bold mt-2 uppercase animate-pulse">Priority Lane Approved</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <a href="tel:9523537410"
                                className="block w-full py-6 bg-red-600 text-white font-black uppercase text-sm tracking-widest rounded-3xl shadow-[0_20px_60px_rgba(255,51,102,0.4)] hover:scale-[1.02] active:scale-95 transition-all">
                                📞 Execute Dispatch Call
                            </a>
                            <button
                                className="w-full py-5 bg-white/5 text-gray-500 font-black uppercase text-[10px] tracking-widest rounded-3xl border border-white/10 hover:text-white hover:bg-white/10 transition-all">
                                Notify Caregiver Sentinel Node (WhatsApp)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CRITICAL FULL-SCREEN HUD - PRELOADED/CSS DRIVEN */}
            <div 
                className={`fixed inset-0 pointer-events-none z-[12000] overflow-hidden transition-opacity duration-300 ${emergencyState === 'CRITICAL' ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="absolute inset-0 border-[30px] border-red-600/20" />
                <div className="absolute top-0 w-full h-1.5 bg-red-600 shadow-[0_0_20px_red]" />
            </div>
        </>
    );
};

export default React.memo(EmergencySystem);
