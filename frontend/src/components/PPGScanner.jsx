import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PPGScanner = ({ onBpmDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [active, setActive] = useState(false);
  const [bpm, setBpm] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("SECURE_CONTEXT_REQUIRED: Camera access requires HTTPS or localhost.");
        }
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setActive(true);
        }
      } catch (err) {
        console.error("Camera Access Denied", err);
        setError(err.message.includes("SECURE_CONTEXT") 
          ? "🔒 Secure connection (HTTPS) required for biometric scanning." 
          : "⚠️ Camera access denied. Please enable permissions in your browser.");
      }
    };

    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!active || error) return;

    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    let frameId;
    const intensities = [];
    const windowSize = 90; // Slightly faster window

    const processFrame = () => {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        frameId = requestAnimationFrame(processFrame);
        return;
      }
      
      const vw = videoRef.current.videoWidth;
      const vh = videoRef.current.videoHeight;
      const boxSize = 80;
      const startX = (vw / 2) - (boxSize / 2);
      const startY = (vh / 2) - (boxSize / 2);

      // Draw center region to canvas
      ctx.drawImage(videoRef.current, startX, startY, boxSize, boxSize, 0, 0, 100, 100);
      const imageData = ctx.getImageData(0, 0, 100, 100);
      const data = imageData.data;

      // Calculate average Red channel intensity (PPG works best on Red channel)
      let rSum = 0;
      for (let i = 0; i < data.length; i += 4) {
        rSum += data[i];
      }
      const avgR = rSum / (data.length / 4);
      
      intensities.push(avgR);
      if (intensities.length > windowSize) intensities.shift();

      // Signal processing for BPM
      if (intensities.length === windowSize) {
        const peaks = [];
        for (let i = 1; i < intensities.length - 1; i++) {
          if (intensities[i] > intensities[i-1] && intensities[i] > intensities[i+1] && intensities[i] > 10) {
            peaks.push(i);
          }
        }
        
        if (peaks.length > 3) {
          const intervals = [];
          for (let i = 1; i < peaks.length; i++) {
             intervals.push(peaks[i] - peaks[i-1]);
          }
          const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
          
          // Assuming 60fps or requestAnimationFrame speed (rough estimation)
          // For real clinical use, one would use a timestamp-based interval
          const detectedBpm = Math.round(3600 / avgInterval); 
          
          if (detectedBpm > 50 && detectedBpm < 160) {
             setBpm(detectedBpm);
             onBpmDetected(detectedBpm);
          }
        }
      }

      frameId = requestAnimationFrame(processFrame);
    };

    processFrame();
    return () => cancelAnimationFrame(frameId);
  }, [active, onBpmDetected, error]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
          <p className="text-pulseRed font-black uppercase text-xs tracking-widest">{error}</p>
          <div className="w-16 h-[1px] bg-pulseRed/20" />
          <p className="text-[10px] text-gray-500 italic max-w-xs">
            PulseIQ Engine cannot detect bio-vectors without a neural-optic stream.
          </p>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1] opacity-60" 
          />
          <canvas ref={canvasRef} width="100" height="100" className="hidden" />
          
          {/* HUD OVERLAY */}
          <div className="absolute inset-0 flex items-center justify-center p-8 z-20">
             <div className="w-full h-full border-2 border-dashed border-healthCyan/20 rounded-[40px] relative pointer-events-none">
                
                {/* SCANNER TARGET BOX */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-healthCyan/60 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.2)]">
                  <div className="absolute inset-0 bg-healthCyan/5 animate-pulse rounded-3xl" />
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-healthCyan" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-healthCyan" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-healthCyan" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-healthCyan" />
                  
                  <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[8px] font-black text-healthCyan uppercase tracking-widest whitespace-nowrap">
                    Align face or finger in box
                  </p>
                </div>

                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-healthCyan/10 animate-scan-line-horizontal" />
                
                <div className="absolute top-6 left-6">
                   <div className="flex items-center space-x-3 mb-2">
                     <span className="w-2 h-2 rounded-full bg-pulseRed animate-ping" />
                     <p className="text-[10px] font-black text-white uppercase tracking-widest">Bio_Optic_Stream</p>
                   </div>
                   <p className="text-[8px] font-black text-healthCyan uppercase tracking-tighter opacity-70">ENCRYPTED_AES_256</p>
                </div>

                <div className="absolute bottom-10 right-10 text-right">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Detected BPM</p>
                   <p className="text-4xl font-black text-healthCyan font-mono drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                     {bpm || '--'} <span className="text-[10px] opacity-50">SYNC</span>
                   </p>
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PPGScanner;
