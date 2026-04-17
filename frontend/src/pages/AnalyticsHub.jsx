import React from 'react';
import { Globe, TrendingUp, Zap } from 'lucide-react';
import useHealthStore from '../store/healthStore';
import RiskMap from '../components/RiskMap';
import AIInsights from '../components/AIInsights';
import RiskTrends from '../components/RiskTrends';
import FinalSummaryPanel from '../components/FinalSummaryPanel';
import AuditLogPanel from '../components/AuditLogPanel';

const AnalyticsHub = () => {
  const {
    risk, isDoctorMode,
    healthScore, modelVersion, activeNodes, highRiskRegions,
    explainabilityScore, isDriftDetected,
  } = useHealthStore();

  return (
    <div className="p-8 space-y-10 max-w-[1600px] mx-auto min-h-full">
      
      {/* HEADER */}
      <header className="flex justify-between items-end flex-wrap gap-6">
        <div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-2 italic">Population Hub</h1>
          <p className="text-xs text-pulseRed font-black uppercase tracking-[0.5em] flex items-center">
            <Zap size={14} className="mr-2" /> Global Cardiac Monitor · {modelVersion}
          </p>
        </div>
        <div className="flex gap-4 flex-wrap">
          {/* 5. MAP SCALE CONTEXT */}
          <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl text-right">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Global Cardiac Load Monitoring</p>
            <p className="text-lg font-black text-healthCyan font-mono">
              {activeNodes ?? 5} Active Nodes
              <span className="text-gray-500 mx-2">|</span>
              <span className="text-red-500">{highRiskRegions ?? 2} High Risk Regions</span>
            </p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 px-6 py-4 rounded-3xl text-right">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Health Score</p>
            <p className="text-xl font-black text-green-400 font-mono">{healthScore ?? 100 - risk}%</p>
          </div>
          <div className="bg-healthCyan/10 border border-healthCyan/20 px-6 py-4 rounded-3xl text-right">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Explainability</p>
            <p className="text-xl font-black text-healthCyan font-mono">{explainabilityScore}%</p>
          </div>
        </div>
      </header>

      {/* HEALTH DRIFT BANNER */}
      {isDriftDetected && (
        <div className="flex items-center gap-4 px-6 py-4 bg-yellow-500/10 border border-yellow-500/30 rounded-3xl">
          <TrendingUp size={18} className="text-yellow-400 shrink-0" />
          <p className="text-[11px] font-black text-yellow-400 uppercase tracking-widest">
            Health Drift Detected — Worsening risk trend identified across recent monitoring window. Recommend clinical assessment.
          </p>
        </div>
      )}

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* LEFT: MAP + TRENDS + AUDIT */}
        <div className="xl:col-span-8 space-y-10">
          <div className="h-[580px]">
            <RiskMap />
          </div>

          {isDoctorMode && (
            <div className="h-[380px]">
              <RiskTrends />
            </div>
          )}

          {/* AUDIT LOG PANEL — always visible */}
          <div className="h-[400px]">
            <AuditLogPanel />
          </div>
        </div>

        {/* RIGHT: INSIGHTS + SUMMARY + NODE STATUS */}
        <div className="xl:col-span-4 space-y-10">
          <AIInsights />
          <FinalSummaryPanel />

          <div className="glass-panel p-8 border-white/5 relative overflow-hidden group">
            <h3 className="text-sm font-black text-white uppercase mb-6 italic flex items-center gap-2">
              <Globe size={16} className="text-healthCyan" /> Global Node Status
            </h3>
            <div className="space-y-4">
              {[
                { node: 'AP-SOUTH-1 (Mumbai)',       status: 'Syncing', latency: '4ms' },
                { node: 'US-EAST-1 (N. Virginia)',    status: 'Steady',  latency: '68ms' },
                { node: 'EU-CENTRAL-1 (Frankfurt)',   status: 'Steady',  latency: '34ms' },
              ].map((n, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-gray-500 font-bold">{n.node}</span>
                  <div className="flex gap-4">
                    <span className="text-healthCyan">{n.status}</span>
                    <span className="text-gray-600 font-mono">{n.latency}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
              <TrendingUp size={80} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHub;
