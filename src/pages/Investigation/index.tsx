import { ShieldAlert, Activity, Clock, CheckCircle2, AlertTriangle, FileText, Monitor, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const timeline = [
  { time: '10:01 AM', desc: 'Multiple failed login attempts detected', type: 'warning' },
  { time: '10:03 AM', desc: 'Successful login from an unknown device', type: 'danger' },
  { time: '10:05 AM', desc: 'Sensitive database accessed', type: 'danger' },
  { time: '10:07 AM', desc: 'Large data transfer initiated', type: 'danger' },
  { time: '10:08 AM', desc: 'AI detected account compromise', type: 'ai' },
  { time: '10:09 AM', desc: 'Data exfiltration predicted', type: 'ai' },
  { time: '10:10 AM', desc: 'Account temporarily locked', type: 'success' },
];

export default function AttackInvestigation() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 bg-status-critical/10 text-status-critical border border-status-critical/20 rounded-md text-xs font-semibold uppercase tracking-wider">
                Critical
              </span>
              <span className="text-sm font-medium text-slate-400">INC-2026-0042</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Possible Account Compromise</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-slate-400">
                <AlertTriangle className="w-4 h-4 text-status-critical" />
                Risk: 94%
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Activity className="w-4 h-4 text-cyber-cyan" />
                Status: Active Investigation
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg h-full">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyber-cyan" />
              Attack Timeline
            </h2>
            
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
              {timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <div className={cn(
                    "absolute -left-[29px] w-3 h-3 rounded-full border-2 border-cyber-card",
                    event.type === 'danger' ? "bg-status-critical" : 
                    event.type === 'warning' ? "bg-status-high" :
                    event.type === 'ai' ? "bg-cyber-cyan shadow-[0_0_8px_rgba(6,182,212,0.6)]" :
                    "bg-status-safe"
                  )}></div>
                  <p className="text-xs font-bold text-slate-400 mb-1">{event.time}</p>
                  <p className="text-sm text-slate-200">{event.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Investigation Summary */}
          <div className="bg-cyber-blue/10 border border-cyber-blue/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-cyber-cyan mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              AI Investigation Summary
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Based on behavioral analysis, a malicious actor successfully brute-forced <strong>Employee-021</strong>'s credentials after multiple failed attempts. The actor then accessed the network from a previously unknown device, immediately pivoted to <strong>Server-DB-04</strong>, and initiated a large data transfer. The AI engine detected this anomalous sequence and flagged a high probability (87%) of data exfiltration. Automated containment locked the account at 10:10 AM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Affected Assets */}
            <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-slate-400" />
                Affected Assets
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-cyber-darker rounded-lg border border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-white">Employee-021</p>
                    <p className="text-xs text-slate-400">User Account</p>
                  </div>
                  <span className="px-2 py-1 bg-status-critical/10 text-status-critical text-xs font-medium rounded">Locked</span>
                </div>
                <div className="p-3 bg-cyber-darker rounded-lg border border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-white">Server-DB-04</p>
                    <p className="text-xs text-slate-400">Database Server</p>
                  </div>
                  <span className="px-2 py-1 bg-status-high/10 text-status-high text-xs font-medium rounded">At Risk</span>
                </div>
              </div>
            </div>

            {/* Evidence */}
            <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                Key Evidence
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <ChevronRight className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
                  <span>15 failed logins from IP 192.168.1.45</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <ChevronRight className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
                  <span>Unrecognized device fingerprint (Windows 11)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <ChevronRight className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
                  <span>Database query: <code className="bg-cyber-darker px-1 rounded text-xs text-status-high">SELECT * FROM users</code></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-4">Recommended Actions</h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-800/50 transition-colors">
                <input type="checkbox" className="mt-1 accent-cyber-cyan" defaultChecked />
                <div>
                  <p className="text-sm font-semibold text-white">Isolate Server-DB-04</p>
                  <p className="text-xs text-slate-400">Temporarily block external network access to the database server to prevent further exfiltration.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-800/50 transition-colors">
                <input type="checkbox" className="mt-1 accent-cyber-cyan" />
                <div>
                  <p className="text-sm font-semibold text-white">Initiate Password Reset</p>
                  <p className="text-xs text-slate-400">Force password reset for Employee-021 upon next login.</p>
                </div>
              </label>
              <div className="pt-3">
                <button className="px-4 py-2 bg-cyber-blue hover:bg-cyber-blue/80 text-white text-sm font-medium rounded-lg transition-colors">
                  Execute Selected Actions
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
