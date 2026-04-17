import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import useHealthStore from '../store/healthStore';
import RealisticHeartScene from './HeartModel';

// Error boundary so the 3D canvas can never crash the whole app
class CanvasErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { console.error('DigitalTwinCanvas error caught:', err); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#050508] rounded-[40px] border border-white/5">
          <p className="text-red-500 font-black text-lg uppercase tracking-widest mb-2">3D Engine Recovery</p>
          <p className="text-gray-500 text-xs">The heart renderer encountered an issue. Guardian Sentinel remains active.</p>
          <button onClick={() => this.setState({ hasError: false })} className="mt-6 px-6 py-3 rounded-2xl bg-white/10 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">
            Reinitialize Engine
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const DigitalTwinCanvas = () => {
  const { risk, systemStatus, lastUpdated, bpm } = useHealthStore();

  const getStatusColor = () => {
    if (risk > 80) return '#ff3366';
    if (risk > 50) return '#f59e0b';
    return '#00f0ff';
  };

  return (
    <div className="w-full h-full relative glass-panel border-white/5 bg-[#050508] overflow-hidden rounded-[40px]">
      <CanvasErrorBoundary>
        <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
          <color attach="background" args={['#050508']} />
          <fog attach="fog" args={['#050508', 5, 15]} />

          {/* Core Scene managed by HeartModel now loading the GLTF */}
          <RealisticHeartScene />

          <Sparkles 
            count={risk > 80 ? 400 : 100} 
            scale={7} 
            size={3} 
            speed={risk > 80 ? 3 : 0.5} 
            color={getStatusColor()} 
            opacity={0.3}
          />
        </Canvas>
      </CanvasErrorBoundary>

      {/* OVERLAY INFO */}
      <div className="absolute top-8 left-8 p-6 glass-panel bg-black/40 backdrop-blur-md border-white/10 group pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
           <div className="w-2 h-2 rounded-full bg-healthCyan animate-pulse" />
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Sentinel_Digital_Twin</p>
        </div>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Heart Node v6.0</h2>
        <div className="mt-4 flex gap-6">
            <div>
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">System Status</p>
                <p className="text-xs font-black text-white uppercase">{systemStatus}</p>
            </div>
            <div>
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Last Sync</p>
                <p className="text-xs font-black text-healthCyan font-mono">{new Date(lastUpdated).toLocaleTimeString()}</p>
            </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 text-right pointer-events-none">
          <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] mb-1 italic">Priocardix AI Guardian Engine</p>
          <p className="text-[8px] font-bold text-gray-800 uppercase">Patent Pending Cardiovascular Monitoring System</p>
      </div>
    </div>
  );
};

export default DigitalTwinCanvas;
