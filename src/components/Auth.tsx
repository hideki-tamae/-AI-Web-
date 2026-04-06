import React from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_50px_-12px_rgba(34,211,238,0.3)]">
            <ShieldCheck className="w-10 h-10 text-cyan-400" />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Civilization OS</h1>
            <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Authorized Personnel Only</p>
          </div>

          <div className="w-full h-px bg-slate-800" />

          <button 
            onClick={onLogin}
            className="w-full group flex items-center justify-center gap-3 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-[0.98]"
          >
            <LogIn className="w-5 h-5" />
            <span>Initialize System</span>
          </button>

          <p className="text-[10px] font-mono text-slate-600 text-center uppercase tracking-tighter">
            By initializing, you agree to the planetary governance protocols.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
