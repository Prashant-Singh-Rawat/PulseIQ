import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, Activity, BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';
import useHealthStore from '../store/healthStore';

const FinalSummaryPanel = () => {
    const { 
        risk, confidence, stability, cardiacLoad, 
        age, weight, height, history 
    } = useHealthStore();

    const getTrend = () => {
        if (history.length < 2) return { label: 'SYNCHRONIZING', color: 'text-gray-400' };
        const current = history[0].risk;
        const prev = history[1].risk;
        if (current > prev) return { label: 'RISING_RISK', color: 'text-red-500' };
        if (current < prev) return { label: 'OPTIMIZING_TREND', color: 'text-green-400' };
        return { label: 'STEADY_STATE', color: 'text-healthCyan' };
    };

    const trend = getTrend();

    return (
        <div className="glass-panel p-8 border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck size={140} className="text-healthCyan" />
            </div>

            <div className="relative z-10">
                <header className="flex justify-between items-start mb-10 border-b border-white/5 pb-6">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">Guardian Elite Summary</h3>
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">Production-Grade Clinical Sentinel</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Confidence Score</p>
                            <p className="text-lg font-black text-healthCyan font-mono">{confidence}%</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                    <div className="space-y-6">
                        <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Current Cardiac Load</p>
                                <span className={`text-[10px] font-black px-3 py-0.5 rounded-full ${cardiacLoad === 'HIGH' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-400'}`}>
                                    {cardiacLoad}
                                </span>
                            </div>
                            <p className="text-3xl font-black text-white italic">{risk}%</p>
                        </div>

                        <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">System Stability Index</p>
                                <span className="text-[10px] font-black text-healthCyan">{stability}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-3">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stability}%` }}
                                    className="h-full bg-healthCyan shadow-[0_0_10px_#00f0ff]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-3">Live Risk Trend</p>
                            <div className="flex items-center gap-3">
                                <TrendingUp size={20} className={trend.color} />
                                <p className={`text-xl font-black ${trend.color} uppercase italic tracking-tighter`}>{trend.label}</p>
                            </div>
                        </div>

                        <div className="p-5 bg-white/10 border-2 border-healthCyan/20 rounded-3xl">
                            <p className="text-[10px] font-black text-healthCyan uppercase tracking-widest leading-none mb-3">Clinical Profile</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[8px] font-black text-gray-600 uppercase">Age Factor</p>
                                    <p className="text-sm font-black text-white">{age} YRS</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-gray-600 uppercase">BMI Factor</p>
                                    <p className="text-sm font-black text-white">{(weight / Math.pow(height / 100, 2)).toFixed(1)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="pt-8 border-t border-white/5">
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-all">
                        <div className="mt-1">
                            {risk > 70 ? <AlertCircle size={18} className="text-red-500" /> : <CheckCircle2 size={18} className="text-green-400" />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter leading-none mb-1">Guardian Elite Insight</p>
                            <p className="text-[11px] text-gray-500 font-medium italic">
                                {risk > 70 
                                    ? "Critical: Vital patterns indicate potential aortic strain. Emergency dispatch sentinel is monitoring."
                                    : (age > 60)
                                        ? "Steady: Baseline risk is stable, but Age Factor (60+) requires consistent BP monitoring."
                                        : "Optimal: All biometric vectors are within the standard safety zone for your age profile."
                                }
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default FinalSummaryPanel;
