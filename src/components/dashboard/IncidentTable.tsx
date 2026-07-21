import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Activity, Eye } from 'lucide-react';
import { cn } from '../../utils/cn';

interface IncidentTableProps {
  incidents: any[];
}

export const IncidentTable: React.FC<IncidentTableProps> = ({ incidents }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-emerald-500/10 bg-[#030d09] flex justify-between items-center">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Correlated Incidents</h2>
        <span className="text-[10px] text-emerald-400 font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          {incidents.length} Detected
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#030d09]/50 text-slate-400 border-b border-emerald-500/10">
            <tr>
              <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Incident ID</th>
              <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Attack Vector</th>
              <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Severity</th>
              <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Risk</th>
              <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-500/5">
            {incidents.map((incident) => {
              const id = incident.incident_id || incident.id || 'INC-2026-0000';
              const name = incident.attack_name || incident.title || 'Unknown Threat';
              const risk = incident.risk_score || incident.risk || 0;
              return (
                <tr key={id} className="hover:bg-emerald-900/10 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-300 font-bold">{id}</td>
                  <td className="px-6 py-4 text-xs font-bold text-white">{name}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                      incident.severity === 'Critical' ? "bg-red-500/15 text-red-400 border-red-500/20" :
                      incident.severity === 'High' ? "bg-orange-500/15 text-orange-400 border-orange-500/20" :
                      incident.severity === 'Medium' ? "bg-amber-500/15 text-amber-400 border-amber-500/20" :
                      "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                    )}>
                      {incident.severity || 'Low'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("font-bold text-xs", risk > 80 ? "text-red-400" : risk > 50 ? "text-orange-400" : "text-emerald-400")}>
                      {risk}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-300">
                      {incident.status === 'Contained' ? (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                      )}
                      {incident.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate('/dashboard/investigation')}
                      className="p-1 bg-[#030d09] border border-emerald-500/20 hover:border-emerald-400 rounded-lg text-slate-400 hover:text-white transition-all inline-flex items-center justify-center"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
