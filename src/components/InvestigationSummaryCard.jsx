import React from 'react';
import { Activity, CheckCircle, AlertTriangle, AlertOctagon, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Investigation Summary Card
 * Props:
 *   incident: {
 *     incident_id: string,
 *     attack_name?: string,
 *     attack_description?: string,
 *     attack_stage?: string,
 *     risk_level?: string,
 *     evidence?: string[],
 *     recommended_actions?: string[],
 *     timeline?: Array<{time:string, event_type:string, description:string}>,
 *   }
 */
export default function InvestigationSummaryCard({ incident }) {
  const {
    incident_id,
    attack_name,
    attack_description,
    attack_stage,
    risk_level,
    evidence = [],
    recommended_actions = [],
    timeline = [],
  } = incident || {};

  // Color mapping for risk level
  const riskColors = {
    Low: 'bg-status-safe/10 text-status-safe border-status-safe/20',
    Medium: 'bg-status-high/10 text-status-high border-status-high/20',
    High: 'bg-status-critical/10 text-status-critical border-status-critical/20',
    Critical: 'bg-status-critical/10 text-status-critical border-status-critical/20',
  };

  return (
    <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg mb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={cn(
              "px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-md",
              riskColors[risk_level] || riskColors['Low']
            )}>
              {risk_level || 'Low'}
            </span>
            <span className="text-sm font-medium text-slate-400">{incident_id}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{attack_name || 'Unknown Attack'}</h1>
          <p className="text-sm text-slate-300 mb-4">{attack_description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-4 h-4" /> Stage: {attack_stage || 'N/A'}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-cyber-blue hover:bg-cyber-blue/80 text-white text-sm font-medium rounded-lg transition-colors">
            Take Action
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Timeline */}
      {timeline.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyber-cyan" /> Attack Timeline
          </h2>
          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
            {timeline.map((ev, idx) => (
              <div key={idx} className="relative">
                <div
                  className={cn(
                    "absolute -left-[29px] w-3 h-3 rounded-full border-2 border-cyber-card",
                    ev.event_type.includes('Failed') ? 'bg-status-high' :
                      ev.event_type.includes('Unknown') ? 'bg-status-critical' :
                      ev.event_type.includes('Sensitive') ? 'bg-status-critical' :
                      ev.event_type.includes('Large') ? 'bg-status-critical' :
                      'bg-status-safe'
                  )}
                ></div>
                <p className="text-xs font-bold text-slate-400 mb-1">{ev.time}</p>
                <p className="text-sm text-slate-200">{ev.event_type}: {ev.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence */}
      {evidence.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" /> Key Evidence
          </h2>
          <ul className="space-y-2">
            {evidence.map((ev, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
                <span>{ev.replace('✓ ', '')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Actions */}
      {recommended_actions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-white mb-4">Recommended Actions</h2>
          <div className="space-y-3">
            {recommended_actions.map((act, i) => (
              <label
                key={i}
                className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-800/50 transition-colors"
              >
                <input type="checkbox" className="mt-1 accent-cyber-cyan" defaultChecked />
                <div>
                  <p className="text-sm font-semibold text-white">{act}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
