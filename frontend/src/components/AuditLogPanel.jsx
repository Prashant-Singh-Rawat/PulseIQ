import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollText, AlertTriangle, User, RefreshCcw, Activity, Zap, Brain } from 'lucide-react';
import useHealthStore from '../store/healthStore';

const iconMap = {
    ANOMALY_DETECTED:     { icon: AlertTriangle, color: 'text-red-500',      bg: 'bg-red-500/10' },
    EMERGENCY_STATE:      { icon: Zap,           color: 'text-orange-400',   bg: 'bg-orange-400/10' },
    HEALTH_DRIFT:         { icon: Activity,      color: 'text-yellow-400',   bg: 'bg-yellow-400/10' },
    PATIENT_SWITCH:       { icon: User,          color: 'text-healthCyan',   bg: 'bg-healthCyan/10' },
    HOSPITAL_ACKNOWLEDGED:{ icon: Brain,         color: 'text-green-400',    bg: 'bg-green-400/10' },
    SYSTEM_RESET:         { icon: RefreshCcw,    color: 'text-gray-400',     bg: 'bg-white/5' },
    FAIL_SAFE:            { icon: AlertTriangle, color: 'text-red-400',      bg: 'bg-red-400/10' },
};

const AuditLogPanel = () => {
    const { auditLogs, resetSimulation } = useHealthStore();

    return (
        <div className="glass-panel border-white/5 flex flex-col h-full overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <ScrollText size={18} className="text-healthCyan" />
                    <h3 className="text-sm font-black text-white uppercase italic tracking-widest">System Audit Log</h3>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{auditLogs.length} Events</span>
                    <button
                        onClick={resetSimulation}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-all text-[9px] font-black uppercase tracking-widest"
                    >
                        <RefreshCcw size={12} /> Reset Simulation
                    </button>
                </div>
            </div>

            {/* LOG ENTRIES */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-3">
                <AnimatePresence initial={false}>
                    {auditLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-700">
                            <ScrollText size={32} className="mb-3 opacity-30" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Awaiting First Events…</p>
                        </div>
                    ) : (
                        auditLogs.map(entry => {
                            const meta = iconMap[entry.event] || { icon: Activity, color: 'text-gray-500', bg: 'bg-white/5' };
                            const Icon = meta.icon;
                            return (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border border-white/5 ${meta.bg}`}
                                >
                                    <div className={`p-2 rounded-xl bg-black/30 shrink-0 ${meta.color}`}>
                                        <Icon size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${meta.color}`}>{entry.event.replace(/_/g, ' ')}</p>
                                        {entry.detail && <p className="text-[9px] text-gray-500 font-medium mt-0.5 truncate">{entry.detail}</p>}
                                    </div>
                                    <span className="text-[8px] font-black text-gray-700 font-mono shrink-0 uppercase tracking-tight">
                                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AuditLogPanel;
