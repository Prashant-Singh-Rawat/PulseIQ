import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useHealthStore from '../store/healthStore';

// Fix for default marker icons in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const RecenterMap = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) map.setView(coords, map.getZoom());
    }, [coords, map]);
    return null;
};

const RiskMap = () => {
    // 1. Selector optimization: prevents re-renders on other state changes
    const risk = useHealthStore(state => state.risk);
    const bpm = useHealthStore(state => state.bpm);
    const isAnomalyDetected = useHealthStore(state => state.isAnomalyDetected);
    
    const [hotspots, setHotspots] = useState([
        { id: 1, city: 'New York', pos: [40.7128, -74.0060], risk: 45, expansion: 1000 },
        { id: 2, city: 'London', pos: [51.5074, -0.1278], risk: 62, expansion: 1500 },
        { id: 3, city: 'Mumbai', pos: [19.0760, 72.8777], risk: 78, expansion: 2000 },
        { id: 4, city: 'Tokyo', pos: [35.6762, 139.6503], risk: 31, expansion: 800 },
        { id: 5, city: 'New Delhi', pos: [28.6139, 77.2090], risk: 92, expansion: 3000 },
    ]);

    // User's simulated location
    const [userLocation, setUserLocation] = useState([28.6139, 77.2090]);

    useEffect(() => {
        // 2. Reduce frequency: Simulate population updates & expansion zones every 5 seconds (not 3)
        const interval = setInterval(() => {
            setHotspots(prev => prev.map(h => ({
                ...h,
                risk: Math.min(100, Math.max(10, h.risk + (Math.random() - 0.5) * 5)),
                expansion: Math.max(500, Math.min(5000, h.expansion + (Math.random() - 0.5) * 400))
            })));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const getMarkerColor = (r) => {
        if (r > 80) return '#ff3366'; // Red
        if (r > 50) return '#f59e0b'; // Orange
        return '#00f0ff';           // Cyan
    };

    return (
        <div className="w-full h-full rounded-[40px] overflow-hidden border-2 border-white/5 relative shadow-2xl">
            <MapContainer center={userLocation} zoom={4} style={{ height: '100%', width: '100%', background: '#0a0a0c' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {/* Hotspots & Expansion Zones */}
                {hotspots.map(h => (
                    <React.Fragment key={h.id}>
                        {/* Elite Feature: Expansion Zone (Predicted Spread) */}
                        <Circle 
                            center={h.pos}
                            radius={h.expansion * (h.risk / 50)}
                            pathOptions={{
                                color: getMarkerColor(h.risk),
                                fillColor: getMarkerColor(h.risk),
                                fillOpacity: 0.1,
                                weight: 1,
                                dashArray: '5, 10'
                            }}
                        />
                        <CircleMarker 
                            center={h.pos}
                            radius={8 + h.risk / 10}
                            pathOptions={{
                                color: getMarkerColor(h.risk),
                                fillColor: getMarkerColor(h.risk),
                                fillOpacity: 0.4,
                                weight: 2
                            }}
                        >
                            <Popup className="dark-popup">
                                <div className="p-2">
                                    <h4 className="font-black uppercase text-[10px] tracking-widest text-white">{h.city}</h4>
                                    <p className="text-sm font-black mt-1" style={{ color: getMarkerColor(h.risk) }}>{Math.round(h.risk)}% RISK</p>
                                    <p className="text-[8px] text-gray-400 mt-1 uppercase italic">Expansion Zone: {(h.expansion/1000).toFixed(1)}KM</p>
                                    <p className="text-[8px] text-gray-500 mt-2">Optimal System Sync</p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    </React.Fragment>
                ))}

                {/* USER NODE */}
                <CircleMarker
                    center={userLocation}
                    radius={15}
                    pathOptions={{
                        color: risk > 80 ? '#ff3366' : '#00f0ff',
                        fillColor: risk > 80 ? '#ff3366' : '#00f0ff',
                        fillOpacity: 0.6,
                        weight: 4,
                        className: isAnomalyDetected ? 'user-marker-anomaly' : 'user-marker-pulse'
                    }}
                >
                    <Popup>
                        <div className="p-2 text-center">
                            <h4 className="font-black uppercase text-[10px] tracking-widest">Master Sentinel Node</h4>
                            <p className="text-xl font-black text-healthCyan mt-1">{risk}% RISK</p>
                            <p className="text-[9px] text-gray-400 mt-1 uppercase">BPM: {bpm}</p>
                            {isAnomalyDetected && <p className="text-[8px] text-red-500 font-black mt-2 uppercase animate-pulse">! Anomaly Detected</p>}
                        </div>
                    </Popup>
                </CircleMarker>

                <RecenterMap coords={userLocation} />
            </MapContainer>

            {/* MAP OVERLAY: ELITE DASHBOARD */}
            <div className="absolute top-6 left-6 z-[1000] p-6 glass-panel border-white/10 bg-black/60 backdrop-blur-md max-w-[280px]">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white flex items-center mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse mr-3" />
                    Spatial Intelligence
                </h3>
                <div className="space-y-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2">Predicted Clusters</p>
                        <ul className="text-[10px] font-bold text-white space-y-2">
                           <li className="flex justify-between items-center">
                              <span>New Delhi</span> <span className="text-red-500">Critical</span>
                           </li>
                           <li className="flex justify-between items-center">
                              <span>Mumbai</span> <span className="text-orange-400">Elevated</span>
                           </li>
                        </ul>
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full border border-dashed border-cyan-400" />
                            <span className="text-[10px] font-black uppercase text-gray-400 italic">Expansion Zone Limit</span>
                        </div>
                        {/* Real-time Indicator */}
                        <span className="text-[8px] font-mono text-green-400 animate-pulse">LIVE</span>
                    </div>
                </div>
            </div>
            
            <style>{`
                .leaflet-container { filter: grayscale(100%) invert(100%) contrast(90%); }
                .leaflet-popup-content-wrapper { background: #121214 !important; border: 1px solid rgba(255,255,255,0.1) !important; color: white !important; }
                .leaflet-popup-tip { background: #121214 !important; }
                .user-marker-pulse { animation: map-pulse 2s infinite ease-out; }
                .user-marker-anomaly { animation: map-pulse-critical 0.5s infinite ease-in-out; stroke-width: 10 !important; }
                @keyframes map-pulse {
                    0% { stroke-width: 4; stroke-opacity: 0.8; }
                    100% { stroke-width: 25; stroke-opacity: 0; }
                }
                @keyframes map-pulse-critical {
                    0% { stroke: #ff3366; stroke-width: 10; opacity: 1; }
                    50% { stroke: #ffffff; stroke-width: 20; opacity: 0.5; }
                    100% { stroke: #ff3366; stroke-width: 10; opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default React.memo(RiskMap);
