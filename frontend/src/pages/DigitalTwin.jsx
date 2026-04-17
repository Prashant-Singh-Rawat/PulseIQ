import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DigitalTwinCanvas from '../components/DigitalTwinCanvas';
import useHealthStore, { PATIENT_PROFILES } from '../store/healthStore';
import useAuthStore from '../store/authStore';
import {
    Activity, Zap, Phone, Brain, ShieldAlert,
    Timer, TrendingUp, BarChart3, FileText,
    User, ChevronDown, Gauge, Globe, Heart, Stethoscope
} from 'lucide-react';
import ECGWaveform from '../components/ECGWaveform';
import AIInsights from '../components/AIInsights';
import RiskTrends from '../components/RiskTrends';
import CardiacReportModal from '../components/CardiacReportModal';
import FinalSummaryPanel from '../components/FinalSummaryPanel';

// ─── GLOBAL POPULATION HUB (4TH SCREEN) ──────────────────────────────────
const GlobalPopulationHub = () => {
    const nodes = [
        { city: 'New Delhi', status: 'High Risk', top: '45%', left: '70%', color: 'border-red-500 bg-red-500' },
        { city: 'Mumbai', status: 'Elevated', top: '52%', left: '68%', color: 'border-orange-500 bg-orange-500/80' },
        { city: 'New York', status: 'Moderate', top: '35%', left: '22%', color: 'border-yellow-400 bg-yellow-400/80' },
        { city: 'London', status: 'Stable', top: '28%', left: '48%', color: 'border-healthCyan bg-healthCyan/50' },
        { city: 'Tokyo', status: 'Stable', top: '40%', left: '85%', color: 'border-healthCyan bg-healthCyan/50' },
        { city: 'Berlin', status: 'Low Risk', top: '30%', left: '52%', color: 'border-gray-400 bg-gray-500/50' },
        { city: 'Dubai', status: 'Elevated', top: '50%', left: '60%', color: 'border-orange-500 bg-orange-500/80' },
        { city: 'Singapore', status: 'Stable', top: '65%', left: '78%', color: 'border-healthCyan bg-healthCyan/50' },
        { city: 'Sydney', status: 'Low Risk', top: '80%', left: '88%', color: 'border-gray-400 bg-gray-500/50' },
        { city: 'Toronto', status: 'Moderate', top: '32%', left: '26%', color: 'border-yellow-400 bg-yellow-400/80' }
    ];

    return (
        <div className="w-full h-full flex gap-6">
            {/* Main Map Portal */}
            <div className="flex-1 glass-panel border-white/5 bg-[#030303] rounded-[40px] p-8 overflow-hidden relative shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] flex flex-col">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Global Sentinel Network</h2>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">10 Active Global Nodes | Earth Monitoring</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-healthCyan uppercase tracking-widest mb-1">Network Strength</p>
                        <p className="text-2xl font-black font-mono text-white">99.8%</p>
                    </div>
                </div>
                
                <div className="flex-1 relative mt-10">
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-contain bg-no-repeat bg-center opacity-20 filter invert" />
                    
                    {/* High-tech scanner overlay */}
                    <motion.div 
                        animate={{ y: ['0%', '100%', '0%'] }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-healthCyan to-transparent opacity-50 z-20"
                    />

                    <div className="absolute inset-0">
                        {nodes.map((node, i) => {
                            const riskPercent = node.status === 'High Risk' ? '82%' : node.status === 'Elevated' ? '67%' : node.status === 'Moderate' ? '45%' : '12%';
                            return (
                            <motion.div 
                                key={node.city}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="absolute flex flex-col items-center justify-center -ml-4 -mt-4 cursor-pointer group"
                                style={{ top: node.top, left: node.left }}
                            >
                                <div className="relative">
                                    <div className={`w-4 h-4 rounded-full border-2 ${node.color} z-10 relative shadow-[0_0_15px_currentColor]`} />
                                    {(node.status === 'High Risk' || node.status === 'Elevated') && (
                                        <div className={`absolute inset-0 rounded-full border-2 ${node.color} animate-ping opacity-60`} />
                                    )}
                                </div>
                                {/* Upgraded Tooltips */}
                                <div className="absolute top-6 bg-[#0a0a0c]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 transform group-hover:-translate-y-2 shadow-2xl">
                                    <p className="text-[11px] font-black text-white uppercase tracking-widest whitespace-nowrap">{node.city}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{node.status}</span>
                                        <span className={`text-[10px] font-black font-mono ${node.status === 'Stable' || node.status === 'Low Risk' ? 'text-healthCyan' : 'text-red-400'}`}>{riskPercent}</span>
                                    </div>
                                </div>
                            </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="absolute bottom-8 left-8 glass-panel bg-black/60 border-white/5 p-4 rounded-2xl flex items-center gap-3 z-10">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Live Syncing | Neural Stream Active</p>
                </div>
            </div>

            {/* Sidebar Region Intel */}
            <div className="w-80 glass-panel border-white/5 bg-[#060608]/90 backdrop-blur-xl rounded-[40px] p-8 flex flex-col gap-6 shrink-0 z-10">
                <div className="border-b border-white/10 pb-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mt-2">Cardiac Heatmap</h3>
                    <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-1">Priority Attention Required</p>
                </div>

                <div className="flex flex-col gap-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {nodes.filter(n => n.status === 'High Risk' || n.status === 'Elevated' || n.status === 'Moderate').map((node, i) => {
                         const riskPercent = node.status === 'High Risk' ? '82%' : node.status === 'Elevated' ? '67%' : '45%';
                         return (
                            <div key={node.city} className="bg-white/5 border border-white/5 p-4 rounded-2xl group hover:border-white/20 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <p className="text-xs font-black text-white uppercase tracking-widest">{node.city}</p>
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-md ${node.status === 'High Risk' ? 'bg-red-500/20 text-red-400' : node.status === 'Elevated' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {riskPercent}
                                    </span>
                                </div>
                                <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                                     <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: riskPercent }}
                                        className={`h-full ${node.status === 'High Risk' ? 'bg-red-500' : node.status === 'Elevated' ? 'bg-orange-500' : 'bg-yellow-400'}`}
                                     />
                                </div>
                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-3">Status: {node.status}</p>
                            </div>
                         );
                    })}
                </div>
            </div>
        </div>
    );
};

// ─── EMERGENCY PROTOCOL TERMINAL ──────────────────────────────────────────
const EmergencyTerminal = ({ acknowledgeEmergency }) => {
    return (
        <div className="w-full h-full flex flex-col gap-8">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 glass-panel border-pulseRed/30 bg-[#080204]/90 backdrop-blur-3xl rounded-[40px] p-10 flex flex-col gap-8 relative overflow-hidden"
            >
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-pulseRed/10 rounded-full blur-[120px] -mr-48 -mt-48" />

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center gap-3 text-pulseRed animate-pulse mb-2">
                            <ShieldAlert size={28} />
                            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Emergency System</h2>
                        </div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.6em]">Priocardix Guardian Elite Protocol</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-pulseRed uppercase tracking-widest mb-1">Priority Lane Approved</p>
                        <p className="text-2xl font-black font-mono text-white">ETA: 4 MINS</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 relative z-10">
                    <div className="flex flex-col gap-6">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-4">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Medical Hub Node</p>
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-pulseRed/20 text-pulseRed">
                                    <Heart size={32} fill="currentColor" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase italic">AIIMS Heart Specialty</h3>
                                    <p className="text-xs text-healthCyan font-black uppercase tracking-widest mt-1">Active Sentinel Dispatch Available</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl bg-pulseRed/10 border border-pulseRed/20 flex flex-col gap-4">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sentinel Navigation</p>
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black text-white uppercase italic">2.8 KM DISTANCE</h3>
                                <div className="px-4 py-2 bg-pulseRed text-black text-[10px] font-black uppercase rounded-lg">LIVE_GPS_LOCK</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <button 
                            onClick={() => alert("📞 Routing direct encrypted call to Neural Cardiac Triage...")}
                            className="flex-1 bg-white text-black rounded-3xl flex flex-col items-center justify-center gap-4 group hover:bg-pulseRed hover:text-white transition-all transform hover:scale-[1.02]"
                        >
                            <Phone size={48} className="group-hover:animate-bounce" />
                            <span className="text-xl font-black uppercase tracking-widest italic">Execute Dispatch Call</span>
                        </button>
                        <button 
                            onClick={() => alert("📱 Secure WhatsApp bridge initiated. Caregiver Sentinel nodes notified.")}
                            className="py-6 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] rounded-3xl flex items-center justify-center gap-4 font-black uppercase text-sm tracking-[0.2em] hover:bg-[#25D366]/30 transition-all"
                        >
                            <Globe size={20} /> Notify Caregiver Sentinel Node (WhatsApp)
                        </button>
                    </div>
                </div>

                <button 
                    onClick={acknowledgeEmergency}
                    className="w-full py-6 bg-pulseRed text-black font-black uppercase text-xs tracking-[0.5em] rounded-2xl hover:brightness-110 shadow-[0_0_50px_rgba(255,51,102,0.3)] transition-all relative z-10 italic"
                >
                    Acknowledge and Clear Triage Lane
                </button>
            </motion.div>
        </div>
    );
};

const DigitalTwin = () => {
    const {
        bpm, bp, stress, sleep, risk, setVitals,
        isDoctorMode, history, systemStatus,
        age, weight, height, updateProfile, loadPatient, activePatient,
        confidence, stability, cardiacLoad,
        modelVersion, dataSource, computationTime,
        simulationSpeed, setSimulationSpeed,
        healthScore
    } = useHealthStore();
    const user = useAuthStore(state => state.user);

    const [mode, setMode] = useState('cardiac');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showReport, setShowReport] = useState(false);
    
    const { 
        isMainSidebarCollapsed, toggleMainSidebar 
    } = useHealthStore();

    // Auto-collapse on smaller screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1400 && !isMainSidebarCollapsed) toggleMainSidebar();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMainSidebarCollapsed, toggleMainSidebar]);

    // ─── REAL-TIME SIMULATION ENGINE ──────────────────────────────────────
    useEffect(() => {
        const timer = setInterval(() => {
            const baseRisk = 25;
            const bpFactor = Math.max(0, (bp - 120) * 0.5);
            const stressFactor = stress * 4;
            const sleepFactor = (100 - sleep) * 0.2;
            const simRisk = Math.min(99, Math.round(baseRisk + bpFactor + stressFactor + sleepFactor));
            
            // Deterministic Confidence based on complexity (less stress = more confidence)
            const simConfidence = 88 - (stress * 0.5) - (bp > 150 ? 2 : 0);
            const simStability = Math.max(0, 100 - (simRisk * 1.1));
            
            // Calculate BPM based on BP and Stress - NO RANDOM JITTER
            const baseBpm = 70;
            const bpBpmOffset = Math.max(0, (bp - 120) * 0.3);
            const stressBpmOffset = stress * 3.5;
            const simBpm = Math.round(baseBpm + bpBpmOffset + stressBpmOffset);

            // Sync simulation to store using valid setVitals method
            setVitals({ 
                risk: simRisk, 
                bpm: simBpm,
                confidence: Math.round(simConfidence), 
                stability: Math.round(simStability)
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [bp, stress, sleep, setVitals]);

    const speedOptions = [1, 2, 5];

    const playSwitchSound = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + 0.1);
        } catch (_) {}
    };

    const handleMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        setMousePos({ x: (clientX - left - width / 2) / 40, y: (clientY - top - height / 2) / 40 });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full w-full bg-[#030305] text-white flex gap-6 p-6 overflow-hidden relative font-sans">
            {showReport && <CardiacReportModal onClose={() => setShowReport(false)} />}
            
            {/* Ambient System Glows */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.02)_0%,transparent_60%)]" />
            
            {/* ─── LEFT SIDEBAR (CONTROL HUB - Always Visible) ─── */}
            <div className="w-[450px] flex flex-col gap-6 relative z-10 shrink-0 overflow-hidden pr-2">
                <div className="flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2 pb-20">
                    <div className="glass-panel p-6 border-white/5 bg-gradient-to-br from-white/5 to-transparent shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-2xl bg-darkBg border border-healthCyan/30 flex items-center justify-center text-healthCyan text-xl font-black shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                                    {user?.name?.[0]?.toUpperCase() || 'P'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black tracking-tighter text-white uppercase italic leading-none">{user?.name || 'Guardian Scientist'}</h3>
                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">{systemStatus}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Engine</p>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-healthCyan uppercase tracking-widest">{modelVersion}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-white/5 shrink-0">
                        <div className="flex items-center gap-3 mb-4">
                            <User size={16} className="text-healthCyan" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Simulation Subject</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {Object.entries(PATIENT_PROFILES).map(([key, profile]) => (
                                <button
                                    key={key}
                                    onClick={() => { loadPatient(key); playSwitchSound(); }}
                                    className={`py-3 px-2 rounded-2xl text-[9px] font-black uppercase tracking-tight transition-all border ${
                                        activePatient === key
                                            ? 'bg-healthCyan/20 border-healthCyan/50 text-healthCyan shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                                            : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'
                                    }`}
                                >
                                    {key === 'athlete' ? '🏃 Athlete' : key === 'elderly' ? '👴 Senior' : '👤 Patient'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-8 flex-1 border-white/5 relative overflow-hidden flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h3 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center">
                                <Activity size={18} className="mr-3 text-healthCyan" /> Bio Parameters
                            </h3>
                            <div className="flex gap-2">
                                {speedOptions.map(s => (
                                    <button key={s} onClick={() => setSimulationSpeed(s)} className={`px-2 py-1 rounded-md text-[8px] font-black border ${simulationSpeed === s ? 'bg-healthCyan/20 border-healthCyan text-healthCyan' : 'border-white/10 text-gray-500'}`}>{s}X</button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            {[
                                { label: 'Blood Pressure', field: 'bp', min: 80, max: 200, val: bp, unit: ' mmHg' },
                                { label: 'Neural Stress', field: 'stress', min: 0, max: 10, val: stress, unit: '/10' },
                                { label: 'Sleep Quality', field: 'sleep', min: 0, max: 100, val: sleep, unit: '%' }
                            ].map((ctl) => (
                                <div key={ctl.field}>
                                    <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
                                        <span>{ctl.label}</span>
                                        <span className={ctl.val > (ctl.max * 0.8) ? 'text-red-500 font-mono' : 'text-white font-mono'}>{ctl.val}{ctl.unit}</span>
                                    </div>
                                    <input type="range" min={ctl.min} max={ctl.max} value={ctl.val} 
                                        onChange={e => setVitals({ [ctl.field]: parseInt(e.target.value) })}
                                        className="w-full h-1 bg-white/10 rounded-full appearance-none accent-healthCyan cursor-pointer transition-all hover:accent-white"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto flex flex-col gap-4">
                            {risk > 70 && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3 text-red-500">
                                        <ShieldAlert size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Emergency Sentinel Pending</span>
                                    </div>
                                    <button className="px-3 py-1 bg-red-500 text-black text-[9px] font-black uppercase rounded-lg hover:bg-white transition-colors">
                                        Notify WhatsApp
                                    </button>
                                </motion.div>
                            )}
                            <div className="p-4 bg-healthCyan/5 border border-healthCyan/10 rounded-2xl">
                                 <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Current Computation</p>
                                 <p className="text-xs font-mono text-healthCyan">Syncing to neural_engine_{modelVersion}...</p>
                            </div>
                            <button onClick={() => setShowReport(true)} className="w-full py-4 bg-gradient-to-r from-healthCyan/20 to-transparent border border-healthCyan/30 text-healthCyan font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-healthCyan/30 transition-all">
                                Generate Diagnostic Summary
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── MAIN COMMAND CENTER (MODE-BASED WORKSPACE) ─── */}
            <div className="flex-1 glass-panel border-white/5 overflow-hidden flex flex-col relative shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
                


                <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {/* GLOBAL HUB OVERLAY */}
                        {mode === 'global' && (
                            <motion.div 
                                key="global"
                                initial={{ opacity: 0, scale: 1.05 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                exit={{ opacity: 0, scale: 0.95 }} 
                                className="absolute inset-0 z-40 bg-[#030305]"
                            >
                                <GlobalPopulationHub />
                            </motion.div>
                        )}

                        {/* ZONE 1: VITALS MODE */}
                        {mode === 'vitals' && (
                            <motion.div 
                                key="vitals"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                className="absolute inset-0 flex flex-col p-12 gap-8"
                            >
                                <div className="flex justify-between items-end border-b border-white/5 pb-8">
                                    <div>
                                        <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Live Telemetry</h2>
                                        <p className="text-[11px] font-black text-healthCyan uppercase tracking-[0.5em] mt-2">Active Bio-Link</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Neural BPM</p>
                                        <p className="text-7xl font-black font-mono text-white leading-none tracking-tighter">{bpm}</p>
                                    </div>
                                </div>
                                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0 pr-20 lg:pr-32 transition-all">
                                    <div className="relative bg-black/40 rounded-[40px] border border-white/10 overflow-hidden">
                                        <ECGWaveform bpm={bpm} color={risk > 80 ? '#ff3366' : '#00f0ff'} />
                                    </div>
                                    <div className="relative rounded-[40px] border border-white/10 overflow-hidden">
                                        <RiskTrends />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ZONE 2: CARDIAC MODE (Heart Simulation) */}
                        {mode === 'cardiac' && (
                            <motion.div 
                                key="cardiac"
                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }}
                                className="absolute inset-0 flex flex-col"
                            >
                                <div className="flex-1 w-full relative cursor-move" onMouseMove={handleMouseMove} onMouseLeave={() => setMousePos({ x: 0, y: 0 })}>
                                    <div className={`absolute inset-0 transition-colors duration-1000 ${risk > 80 ? "bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.2)_0%,transparent_70%)]" : "bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)]"}`} />
                                    <div className="absolute inset-0" style={{ transform: `perspective(1200px) rotateX(${mousePos.y}deg) rotateY(${-mousePos.x}deg)` }}>
                                        <DigitalTwinCanvas />
                                    </div>
                                </div>
                                <div className="p-10 border-t border-white/10 flex justify-between items-center bg-black/60 relative z-20 pr-28 lg:pr-36">
                                     <div className="flex gap-10">
                                         <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Simulated Cardiac Load</p>
                                            <div className="flex items-center gap-4">
                                                <p className={`text-4xl font-black uppercase ${risk > 80 ? 'text-red-500' : 'text-healthCyan'}`}>{cardiacLoad}</p>
                                                <div className={`h-2 w-32 bg-white/5 rounded-full overflow-hidden`}>
                                                    <motion.div animate={{ width: `${risk}%` }} className={`h-full ${risk > 80 ? 'bg-red-500' : 'bg-healthCyan'}`} />
                                                </div>
                                            </div>
                                         </div>
                                         <div className="border-l border-white/10 pl-10">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Simulation Accuracy</p>
                                            <p className="text-4xl font-black font-mono text-healthCyan">{confidence}%</p>
                                         </div>
                                     </div>
                                     <div className="text-right">
                                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Tissue Frequency</p>
                                         <p className="text-4xl font-black font-mono text-white">{bpm} <span className="text-sm">Hz</span></p>
                                     </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ZONE 3: AI ANALYTICS MODE */}
                        {mode === 'ai' && (
                            <motion.div 
                                key="ai"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col p-16 overflow-y-auto custom-scrollbar"
                            >
                                <div className="flex flex-col gap-16">
                                    <div className="grid grid-cols-2 gap-20">
                                        <div className="relative">
                                            <div className={`absolute -left-12 top-0 bottom-0 w-2 ${risk > 80 ? 'bg-red-500' : 'bg-healthCyan'}`} />
                                            <p className="text-[14px] font-black text-gray-500 uppercase tracking-[0.5em] mb-6">Simulation Risk Index</p>
                                            <p className={`text-[160px] font-black font-mono tracking-tighter leading-none ${risk > 80 ? 'text-red-500' : 'text-healthCyan'}`}>{risk}%</p>
                                        </div>
                                        <div className="flex flex-col justify-center gap-10">
                                            <div className="flex gap-16 pt-12 border-t border-white/10">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Stability</p>
                                                    <p className="text-5xl font-black text-white font-mono">{stability}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Confidence Index</p>
                                                    <p className="text-5xl font-black text-white font-mono">{confidence}%</p>
                                                </div>
                                            </div>
                                            <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Neural Stability Trend</p>
                                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div animate={{ width: `${stability}%` }} className="h-full bg-healthCyan" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Features moved to down (3rd point) */}
                                    <div className="border-t border-white/10 pt-16">
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8">Clinical Determinants & Pathological Insights</h3>
                                        <AIInsights />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ZONE 4: HUD MODE (Emergency Sentinel) */}
                        {mode === 'hud' && (
                            <motion.div 
                                key="hud"
                                initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0"
                            >
                                <EmergencyTerminal acknowledgeEmergency={() => {
                                    setMode('cardiac');
                                    setVitals({ risk: 40 });
                                }} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ─── FLOATING NAVIGATION DOCK (1st point: moved to right) ─── */}
            <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col items-center gap-3 p-3 rounded-[30px] glass-panel border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-50">
                {[
                    { id: 'vitals',  icon: Activity,    label: 'Telemetry' },
                    { id: 'cardiac', icon: Heart,       label: 'Cardiac' },
                    { id: 'ai',      icon: Brain,       label: 'Insights' },
                    { id: 'global',  icon: Globe,       label: 'Sentinel' },
                    { id: 'hud',     icon: ShieldAlert, label: 'Emergency' }
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => { setMode(item.id); playSwitchSound(); }}
                        className={`flex flex-col items-center justify-center gap-1 w-20 h-20 rounded-[24px] transition-all group ${mode === item.id ? (item.id === 'hud' ? 'bg-pulseRed text-white shadow-[0_0_20px_rgba(255,51,102,0.3)]' : 'bg-healthCyan text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]') : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <item.icon size={22} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-60 transition-opacity duration-300">{item.label}</span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default DigitalTwin;
