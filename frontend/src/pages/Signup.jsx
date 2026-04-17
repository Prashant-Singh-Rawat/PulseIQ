import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Phone, Lock, User, ArrowRight, ShieldPlus, CheckCircle2, MessageSquare } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { sendWhatsAppOTP } from '../services/apiService';

const Signup = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('patient'); // 'patient' or 'doctor'
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    // Patient specific info
    age: '',
    gender: 'Male',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const generateUniqueId = (role) => {
    const prefix = role === 'doctor' ? 'DOC' : 'PAT';
    const num = Math.floor(10000 + Math.random() * 90000); // 5 digits
    return `${prefix}-${num}`;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (formData.mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number!");
      setLoading(false);
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('priocardix_accounts') || '[]');
    if (existingUsers.find(u => u.mobileNumber === formData.mobileNumber)) {
      setError("Mobile number already registered!");
      setLoading(false);
      return;
    }

    // Step 1: Generate and Send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);

    try {
      setOtpLoading(true);
      await sendWhatsAppOTP(`+91${formData.mobileNumber}`, otp);
      setStep('otp');
      setLoading(false);
      setOtpLoading(false);
    } catch (err) {
      console.error("OTP Error:", err);
      setError(`OTP FAILED: ${err.message || "Please check your WhatsApp token and number."}`);
      setLoading(false);
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);

    if (otpInput === generatedOtp || otpInput === "123456") { // Allow 123456 as backup or for testing
      const existingUsers = JSON.parse(localStorage.getItem('priocardix_accounts') || '[]');
      
      // Pre-check for mobile again to prevent race conditions
      if (existingUsers.find(u => u.mobileNumber === formData.mobileNumber)) {
        setError("Mobile number already registered!");
        setLoading(false);
        return;
      }

      const uniqueId = generateUniqueId(activeTab);

      const newUser = {
        name: formData.name,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        role: activeTab,
        uniqueId: uniqueId,
        loginCount: 0,
        createdAt: new Date().toISOString()
      };

      if (activeTab === 'patient') {
        newUser.age = formData.age;
        newUser.gender = formData.gender;
      }

      localStorage.setItem('priocardix_accounts', JSON.stringify([...existingUsers, newUser]));
      setLoading(false);
      setSuccessMsg(`Registration Successful! Your Unique ID is: ${uniqueId}. Redirecting...`);
      
      setTimeout(() => {
         navigate('/login');
      }, 3000);
    } else {
      setError("Invalid OTP code. Please check your WhatsApp.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg text-white relative overflow-hidden p-6">
      <div className="absolute top-0 right-0 w-96 h-96 bg-pulseRed/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-healthCyan/20 rounded-full blur-[150px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-10 max-w-md w-full relative z-10 shadow-2xl border border-white/10">
        <div className="flex justify-center flex-col items-center mb-6">
           <Logo size="text-3xl" iconSize={36} />
           <p className="text-center text-healthCyan font-bold text-sm mt-4 uppercase tracking-widest">PulseIQ Guardian Engine Access</p>
        </div>
        
        <p className="text-center text-gray-400 mb-6">Join the Priocardix AI platform.</p>

        {/* Tabs */}
        <div className="flex bg-[#151b2e] rounded-xl p-1 mb-6">
            <button 
                type="button"
                onClick={() => { setActiveTab('patient'); setError(''); }}
                className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'patient' ? 'bg-healthCyan text-black shadow-md' : 'text-gray-500 hover:text-white'}`}
            >
                Patient
            </button>
            <button 
                type="button"
                onClick={() => { setActiveTab('doctor'); setError(''); }}
                className={`flex-1 py-2 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'doctor' ? 'bg-pulseRed text-black shadow-md' : 'text-gray-500 hover:text-white'}`}
            >
                Doctor
            </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs font-bold text-center mb-6 animate-pulse">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl text-sm font-bold text-center mb-6">
             <ShieldPlus size={32} className="mx-auto mb-2 text-green-400" />
            {successMsg}
          </div>
        )}

        {step === 'otp' && !successMsg && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-6">
               <div className="w-16 h-16 bg-healthCyan/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-healthCyan animate-pulse">
                  <MessageSquare size={32} />
               </div>
               <h3 className="text-lg font-black text-white uppercase tracking-tight">Verify WhatsApp OTP</h3>
               <p className="text-xs text-gray-500 mt-2">A 6-digit code has been sent to <br/> <span className="text-white font-bold">+91 {formData.mobileNumber}</span></p>
            </div>

            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2 block text-center">Enter Code</label>
              <input 
                type="text" required maxLength="6"
                value={otpInput} onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))} 
                className="w-full bg-[#151b2e] border border-white/10 p-5 rounded-2xl focus:ring-2 focus:ring-healthCyan transition-all outline-none text-2xl font-black tracking-[0.5em] text-center text-healthCyan" 
                placeholder="••••••" 
              />
            </div>

            <button type="submit" disabled={loading} className="w-full py-5 bg-healthCyan text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:brightness-110 active:scale-95 transition-all flex justify-center items-center">
               {loading ? <Activity className="animate-spin" /> : <>Verify & Complete <CheckCircle2 size={18} className="ml-2" /></>}
            </button>

            <button 
              type="button"
              onClick={() => setStep('form')}
              className="w-full text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              Back to registration
            </button>
          </form>
        )}

        {step === 'form' && !successMsg && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1 block ml-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" required 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-[#151b2e] border border-white/5 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-pulseRed transition-all outline-none text-sm" 
                  placeholder={activeTab === 'doctor' ? "Dr. John Smith" : "John Doe"} 
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>

            {activeTab === 'patient' && (
               <div className="flex space-x-4">
                  <div className="flex-1">
                     <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1 block ml-1">Age</label>
                     <input 
                       type="number" required 
                       value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} 
                       className="w-full bg-[#151b2e] border border-white/5 p-3 rounded-xl focus:ring-2 focus:ring-healthCyan transition-all outline-none text-sm" 
                       placeholder="Years" 
                     />
                  </div>
                  <div className="flex-1">
                     <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1 block ml-1">Gender</label>
                     <select 
                       value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} 
                       className="w-full bg-[#151b2e] border border-white/5 p-3 rounded-xl focus:ring-2 focus:ring-healthCyan transition-all outline-none text-sm text-gray-300"
                     >
                       <option value="Male">Male</option>
                       <option value="Female">Female</option>
                       <option value="Other">Other</option>
                     </select>
                  </div>
               </div>
            )}

            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1 block ml-1">Mobile Number</label>
              <div className="relative">
                <input 
                  type="text" required pattern="\d{10}" maxLength="10"
                  value={formData.mobileNumber} onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData({...formData, mobileNumber: val});
                  }} 
                  className="w-full bg-[#151b2e] border border-white/5 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-pulseRed transition-all outline-none text-sm" 
                  placeholder="10-digit number" 
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1 block ml-1">Set Password</label>
              <div className="relative">
                <input 
                  type="password" required 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="w-full bg-[#151b2e] border border-white/5 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-pulseRed transition-all outline-none text-sm" 
                  placeholder="••••••••" 
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1 block ml-1">Confirm Password</label>
              <div className="relative">
                <input 
                  type="password" required 
                  value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                  className="w-full bg-[#151b2e] border border-white/5 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-pulseRed transition-all outline-none text-sm" 
                  placeholder="••••••••" 
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className={`w-full py-4 mt-2 font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(255,51,102,0.3)] hover:brightness-110 active:scale-95 transition-all flex justify-center items-center ${activeTab === 'doctor' ? 'bg-pulseRed text-black' : 'bg-healthCyan text-black'}`}>
               {loading ? <Activity className="animate-spin" /> : <>Send OTP <ArrowRight size={18} className="ml-2" /></>}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-gray-500 text-xs">
          Already registered? <Link to="/login" className="text-white font-bold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;

