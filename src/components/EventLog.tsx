import React from 'react';
import { Terminal, Info, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import { SystemEvent } from '../types';
import { cn } from '../lib/utils';

interface EventLogProps {
  events: SystemEvent[];
}

export const EventLog: React.FC<EventLogProps> = ({ events = [] }) => {
  const getIcon = (type: SystemEvent['type']) => {
    switch (type) {
      case 'info': return Info;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      case 'success': return CheckCircle2;
      default: return Info;
    }
  };

  const getColor = (type: SystemEvent['type']) => {
    switch (type) {
      case 'info': return 'text-cyan-400';
      case 'warning': return 'text-amber-400';
      case 'error': return 'text-rose-400';
      case 'success': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  const getBg = (type: SystemEvent['type']) => {
    switch (type) {
      case 'info': return 'bg-cyan-400/10 border-cyan-400/20';
      case 'warning': return 'bg-amber-400/10 border-amber-400/20';
      case 'error': return 'bg-rose-400/10 border-rose-400/20';
      case 'success': return 'bg-emerald-400/10 border-emerald-400/20';
      default: return 'bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-sm h-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500">System Logs</span>
          <h2 className="text-2xl font-bold text-slate-100">Event History</h2>
        </div>
        <Terminal className="w-5 h-5 text-slate-600" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar mt-4">
        {(!events || events.length === 0) ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 font-mono text-xs">
            <span className="animate-pulse">Waiting for system events...</span>
          </div>
        ) : (
          events.map((event) => {
            const Icon = getIcon(event.type);
            return (
              <div 
                key={event.id} 
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all hover:translate-x-1",
                  getBg(event.type)
                )}
              >
                <Icon className={cn("w-4 h-4 mt-0.5", getColor(event.type))} />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-200">{event.message}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
