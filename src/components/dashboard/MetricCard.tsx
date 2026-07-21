import React from 'react';
import { cn } from '../../utils/cn';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  colorClass?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, colorClass }) => {
  // Determine accent color based on title
  let accentColor = 'border-emerald-500/20';
  let valueColor = 'text-white';
  
  if (typeof title === 'string') {
    if (title.toLowerCase().includes('critical')) {
      accentColor = 'border-red-500/30';
      valueColor = 'text-red-400';
    } else if (title.toLowerCase().includes('high')) {
      accentColor = 'border-orange-500/30';
      valueColor = 'text-orange-400';
    } else if (title.toLowerCase().includes('contained')) {
      accentColor = 'border-emerald-500/30';
      valueColor = 'text-emerald-400';
    } else if (title.toLowerCase().includes('active')) {
      accentColor = 'border-cyan-500/30';
      valueColor = 'text-cyan-400';
    }
  }

  return (
    <div className={cn(
      "p-4 rounded-2xl border backdrop-blur-xl bg-[#05130e]/80 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 group",
      accentColor
    )}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-xl text-emerald-400 group-hover:scale-110 transition-transform">{icon}</div>}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider truncate">{title}</p>
          <p className={cn("text-xl font-black mt-0.5 truncate", valueColor)}>{value}</p>
        </div>
      </div>
    </div>
  );
};
