import React from 'react';
import { motion } from 'framer-motion';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, MessageSquare, FileText, Settings, LogOut, Brain, Building, Globe, Stethoscope, User, RefreshCcw, Zap, Loader2, ChevronDown } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useHealthStore from '../store/healthStore';
import useGuardianEngine from '../hooks/useGuardianEngine';
import Logo from '../components/Logo';
import EmergencySystem from '../components/EmergencySystem';

const SYSTEM_MODE_STYLE = {
    MONITORING: { label: 'Monitoring Mode', color: 'text-healthCyan', dot: 'bg-healthCyan' },
    EMERGENCY:  { label: 'Emergency Mode',  color: 'text-red-500',    dot: 'bg-red-500'    },
    RECOVERY:   { label: 'Recovery Mode',   color: 'text-orange-400', dot: 'bg-orange-400' },
};

const PERF_LABEL = (ms) => {
    if (ms < 5)  return { label: 'Optimal', color: 'text-green-400' };
    if (ms < 20) return { label: 'Normal',  color: 'text-healthCyan' };
    return            { label: 'Delayed',   color: 'text-red-400' };
};

const MainLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const user   = useAuthStore(state => state.user);
  const {
    isDoctorMode, toggleDoctorMode,
    computationTime, systemStatus, modelVersion,
    systemMode, isAiThinking, resetSimulation,
    isMainSidebarCollapsed, toggleMainSidebar
  } = useHealthStore();
  const [holographic, setHolographic] = React.useState(false);

  // START GUARDIAN ENGINE
  useGuardianEngine();

  const handleLogout = () => { logout(); navigate('/login'); };

  const playHoloSound = () => {
    try {
      const audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start(); oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (_) {}
  };

  const modeStyle = SYSTEM_MODE_STYLE[systemMode] || SYSTEM_MODE_STYLE.MONITORING;
  const perf      = PERF_LABEL(computationTime);

  const navItems = [
    { name: 'Enterprise Hub',      path: '/enterprise', icon: Building },
    { name: 'Heart Preview 3D',    path: '/',           icon: Brain    },
    { name: 'Predictive Analytics',path: '/analytics',  icon: Globe    },
    { name: 'Check My Heart',      path: '/predict',    icon: Activity },
    { name: 'AI Assistant',        path: '/chat',       icon: MessageSquare },
    { name: 'Health History',      path: '/reports',    icon: FileText },
    { name: 'Settings',            path: '/settings',   icon: Settings },
  ];

  return (
    <div className={`flex h-screen bg-darkBg text-white overflow-hidden font-sans transition-all duration-700 ${holographic ? 'perspective-[2000px]' : ''}`}>
      <EmergencySystem />

      {/* SIDEBAR */}
      <motion.aside 
        animate={{ width: isMainSidebarCollapsed ? 0 : 256, opacity: isMainSidebarCollapsed ? 0 : 1, x: isMainSidebarCollapsed ? -256 : 0 }}
        className={`glass-panel m-4 flex flex-col justify-between border-r border-white/5 z-20 transition-all duration-700 overflow-hidden ${holographic ? 'rotate-y-[15deg] skew-y-[-2deg] opacity-80' : ''}`}
      >
        <div>
          <div className="p-6 flex items-center justify-between">
            <Logo />
            {/* Stethoscope button removed as requested */}
          </div>

          {/* 4. SYSTEM MODE INDICATOR */}
          <div className="mx-4 mb-4 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${modeStyle.dot}`} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${modeStyle.color}`}>{modeStyle.label}</span>
            </div>
            {/* 8. AI THINKING STATE */}
            {isAiThinking && (
              <div className="flex items-center gap-1.5">
                <Loader2 size={10} className="text-healthCyan animate-spin" />
                <span className="text-[7px] font-black text-healthCyan uppercase tracking-widest">Analyzing…</span>
              </div>
            )}
          </div>

          <nav className="mt-2 px-4 space-y-1.5">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <div className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${pathname === item.path ? 'bg-accent/20 text-accent border border-accent/30 shadow-[inset_0_0_15px_rgba(255,51,102,0.1)]' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
                  <item.icon size={18} className="mr-3" />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 space-y-2">
          <button
            onClick={() => { setHolographic(!holographic); playHoloSound(); }}
            className={`flex items-center justify-center w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${holographic ? 'bg-healthCyan text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'bg-white/5 text-gray-500 border border-white/10 hover:text-white'}`}
          >
            {holographic ? 'HUD_MODE_ACTIVE' : 'ACTIVATE_HUD_MODE'}
          </button>

          {/* 10. RESET SIMULATION */}
          <button
            onClick={resetSimulation}
            className="flex items-center justify-center w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-orange-400 hover:border-orange-400/30 transition-all gap-2"
          >
            <RefreshCcw size={14} /> Reset Simulation
          </button>

          <button onClick={handleLogout} className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-accent border border-accent/20 bg-accent/10 hover:bg-accent/30 hover:text-white rounded-xl shadow-[inset_0_0_10px_rgba(255,51,102,0.2)] transition-all">
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* GLOBAL EXPAND / LOGO HUB (Works on all pages) */}
      <div 
        className="fixed bottom-10 z-[60] flex items-center gap-6 transition-all duration-700"
        style={{ left: isMainSidebarCollapsed ? '24px' : '280px' }}
      >
          <button 
              onClick={toggleMainSidebar}
              className={`p-4 rounded-2xl border transition-all shadow-2xl flex items-center gap-3 group ${
                isMainSidebarCollapsed ? 'bg-healthCyan text-black border-healthCyan shadow-[0_0_30px_rgba(0,240,255,0.3)]' : 'glass-panel border-white/10 text-healthCyan hover:bg-white/5'
              }`}
          >
              <motion.div animate={{ rotate: isMainSidebarCollapsed ? 0 : 180 }}>
                  <ChevronDown size={20} className="-rotate-90" />
              </motion.div>
              <span className="text-[10px] font-black uppercase tracking-widest overflow-hidden whitespace-nowrap group-hover:w-32 w-0 transition-all duration-500">
                  {isMainSidebarCollapsed ? 'Expand View' : 'Compress View'}
              </span>
          </button>
          
          {isMainSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-panel py-3 px-5 border-white/10 flex items-center gap-4"
              >
                  <Logo size="text-sm" iconSize={16} />
              </motion.div>
          )}
      </div>

      {/* MAIN */}
      <main className={`flex-1 overflow-y-auto relative z-10 w-full transition-all duration-700 ${holographic ? 'rotate-y-[-10deg] skew-y-[1deg] translate-x-4 scale-95' : ''}`}>
        {holographic && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-30">
            <div className="absolute inset-0 bg-scan-line animate-scan-line" />
            <div className="absolute top-0 right-0 p-10 text-healthCyan font-mono text-[10px] space-y-1">
              <p>SYSTEM_STATUS: {modeStyle.label.toUpperCase()}</p>
              <p>BIO_LINK: CONNECTED</p>
              <p>NEURAL_LOAD: {computationTime}ms</p>
            </div>
          </div>
        )}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="min-h-full flex flex-col justify-between p-8">
          <Outlet />
          {/* GLOBAL STATUS BAR */}
          <footer className="mt-12">
            <div className="flex items-center justify-between px-4 py-4 text-[8px] font-black text-gray-700 uppercase tracking-widest border-t border-white/5">
              <span>Engine: <span className="text-gray-500">{modelVersion}</span></span>
              <span>Response: <span className={`font-mono ${perf.color}`}>{computationTime}ms · {perf.label}</span></span>
              {/* 8. AI Thinking in footer */}
              <span className={isAiThinking ? 'text-healthCyan animate-pulse italic' : 'text-gray-700 italic'}>
                {isAiThinking ? 'Analyzing physiological signals…' : systemStatus}
              </span>
              <span>© 2026 Priocardix AI · PulseIQ Guardian Engine</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
