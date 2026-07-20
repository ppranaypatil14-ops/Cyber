import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  colorClass?: string; // tailwind background color class for card
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, colorClass = 'bg-cyber-card' }) => {
  return (
    <div className={`flex items-center p-4 rounded-xl shadow-lg backdrop-blur-sm ${colorClass} text-white`}>
      {icon && <div className="mr-3 text-2xl">{icon}</div>}
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
};
