import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface ChartsPanelProps {
  incidents: any[];
  events: any[];
}

export const ChartsPanel: React.FC<ChartsPanelProps> = ({ incidents }) => {
  // Let's generate chart data based on severity
  const data = [
    { name: 'Critical', count: incidents.filter(i => i.severity === 'Critical').length },
    { name: 'High', count: incidents.filter(i => i.severity === 'High').length },
    { name: 'Medium', count: incidents.filter(i => i.severity === 'Medium').length },
    { name: 'Low', count: incidents.filter(i => i.severity === 'Low').length },
  ];

  return (
    <div className="bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-5 shadow-2xl">
      <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
        <BarChart3 className="w-4 h-4 text-emerald-400" />
        Threat Matrix Breakdown
      </h2>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
            <Tooltip 
              contentStyle={{ background: '#030d09', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}
              labelStyle={{ color: '#10b981', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
