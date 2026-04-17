import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Activity, ShieldCheck, TrendingUp, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import useHealthStore from '../store/healthStore';

const CardiacReportModal = ({ onClose }) => {
    const { 
        risk, bpm, bp, stress, sleep, healthScore,
        confidence, stability, cardiacLoad,
        age, weight, height,
        modelVersion, dataSource, computationTime,
        history, explainabilityScore, systemMode, auditLogs
    } = useHealthStore();

    const printRef = useRef();

    const getTrend = () => {
        if (history.length < 2) return 'Insufficient Data';
        const delta = history[0].risk - history[Math.min(history.length - 1, 9)].risk;
        if (delta > 5)  return '↑ RISING';
        if (delta < -5) return '↓ IMPROVING';
        return '→ STABLE';
    };

    const getRecommendation = () => {
        if (risk > 80) return 'URGENT: Immediate cardiology consultation recommended. Reduce sodium intake, restrict physical exertion, and monitor BP every 30 minutes.';
        if (risk > 50) return 'CAUTION: Moderate cardiovascular risk detected. Schedule follow-up with your GP within 72 hours. Avoid stimulants.';
        if (stress > 7) return 'Elevated neural stress index. Consider mindfulness protocols and reduce caffeine intake. Sleep improvement recommended.';
        return 'All biometric vectors are within safe parameters. Maintain current lifestyle habits and schedule annual cardiac screening.';
    };

    const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
    const reportId = `PCA-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date();

    const handlePrint = () => window.print();

    return (
        <AnimatePresence>
            <motion.div
                key="report-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[20000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl overflow-auto"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 40 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 40 }}
                    className="w-full max-w-3xl bg-[#080a0e] border border-white/10 rounded-[50px] overflow-hidden shadow-[0_0_100px_rgba(0,240,255,0.1)] my-8"
                    ref={printRef}
                >
                    {/* REPORT HEADER */}
                    <div className="bg-gradient-to-r from-darkBg via-white/5 to-darkBg px-12 py-10 border-b border-white/5 flex justify-between items-start">
                        <div>
                            <p className="text-[8px] font-black text-healthCyan uppercase tracking-[0.5em] mb-2">Priocardix AI · PulseIQ Guardian Engine</p>
                            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Cardiac Intelligence<br/>Report</h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-4">
                                ID: {reportId} · Generated: {now.toLocaleString()} · Model: {modelVersion}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handlePrint} className="p-3 rounded-2xl bg-healthCyan/10 border border-healthCyan/30 text-healthCyan hover:bg-healthCyan/20 transition-all">
                                <Download size={20} />
                            </button>
                            <button onClick={onClose} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="px-12 py-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">

                        {/* SUMMARY ROW */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Risk Score',      val: `${risk}%`,              color: risk > 70 ? 'text-red-500' : 'text-healthCyan' },
                                { label: 'Health Score',    val: `${healthScore}%`,        color: 'text-green-400' },
                                { label: 'Stability Idx',   val: `${stability}%`,          color: 'text-white' },
                                { label: 'AI Confidence',   val: `${confidence}%`,         color: 'text-white' },
                                { label: 'Explainability',  val: `${explainabilityScore}%`,color: 'text-healthCyan' },
                                { label: 'System Mode',     val: systemMode,               color: systemMode === 'EMERGENCY' ? 'text-red-500' : 'text-healthCyan' },
                            ].map((s, i) => (
                                <div key={i} className="p-5 glass-panel border-white/5 text-center">
                                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2">{s.label}</p>
                                    <p className={`text-2xl font-black ${s.color} font-mono`}>{s.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* VITAL SIGNS TABLE */}
                        <div>
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-3 flex items-center gap-3">
                                <Activity size={14} className="text-healthCyan" /> Live Biometric Telemetry
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { label: 'Heart Rate',   val: `${bpm} BPM` },
                                    { label: 'Blood Pressure', val: `${bp} mmHg` },
                                    { label: 'Neural Stress',  val: `${stress}/10` },
                                    { label: 'Sleep Score',    val: `${sleep}%` },
                                    { label: 'Cardiac Load',   val: cardiacLoad },
                                    { label: 'Risk Trend',     val: getTrend() },
                                ].map((v, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-wide">{v.label}</span>
                                        <span className="text-xs font-black text-white font-mono">{v.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PATIENT PROFILE */}
                        <div>
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-3 flex items-center gap-3">
                                <ShieldCheck size={14} className="text-healthCyan" /> Clinical Profile
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                {[
                                    { label: 'Age', val: `${age} YRS` },
                                    { label: 'Weight', val: `${weight} KG` },
                                    { label: 'BMI', val: bmi },
                                    { label: 'Data Source', val: dataSource },
                                ].map((v, i) => (
                                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2">{v.label}</p>
                                        <p className="text-xs font-black text-white uppercase">{v.val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI RECOMMENDATION */}
                        <div className={`p-8 rounded-3xl border flex items-start gap-5 ${risk > 70 ? 'bg-red-500/5 border-red-500/20' : 'bg-healthCyan/5 border-healthCyan/20'}`}>
                            <div className="mt-1">
                                {risk > 70 ? <AlertCircle size={24} className="text-red-500" /> : <CheckCircle2 size={24} className="text-green-400" />}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Guardian AI Recommendation</p>
                                <p className="text-sm text-white font-medium leading-relaxed italic">{getRecommendation()}</p>
                            </div>
                        </div>

                        {/* AUDIT LOG EXCERPT */}
                        {auditLogs.length > 0 && (
                            <div>
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-3">Recent System Events</h3>
                                <div className="space-y-2">
                                    {auditLogs.slice(0, 4).map(log => (
                                        <div key={log.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                            <span className="text-[9px] font-black text-gray-400 uppercase">{log.event.replace(/_/g, ' ')}</span>
                                            <span className="text-[8px] font-black text-gray-600 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PERFORMANCE METADATA */}
                        <div className="flex flex-wrap justify-between gap-4 text-[9px] font-black text-gray-600 uppercase tracking-widest border-t border-white/5 pt-6">
                            <span>Engine: {modelVersion}</span>
                            <span>Generated: {now.toISOString()}</span>
                            <span>Confidence: {confidence}%</span>
                            <span>Latency: {computationTime}ms</span>
                            <span>Source: {dataSource}</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CardiacReportModal;
