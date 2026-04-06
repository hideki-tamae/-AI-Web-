import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Population } from '../types';

interface PopulationChartProps {
  population: Population;
  history: { time: string; total: number }[];
}

export const PopulationChart: React.FC<PopulationChartProps> = ({ population, history }) => {
  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Demographics</span>
          <h2 className="text-2xl font-bold text-slate-100">Population Overview</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono uppercase text-slate-500">Total</span>
            <span className="text-xl font-mono font-bold text-cyan-400">{population.total.toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono uppercase text-slate-500">Growth Rate</span>
            <span className="text-xl font-mono font-bold text-emerald-400">+{population.growthRate}%</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono uppercase text-slate-500">Happiness</span>
            <span className="text-xl font-mono font-bold text-amber-400">{population.happiness}%</span>
          </div>
        </div>
      </div>

      <div className="h-[240px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => val.split(':')[0] + 'h'}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => (val / 1000).toFixed(1) + 'k'}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#22d3ee" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTotal)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
