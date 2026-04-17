import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Mic, Video, MoreHorizontal, User, ShieldAlert } from 'lucide-react';

const TeleConsultation = ({ isOpen, onClose, doctorName }) => {
  const [active, setActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
        }
      };
      startCamera();
    } else {
      // Cleanup stream when modal closes
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8"
        >
          <div className="w-full max-w-5xl h-[80vh] bg-darkBg border border-white/10 rounded-[40px] overflow-hidden flex flex-col relative shadow-[0_0_100px_rgba(255,51,102,0.1)]">
            
            {/* CALL OVERLAY */}
            <div className="absolute top-8 left-8 z-10">
               <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                  <div className="w-3 h-3 rounded-full bg-pulseRed animate-pulse" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">Live Bio-Network Link</span>
               </div>
            </div>

            {/* MAIN VIDEO FEED (MOCKUP) */}
            <div className="flex-1 relative bg-[#0a0c14]">
               {/* DOCTOR VIEW (Large) */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center opacity-20">
                     <User size={120} className="mx-auto mb-4 text-healthCyan" />
                     <p className="text-sm font-black text-white uppercase tracking-widest">Waiting for {doctorName}...</p>
                  </div>
               </div>

               {/* PATIENT VIEW (PiP) */}
               <div className="absolute bottom-8 right-8 w-64 h-44 bg-black rounded-3xl border border-white/20 overflow-hidden shadow-2xl z-20">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                     <p className="text-[8px] font-black text-white uppercase tracking-widest">Local Feed</p>
                  </div>
               </div>

               {/* BIO-VECTOR SLIDER (SIDEBAR) */}
               <div className="absolute top-1/2 -translate-y-1/2 right-8 space-y-4 z-10 hidden xl:block">
                  {[
                    { label: 'BPM', val: '72', color: 'text-healthCyan' },
                    { label: 'BP', val: '128/84', color: 'text-white' },
                    { label: 'O2', val: '98%', color: 'text-healthCyan' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right min-w-[100px]">
                       <p className="text-[8px] font-black text-gray-500 uppercase mb-1">{stat.label}</p>
                       <p className={`text-xl font-black ${stat.color}`}>{stat.val}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* CONTROLS */}
            <div className="p-10 bg-black/40 border-t border-white/10 flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                     <span className="font-mono text-xs">8:42</span>
                  </div>
                  <div className="h-6 w-[1px] bg-white/10 mx-2" />
                  <div className="flex items-center space-x-2 text-healthCyan bg-healthCyan/10 px-3 py-1 rounded-full border border-healthCyan/20">
                     <ShieldAlert size={12} />
                     <span className="text-[9px] font-black uppercase tracking-widest">Encrypted</span>
                  </div>
               </div>

               <div className="flex items-center space-x-6">
                  <button className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                     <Mic size={24} />
                  </button>
                  <button className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                     <Video size={24} />
                  </button>
                  <button 
                    onClick={onClose}
                    className="w-20 h-16 rounded-3xl bg-pulseRed text-black flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,51,102,0.4)]"
                  >
                     <PhoneOff size={28} />
                  </button>
                  <button className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                     <MoreHorizontal size={24} />
                  </button>
               </div>

               <div className="w-48 text-right">
                  <p className="text-xs font-black text-white uppercase">{doctorName}</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Priocardix Network Surgeon</p>
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeleConsultation;
