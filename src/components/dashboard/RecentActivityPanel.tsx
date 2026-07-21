import React from 'react';
import { Clock } from 'lucide-react';

interface RecentActivityPanelProps {
  events: any[];
}

export const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({ events }) => {
  return (
    <div className="bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-5 shadow-2xl">
      <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
        <Clock className="w-4 h-4 text-emerald-400" />
        Live Activity Log
      </h2>
      <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {events.map((event, idx) => {
          const timestamp = event.timestamp || event.login_time || new Date().toISOString();
          const desc = event.description || event.event_type || 'Event Logged';
          const timeStr = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          return (
            <div key={idx} className="p-3 bg-[#030d09] border border-emerald-500/10 rounded-xl flex flex-col gap-1.5 transition-all hover:bg-emerald-950/20">
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span className="font-bold text-emerald-400/70">{event.source || 'SENSOR'}</span>
                <span className="font-mono">{timeStr}</span>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">{desc}</p>
            </div>
          );
        })}
        {events.length === 0 && (
          <p className="text-xs text-slate-500 text-center py-6">No recent activities.</p>
        )}
      </div>
    </div>
  );
};
