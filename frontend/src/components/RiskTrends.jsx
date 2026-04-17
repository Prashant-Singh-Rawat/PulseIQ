import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useHealthStore from '../store/healthStore';

const RiskTrends = () => {
  const { history } = useHealthStore();

  const chartData = history.slice().reverse().map(point => ({
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    risk: point.risk,
    bpm: point.bpm,
    bp: point.bp
  }));

  return (
    <div className="w-full h-full glass-panel p-8 border-white/5 bg-gradient-to-br from-white/5 to-transparent">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Medical Telemetry Stream</h3>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Live Neural Trend Analysis</p>
            </div>
            <div className="flex gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-[10px] font-black text-gray-500 uppercase">Risk Index</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <div className="w-2 h-2 rounded-full bg-healthCyan" />
                    <span className="text-[10px] font-black text-gray-500 uppercase">BPM</span>
                </div>
            </div>
        </div>

        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff3366" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ff3366" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBPM" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                        dataKey="time" 
                        hide
                    />
                    <YAxis 
                        hide 
                        domain={[0, 200]}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#0a0a0c', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '900',
                            color: '#fff'
                        }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="risk" 
                        stroke="#ff3366" 
                        fillOpacity={1} 
                        fill="url(#colorRisk)" 
                        strokeWidth={3}
                        isAnimationActive={false}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="bpm" 
                        stroke="#00f0ff" 
                        fillOpacity={1} 
                        fill="url(#colorBPM)" 
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
        
        <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-6 overflow-x-auto">
            {history.slice(0, 5).map((point, i) => (
                <div key={i} className="shrink-0 space-y-1 pr-6 border-r border-white/5 last:border-0">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{new Date(point.timestamp).toLocaleTimeString([], { second: '2-digit' })}s</p>
                    <p className="text-xs font-black text-white">{point.risk}% <span className="text-[9px] text-gray-500 ml-1 italic">RISK</span></p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default RiskTrends;
