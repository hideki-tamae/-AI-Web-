import React from 'react';
import { Zap, Utensils, Box, BookOpen } from 'lucide-react';
import { Resources } from '../types';
import { cn } from '../lib/utils';

interface ResourceBarProps {
  resources: Resources;
}

export const ResourceBar: React.FC<ResourceBarProps> = ({ resources }) => {
  const items = [
    { label: 'Energy', value: resources.energy, icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Food', value: resources.food, icon: Utensils, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Materials', value: resources.materials, icon: Box, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Knowledge', value: resources.knowledge, icon: BookOpen, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ];

  return (
    <div className="flex items-center gap-4 p-4 bg-slate-950/50 border-b border-slate-800 backdrop-blur-md">
      <div className="flex items-center gap-2 mr-8">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
          <div className="w-4 h-4 rounded-full bg-cyan-500 animate-pulse" />
        </div>
        <span className="font-mono text-sm font-bold tracking-widest text-slate-400 uppercase">Civilization OS v1.0</span>
      </div>
      
      <div className="flex-1 flex items-center justify-center gap-8">
        {items.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg border border-slate-800", bg)}>
              <Icon className={cn("w-4 h-4", color)} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-tighter text-slate-500">{label}</span>
              <span className="font-mono text-lg font-bold text-slate-200">{value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono uppercase tracking-tighter text-slate-500">System Status</span>
          <span className="text-xs font-mono text-emerald-400 uppercase">Optimal</span>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        </div>
      </div>
    </div>
  );
};
