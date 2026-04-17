import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, AlertCircle, ChevronRight, User, ArrowUpRight } from 'lucide-react';

const HospitalTriage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, CRITICAL, HIGH, STABLE

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/alerts/hospital/queue');
                if (!res.ok) throw new Error("API DOWN");
                const data = await res.json();
                setPatients(data);
            } catch (err) {
                console.warn("Failed to fetch triage queue, using mock data for demo", err);
                setPatients([
                    { id: 'P-4491', name: 'A. Sharma', risk: 88, status: 'CRITICAL' },
                    { id: 'P-2201', name: 'K. Gupta', risk: 72, status: 'HIGH' },
                    { id: 'P-9912', name: 'M. Patel', risk: 45, status: 'STABLE' },
                    { id: 'P-5561', name: 'R. Verma', risk: 91, status: 'CRITICAL' },
                    { id: 'P-1122', name: 'S. Singh', risk: 38, status: 'STABLE' },
                    { id: 'P-3344', name: 'L. Khan', risk: 95, status: 'CRITICAL' },
                    { id: 'P-8877', name: 'V. Nair', risk: 65, status: 'HIGH' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'ALL' || p.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleLedgerAccess = () => {
        alert("🔒 ACCESS GRANTED: Opening the Hospital Command Ledger. All patient biometrics are decrypted within the secure enclave.");
    };

    if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl" />)}</div>;

    return (
        <div className="glass-panel p-6 border-white/5 relative overflow-hidden h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-1">Clinic Triage Matrix</h3>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Real-time Patient Strategic Sort</p>
                </div>
                <div className="flex space-x-2">
                    <div className="relative">
                        <input 
                            type="text"
                            placeholder="Search Patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 pl-10 text-[10px] text-white focus:outline-none focus:border-healthCyan/50 w-44 transition-all"
                        />
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                    
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-[10px] text-gray-400 outline-none hover:text-white transition-colors"
                    >
                        <option value="ALL">ALL STATUS</option>
                        <option value="CRITICAL">CRITICAL</option>
                        <option value="HIGH">HIGH</option>
                        <option value="STABLE">STABLE</option>
                    </select>
                </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence mode='popLayout'>
                    {filteredPatients.length > 0 ? filteredPatients.map((patient, index) => (
                        <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.08)' }}
                            className="bg-white/5 p-4 rounded-2xl border border-white/5 group/row flex items-center justify-between cursor-pointer transition-all mb-3"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${patient.status === 'CRITICAL' ? 'bg-pulseRed/20 text-pulseRed shadow-[0_0_15px_rgba(255,51,102,0.2)]' : 'bg-healthCyan/20 text-healthCyan'}`}>
                                    <User size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{patient.name}</h4>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-tight">ID: {patient.id} • {patient.status}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Risk Index</p>
                                    <p className={`text-lg font-black ${patient.risk > 70 ? 'text-pulseRed' : 'text-healthCyan'}`}>{patient.risk}%</p>
                                </div>
                                <div className="p-2 rounded-lg bg-white/5 text-gray-500 group-hover/row:text-white group-hover/row:bg-white/10 transition-all">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 text-center">
                            <Search size={48} className="mb-4 text-healthCyan" />
                            <p className="text-xs font-black uppercase tracking-widest text-white">No nodes matched query</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <button 
                onClick={handleLedgerAccess}
                className="w-full mt-6 py-5 bg-healthCyan text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:brightness-110 shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all flex items-center justify-center active:scale-95"
            >
                Access Full Hospital Ledger <ArrowUpRight size={14} className="ml-2" />
            </button>
        </div>
    );
};

export default HospitalTriage;
