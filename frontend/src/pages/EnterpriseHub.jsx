import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Users, Building, Activity, ShieldPlus, ArrowRight, Zap, Globe, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import HospitalTriage from '../components/HospitalTriage';
import TeleConsultation from '../components/TeleConsultation';
import FinalSummaryPanel from '../components/FinalSummaryPanel';

const EnterpriseHub = () => {
    const [isCallOpen, setIsCallOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);
    const [protocolUpdateStatus, setProtocolUpdateStatus] = useState('idle'); // idle, updating, done

    const handleMayoSync = () => {
        setIsSyncing(true);
        setSyncProgress(0);
        const interval = setInterval(() => {
            setSyncProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsSyncing(false), 1000);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    const handleProtocolUpdate = () => {
        setProtocolUpdateStatus('updating');
        setTimeout(() => {
            setProtocolUpdateStatus('done');
            setTimeout(() => setProtocolUpdateStatus('idle'), 3000);
        }, 2000);
    };

    const handleForceEmergency = () => {
        alert("🚨 EMERGENCY OVERRIDE INITIATED: Routing all incoming AI alerts to Primary Cardiac Triage.");
    };

    return (
        <div className="p-8 space-y-10 max-w-[1600px] mx-auto">
            {/* TELE-CONSULTATION MODAL */}
            <TeleConsultation 
                isOpen={isCallOpen} 
                onClose={() => setIsCallOpen(false)} 
                doctorName="Dr. Johnathan Smith" 
            />
            
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-2 italic">Enterprise Portal</h1>
                    <p className="text-xs text-pulseRed font-black uppercase tracking-[0.5em] flex items-center">
                        <Zap size={14} className="mr-2" /> Priocardix Health Network v4.0
                    </p>
                </div>
                <div className="flex space-x-4">
                    <button 
                        onClick={() => setIsCallOpen(true)}
                        className="bg-healthCyan text-black px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:brightness-110 transition-all"
                    >
                        <Phone size={14} className="mr-3" /> Start Tele-Consult
                    </button>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-right">
                        <p className="text-[8px] font-black text-gray-500 uppercase">System Latency</p>
                        <p className="text-sm font-black text-healthCyan font-mono">14ms</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* LEFT: HOSPITAL METRICS */}
                <div className="xl:col-span-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Active Admissions', val: '124', icon: <Building/>, color: 'text-white' },
                            { label: 'Guardian Sync Rate', val: '92.5%', icon: <Activity/>, color: 'text-healthCyan' },
                            { label: 'Emergency Dispatches', val: '12', icon: <Zap/>, color: 'text-pulseRed' },
                        ].map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-panel p-6 border-white/5 hover:border-white/10 transition-colors"
                            >
                                <div className="p-3 bg-white/5 rounded-xl inline-block mb-4 text-gray-400">
                                    {stat.icon}
                                </div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.val}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="h-[600px]">
                        <HospitalTriage />
                    </div>
                </div>

                {/* RIGHT: SYSTEM MANAGEMENT */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Guardian Elite Summary moved here as requested */}
                    <div className="shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[40px] overflow-hidden">
                        <FinalSummaryPanel />
                    </div>

                    <div className="glass-panel p-8 border-white/5 bg-gradient-to-br from-pulseRed/5 to-transparent">
                        <h3 className="text-xl font-black text-white uppercase mb-6 flex items-center">
                            <ShieldPlus size={24} className="mr-3 text-pulseRed" /> Triage Controls
                        </h3>
                        <div className="space-y-4">
                            <button 
                                onClick={handleForceEmergency}
                                className="w-full py-5 bg-pulseRed text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-pulseRed/80 transition-all shadow-lg active:scale-95"
                            >
                                Force Emergency Route
                            </button>
                            <button 
                                onClick={handleProtocolUpdate}
                                disabled={protocolUpdateStatus !== 'idle'}
                                className="w-full py-5 bg-white/5 text-white font-black uppercase text-xs tracking-widest rounded-2xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center disabled:opacity-50"
                            >
                                {protocolUpdateStatus === 'idle' && 'Update Triage Protocols'}
                                {protocolUpdateStatus === 'updating' && <Loader2 className="animate-spin mr-2" size={16} />}
                                {protocolUpdateStatus === 'updating' && 'DEPLOYING...'}
                                {protocolUpdateStatus === 'done' && <CheckCircle2 className="text-green-400 mr-2" size={16} />}
                                {protocolUpdateStatus === 'done' && 'PROTOCOLS UPDATED'}
                            </button>
                        </div>
                    </div>

                    <div className="glass-panel p-8 border-white/5">
                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Personnel Grid</h3>
                        <div className="space-y-6">
                            {[
                                { name: 'Dr. Johnathan Smith', role: 'Head of Cardiology', status: 'On Shift' },
                                { name: 'Nurse Mira K.', role: 'Triage Lead', status: 'On Shift' },
                                { name: 'AI Guardian v4', role: 'Autonomous Monitor', status: 'Steady' },
                            ].map((p, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-black text-white uppercase">{p.name}</p>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase">{p.role}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-healthCyan" />
                                        <span className="text-[9px] font-black text-white uppercase">{p.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-[40px] p-8 border border-white/5 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-sm font-black text-white uppercase mb-4 italic">Next Level: Global Node Sync</h3>
                            {isSyncing ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black text-healthCyan uppercase">
                                        <span>MAYO_CLINIC_LINK...</span>
                                        <span>{syncProgress}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-healthCyan" 
                                            style={{ width: `${syncProgress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleMayoSync}
                                    className="flex items-center text-healthCyan text-xs font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform"
                                >
                                    Sync with Mayo Clinic Node <ArrowRight size={16} className="ml-2" />
                                </button>
                            )}
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Globe size={100} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseHub;
