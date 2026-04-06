import React from 'react';
import { FlaskConical, CheckCircle2, PlayCircle } from 'lucide-react';
import { ResearchItem } from '../types';
import { cn } from '../lib/utils';

interface ResearchPanelProps {
  research: ResearchItem[];
  onStartResearch: (id: string) => void;
}

export const ResearchPanel: React.FC<ResearchPanelProps> = ({ research = [], onStartResearch }) => {
  const activeResearch = (research || []).filter(r => r.progress > 0 && r.progress < 100);
  const completedResearch = (research || []).filter(r => r.isCompleted);
  const availableResearch = (research || []).filter(r => !r.isCompleted && r.progress === 0);

  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Technological Advancement</span>
          <h2 className="text-2xl font-bold text-slate-100">Research & Development</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full">
          <FlaskConical className="w-3 h-3 text-rose-400" />
          <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">Active Lab</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {activeResearch.length > 0 && (
          <div className="col-span-full space-y-4">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Active Projects</h3>
            {activeResearch.map(item => (
              <div key={item.id} className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-200">{item.name}</span>
                  <span className="text-xs font-mono text-cyan-400">{item.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 transition-all duration-500" 
                    style={{ width: `${item.progress}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Available Research</h3>
          <div className="space-y-2">
            {availableResearch.map(item => (
              <button 
                key={item.id}
                onClick={() => onStartResearch(item.id)}
                className="w-full group flex items-center justify-between p-3 bg-slate-800/20 border border-slate-800 hover:border-slate-700 rounded-lg transition-all"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{item.name}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Cost: {item.cost} Knowledge</span>
                </div>
                <PlayCircle className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Completed</h3>
          <div className="space-y-2">
            {completedResearch.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <span className="text-sm font-medium text-slate-400">{item.name}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
