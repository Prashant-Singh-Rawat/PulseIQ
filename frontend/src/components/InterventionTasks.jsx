import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Zap, Target, TrendingDown } from 'lucide-react';
import useAuthStore from '../store/authStore';

const InterventionTasks = () => {
    const user = useAuthStore(state => state.user);
    const [tasks, setTasks] = useState([]);
    const [adherence, setAdherence] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            // In a real system, we would have a proper user ID from the database
            // For now, we use a fallback ID 1
            const userId = user?.db_id || 1; 
            const res = await fetch(`http://localhost:3000/api/interventions/tasks/${userId}`);
            const data = await res.json();
            setTasks(data);

            const adRes = await fetch(`http://localhost:3000/api/interventions/adherence/${userId}`);
            const adData = await adRes.json();
            setAdherence(adData);
        } catch (err) {
            console.error("Failed to fetch interventions", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const completeTask = async (taskId) => {
        try {
            const res = await fetch(`http://localhost:3000/api/interventions/complete/${taskId}`, { method: 'POST' });
            if (res.ok) {
                // Refresh tasks
                fetchTasks();
            }
        } catch (err) {
            console.error("Completion error", err);
        }
    };

    if (loading) return <div className="animate-pulse text-gray-500 font-mono text-xs">Syncing with Guardian Neural Grid...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Active Interventions</h3>
                    <div className="flex space-x-3 mt-1">
                        <div className="flex items-center space-x-1 bg-healthCyan/10 px-2 py-0.5 rounded border border-healthCyan/20">
                            <Zap size={10} className="text-healthCyan fill-current" />
                            <span className="text-[8px] font-black text-white uppercase">{adherence?.gamification?.points || 0} PTS</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-pulseRed/10 px-2 py-0.5 rounded border border-pulseRed/20">
                            <Target size={10} className="text-pulseRed" />
                            <span className="text-[8px] font-black text-white uppercase">{adherence?.gamification?.streak_days || 0} DAY STREAK</span>
                        </div>
                    </div>
                </div>
                {adherence && (
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Adherence Prob.</p>
                        <p className={`text-sm font-black ${adherence.adherence_probability > 60 ? 'text-healthCyan' : 'text-pulseRed'}`}>
                            {adherence.adherence_probability || 75}%
                        </p>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {tasks.map((task) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={task.id}
                            className={`glass-panel p-4 border flex items-center justify-between transition-all ${task.status === 'completed' ? 'border-healthCyan/50 bg-healthCyan/5 opacity-60' : 'border-white/10 hover:border-white/20'}`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-lg ${task.status === 'completed' ? 'bg-healthCyan text-black' : 'bg-white/5 text-gray-400'}`}>
                                    <Target size={16} />
                                </div>
                                <div>
                                    <h4 className={`text-xs font-bold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
                                        {task.title}
                                    </h4>
                                    <p className="text-[9px] text-healthCyan font-black uppercase tracking-widest mt-0.5">-{task.risk_impact_pct}% Risk Impact</p>
                                </div>
                            </div>

                            {task.status !== 'completed' ? (
                                <button 
                                    onClick={() => completeTask(task.id)}
                                    className="p-2 hover:bg-healthCyan/20 rounded-full text-healthCyan transition-colors"
                                >
                                    <CheckCircle size={20} />
                                </button>
                            ) : (
                                <div className="text-healthCyan">
                                    <Zap size={20} className="fill-current" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            {/* MEDICATION VAULT (PATENT FEATURE) */}
            <div className="mt-8 border-t border-white/5 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                        <Clock size={12} className="mr-2" /> Medication Persistence Vault
                    </h4>
                    <span className="text-[9px] font-black text-white bg-healthCyan/20 px-2 py-0.5 rounded">AUTO-SYNC IN 0.4s</span>
                </div>
                <div className="space-y-3">
                    {[
                        { name: "Aspirin (81mg)", time: "08:00 AM", taken: true },
                        { name: "Atorvastatin (40mg)", time: "09:00 PM", taken: false },
                    ].map((med, i) => (
                        <div key={i} className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                               <div className={`w-2 h-2 rounded-full ${med.taken ? 'bg-healthCyan animate-pulse' : 'bg-gray-700'}`} />
                               <div>
                                  <p className="text-xs font-bold text-white">{med.name}</p>
                                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{med.time}</p>
                               </div>
                            </div>
                            <button className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${med.taken ? 'bg-healthCyan/10 text-healthCyan' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                                {med.taken ? 'VERIFIED' : 'MARK_AS_TAKEN'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mt-6">
                <div className="flex items-center space-x-2 mb-2">
                    <TrendingDown size={14} className="text-gray-500" />
                    <span className="text-[10px] font-black text-gray-500 uppercase">System Intelligence</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                    {adherence?.adherence_probability < 50 
                        ? "Adherence levels are critical. Priority intervention required to avoid cardiovascular escape."
                        : "Protocols are being followed efficiently. Neural heart models showing positive convergence."}
                </p>
            </div>
        </div>
    );
};

export default InterventionTasks;
