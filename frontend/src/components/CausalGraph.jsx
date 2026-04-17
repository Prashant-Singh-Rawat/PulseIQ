import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Moon, Activity, AlertCircle, TrendingDown } from 'lucide-react';

const CausalGraph = () => {
    const nodes = [
        { id: 'sleep', icon: <Moon size={16}/>, label: 'Sleep Quality', x: 50, y: 150, color: '#00f0ff' },
        { id: 'stress', icon: <Zap size={16}/>, label: 'Stress Load', x: 200, y: 50, color: '#ff3366' },
        { id: 'bp', icon: <Activity size={16}/>, label: 'Arterial Pressure', x: 200, y: 250, color: '#00f0ff' },
        { id: 'risk', icon: <AlertCircle size={16}/>, label: 'Cardiac Risk', x: 350, y: 150, color: '#ff3366' },
    ];

    const connections = [
        { from: 'sleep', to: 'stress', label: '-2.4x' },
        { from: 'sleep', to: 'bp', label: '-1.8x' },
        { from: 'stress', to: 'risk', label: '+4.2x' },
        { from: 'bp', to: 'risk', label: '+5.5x' },
    ];

    return (
        <div className="glass-panel p-6 border-white/5 relative overflow-hidden group min-h-[400px]">
            <div className="mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-1">Causal Intelligence Graph</h3>
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Neural Pathway Mapping</p>
            </div>

            <div className="relative h-[300px] w-full bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {connections.map((conn, i) => {
                        const fromNode = nodes.find(n => n.id === conn.from);
                        const toNode = nodes.find(n => n.id === conn.to);
                        return (
                            <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1 }}>
                                <line 
                                    x1={fromNode.x} y1={fromNode.y} 
                                    x2={toNode.x} y2={toNode.y} 
                                    stroke="white" strokeWidth="1" strokeDasharray="4 4" 
                                />
                                <motion.circle 
                                    r="3" fill="#00f0ff"
                                    animate={{ cx: [fromNode.x, toNode.x], cy: [fromNode.y, toNode.y] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                                />
                            </motion.g>
                        );
                    })}
                </svg>

                {nodes.map((node) => (
                    <motion.div
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                        style={{ left: node.x - 40, top: node.y - 40 }}
                        className="absolute w-20 h-20 flex flex-col items-center justify-center group/node"
                    >
                        <div className="w-10 h-10 rounded-xl bg-darkBg border-2 border-white/10 flex items-center justify-center text-white mb-2 shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover/node:border-healthCyan/50 group-hover/node:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
                            {node.icon}
                        </div>
                        <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest text-center">{node.label}</span>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-healthCyan/5 rounded-2xl border border-healthCyan/10">
                <div className="flex items-center space-x-2 mb-2">
                    <TrendingDown size={14} className="text-healthCyan" />
                    <span className="text-[10px] font-black text-healthCyan uppercase tracking-widest">Inference Engine Note</span>
                </div>
                <p className="text-[9px] text-gray-400 font-medium italic leading-relaxed">
                    Increasing Sleep Duration to 8.5hrs will theoretically suppress the "Stress Load" node by 14%, resulting in a 3.2% global risk reduction.
                </p>
            </div>
        </div>
    );
};

export default CausalGraph;
