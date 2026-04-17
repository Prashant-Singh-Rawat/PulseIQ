import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

const RiskHeatmap = () => {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/analytics/hotspots');
        const data = await res.json();
        setHotspots(data);
        setLoading(false);
      } catch (err) {
        console.error("Heatmap sync error:", err);
      }
    };
    fetchHotspots();
    const interval = setInterval(fetchHotspots, 10000); // Live sync every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6 border-white/5 relative overflow-hidden h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-6 relative z-30">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1 italics">Global Cardiac Load Heatmap</h3>
          <p className="text-[10px] text-healthCyan font-black uppercase tracking-widest">Real-world Population Risk Stratification • Multi-Source AI Aggregation</p>
        </div>
        <div className="flex space-x-3">
            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 hidden md:block">
                <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Total Scan Nodes</p>
                <p className="text-sm font-black text-white">412 Active</p>
            </div>
            <div className="bg-pulseRed/10 px-4 py-2 rounded-xl border border-pulseRed/20 flex items-center">
                <span className="w-2 h-2 rounded-full bg-pulseRed animate-ping mr-3" />
                <span className="text-[10px] font-black text-pulseRed uppercase tracking-widest">7 Phase-1 Vectors</span>
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 relative z-10">
        {/* LEFT: MAP */}
        <div className="flex-1 rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl z-20">
            <MapContainer 
                center={[20, 0]} 
                zoom={2} 
                scrollWheelZoom={false} 
                className="h-full w-full"
                style={{ background: '#050810' }}
            >
                <TileLayer
                    attribution='&copy; CARTO DB'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {Array.isArray(hotspots) && hotspots.map((spot) => (
                    <CircleMarker 
                        key={spot.id}
                        center={spot.pos}
                        radius={spot.risk / 4}
                        pathOptions={{ 
                            fillColor: spot.risk > 75 ? '#ff3366' : spot.risk > 55 ? '#f59e0b' : '#00f0ff',
                            color: 'transparent',
                            fillOpacity: 0.6
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                            <div className="bg-[#050810] p-4 rounded-2xl border border-white/20 text-white min-w-[200px] shadow-2xl">
                                <div className="flex justify-between items-start mb-3 border-b border-white/10 pb-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-wrap max-w-[120px]">{spot.name}</p>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded ${spot.risk > 75 ? 'bg-pulseRed text-white' : 'bg-healthCyan text-black'}`}>{spot.load}</span>
                                </div>
                                <div className="space-y-2">
                                    <p className={`text-2xl font-black ${spot.risk > 75 ? 'text-pulseRed' : 'text-healthCyan'}`}>{spot.risk}% <span className="text-[10px] font-bold text-gray-400">Cardio Impact</span></p>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div>
                                            <p className="text-[8px] font-black text-gray-500 uppercase">Age Group</p>
                                            <p className="text-[10px] font-bold text-white">{spot.demographics?.age || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-500 uppercase">Trend</p>
                                            <p className="text-[10px] font-bold text-pulseRed">{spot.demographics?.trend || '0%'}</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-bold text-yellow-500 uppercase mt-2">Major Factor: {spot.demographics?.factor || 'General'}</p>
                                </div>
                            </div>
                        </Tooltip>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>

        {/* RIGHT: LIVE FEED / SUMMARY */}
        <div className="lg:w-80 w-full glass-panel border-white/5 bg-white/2 overflow-y-auto flex flex-col p-6 z-30">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Top Critical Vectors</h4>
            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {Array.isArray(hotspots) && [...hotspots].sort((a,b) => b.risk - a.risk).slice(0, 4).map((spot, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ x: 20, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }} 
                        transition={{ delay: i * 0.1 }}
                        className="space-y-2"
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-[11px] font-black text-white uppercase truncate mr-2">{spot.name}</p>
                            <span className="text-[9px] font-black text-pulseRed shrink-0">{spot.risk}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${spot.risk}%` }} 
                                className={`h-full ${spot.risk > 75 ? 'bg-pulseRed' : 'bg-healthCyan'}`} 
                            />
                        </div>
                        <p className="text-[8px] text-gray-500 font-bold uppercase truncate">{spot.demographics?.factor || 'Processing'} detected</p>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
                <button className="w-full py-4 bg-white/5 border border-white/10 text-[9px] font-black text-white uppercase tracking-[0.3em] rounded-xl hover:bg-healthCyan hover:text-black hover:border-healthCyan transition-all active:scale-95">
                    Generate Global Report
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatmap;
