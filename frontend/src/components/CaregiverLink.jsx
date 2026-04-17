import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Bell, Phone, MapPin, Heart } from 'lucide-react';

const CaregiverLink = () => {
    const [linked, setLinked] = useState(false);
    const [id, setId] = useState('');

    const handleLink = () => {
        if(id.length > 3) setLinked(true);
    };

    return (
        <div className="glass-panel p-6 border-healthCyan/20 bg-healthCyan/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Shield size={64} className="text-healthCyan" />
            </div>

            <div className="mb-6 relative z-10">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-1">Guardian Connect</h3>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none">Multiplex Caregiver Synchronization</p>
            </div>

            {!linked ? (
                <div className="space-y-4 relative z-10">
                    <p className="text-[10px] text-gray-400 leading-relaxed italic">
                        Enable remote biometrics monitoring for your designated primary care provider or family member.
                    </p>
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/10 flex flex-col space-y-3">
                        <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest pl-1">Caregiver Access ID</label>
                        <input 
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="Enter 8-digit unique ID"
                            className="bg-transparent border-none p-0 text-xl font-black focus:ring-0 outline-none text-white font-mono placeholder:text-gray-700" 
                        />
                    </div>
                    <button 
                        onClick={handleLink}
                        className="w-full py-3 bg-healthCyan text-black font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-healthCyan/80 transition-all flex items-center justify-center"
                    >
                        Initiate Secure Link <Users size={14} className="ml-2" />
                    </button>
                </div>
            ) : (
                <div className="space-y-6 relative z-10">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-healthCyan/20 flex items-center justify-center text-healthCyan border-2 border-healthCyan/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                            <Heart size={20} className="fill-current" />
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-white uppercase">Protected by Dr. Sarah J.</h4>
                            <p className="text-[8px] font-black text-healthCyan uppercase tracking-widest">Active Monitoring Hub</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-healthCyan/30 transition-all">
                            <Bell size={18} className="text-gray-400 mb-2" />
                            <span className="text-[8px] font-black text-gray-500 uppercase">Emergency</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-healthCyan/30 transition-all">
                            <MapPin size={18} className="text-gray-400 mb-2" />
                            <span className="text-[8px] font-black text-gray-500 uppercase">Hospital Route</span>
                        </button>
                    </div>

                    <p className="text-[9px] text-gray-500 italic text-center leading-relaxed">
                        Bio-vector data is encrypted and synced every 300ms to the Caregiver Cloud.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CaregiverLink;
