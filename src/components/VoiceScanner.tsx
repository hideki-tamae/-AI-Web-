import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { db, doc, updateDoc, getDoc } from '../firebase';
import { CivilizationState, CareLog, SystemEvent } from '../types';

interface VoiceScannerProps {
  userId: string;
}

export const VoiceScanner: React.FC<VoiceScannerProps> = ({ userId }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ score: number; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => {
          const next = p + Math.random() * 15;
          return next > 100 ? 100 : next;
        });
      }, 500);
    } else if (isScanning && progress >= 100) {
      setIsScanning(false);
      completeScan();
    }
    return () => clearInterval(interval);
  }, [isScanning, progress]);

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setResult(null);
    setError(null);
  };

  const completeScan = async () => {
    try {
      const score = Math.floor(Math.random() * 30) + 70; // 70-100
      const energyBoost = Math.floor(score * 2.5);
      
      const docRef = doc(db, 'civilizations', userId);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        throw new Error("Civilization data not found.");
      }

      const state = snapshot.data() as CivilizationState;
      
      const newCareLog: CareLog = {
        id: `voice-${Date.now()}`,
        timestamp: Date.now(),
        category: 'health',
        value: score,
        description: `HAIS Voice Resonance Scan: ${score}% coherence.`
      };

      const newEvent: SystemEvent = {
        id: `evt-${Date.now()}`,
        timestamp: Date.now(),
        message: `Voice scan completed. +${energyBoost} Energy.`,
        type: 'success'
      };

      await updateDoc(docRef, {
        resources: {
          ...state.resources,
          energy: state.resources.energy + energyBoost
        },
        careLogs: [...(state.careLogs || []), newCareLog].slice(-50),
        events: [newEvent, ...(state.events || [])].slice(0, 20),
        lastUpdate: Date.now()
      });

      setResult({
        score,
        message: `Resonance optimal. Energy increased by ${energyBoost}.`
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to sync scan results.");
    }
  };

  return (
    <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Mic className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">HAIS Voice Analysis</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase">Neural Resonance Scanner</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        <AnimatePresence mode="wait">
          {!isScanning && !result && !error && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={startScan}
              className="relative group w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 hover:border-cyan-500/50 transition-all"
            >
              <div className="absolute inset-0 rounded-full bg-cyan-500/10 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out opacity-0 group-hover:opacity-100" />
              <Mic className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </motion.button>
          )}

          {isScanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-6 w-full"
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400"
                />
                <Activity className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
              
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-cyan-400 uppercase">
                  <span>Analyzing Frequencies</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {result && !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <div className="text-3xl font-mono text-emerald-400 mb-1">{result.score}%</div>
                <p className="text-xs text-slate-400">{result.message}</p>
              </div>
              <button 
                onClick={() => setResult(null)}
                className="mt-2 text-[10px] font-mono text-slate-500 hover:text-slate-300 uppercase tracking-widest"
              >
                Scan Again
              </button>
            </motion.div>
          )}

          {error && !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/30">
                <XCircle className="w-8 h-8 text-rose-400" />
              </div>
              <p className="text-xs text-rose-400">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-[10px] font-mono text-slate-500 hover:text-slate-300 uppercase tracking-widest"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
