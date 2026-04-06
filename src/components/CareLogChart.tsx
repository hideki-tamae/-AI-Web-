import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CareLog } from '../types';
import { Heart, Activity } from 'lucide-react';

interface CareLogChartProps {
  logs: CareLog[];
}

export const CareLogChart: React.FC<CareLogChartProps> = ({ logs = [] }) => {
  // Aggregate data for the chart (last 10 entries)
  const chartData = (logs || []).slice(-10).map(log => ({
    time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: log.value,
    category: log.category,
    description: log.description
  }));

  const getCategoryColor = (category: CareLog['category']) => {
    switch (category) {
      case 'health': return '#f43f5e'; // rose-500
      case 'education': return '#3b82f6'; // blue-500
      case 'social': return '#8b5cf6'; // violet-500
      case 'environment': return '#10b981'; // emerald-500
      default: return '#64748b';
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500">HAIS Integration</span>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            Care Economy Log
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
          <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Live HAIS Feed</span>
        </div>
      </div>

      <div className="h-[200px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
              cursor={{ fill: '#1e293b', opacity: 0.4 }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category as CareLog['category'])} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
        {['health', 'education', 'social', 'environment'].map((cat) => (
          <div key={cat} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryColor(cat as CareLog['category']) }} />
            <span className="text-[10px] font-mono uppercase text-slate-500">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
