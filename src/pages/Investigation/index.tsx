import { useState, useEffect } from 'react';
import { Activity, Clock, AlertTriangle, FileText, Monitor, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function AttackInvestigation() {
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to fetch incident details
    const fetchIncident = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setIncident({
          id: 'INC-2026-0042',
          title: 'Possible Account Compromise',
          risk: 94,
          status: 'Active Investigation',
          timeline: [
            { time: '10:01 AM', desc: 'Multiple failed login attempts detected', type: 'warning' },
            { time: '10:03 AM', desc: 'Successful login from an unknown device', type: 'danger' },
            { time: '10:05 AM', desc: 'Sensitive database accessed', type: 'danger' },
            { time: '10:07 AM', desc: 'Large data transfer initiated', type: 'danger' },
            { time: '10:08 AM', desc: 'AI detected account compromise', type: 'ai' },
            { time: '10:09 AM', desc: 'Data exfiltration predicted', type: 'ai' },
            { time: '10:10 AM', desc: 'Account temporarily locked', type: 'success' },
          ],
          summary: "Based on behavioral analysis, a malicious actor successfully brute-forced Employee-021's credentials after multiple failed attempts. The actor then accessed the network from a previously unknown device, immediately pivoted to Server-DB-04, and initiated a large data transfer. The AI engine detected this anomalous sequence and flagged a high probability (87%) of data exfiltration. Automated containment locked the account at 10:10 AM.",
          assets: [
            { name: 'Employee-021', type: 'User Account', status: 'Locked' },
            { name: 'Server-DB-04', type: 'Database Server', status: 'At Risk' }
          ],
          evidence: [
            '15 failed logins from IP 192.168.1.45',
            'Unrecognized device fingerprint (Windows 11)',
            'Database query: SELECT * FROM users'
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin" />
      </div>
    );
  }

  if (!incident) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 bg-status-critical/10 text-status-critical border border-status-critical/20 rounded-md text-xs font-semibold uppercase tracking-wider">
                Critical
              </span>
              <span className="text-sm font-medium text-slate-400">{incident.id}</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{incident.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-slate-400">
                <AlertTriangle className="w-4 h-4 text-status-critical" />
                Risk: {incident.risk}%
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Activity className="w-4 h-4 text-cyber-cyan" />
                Status: {incident.status}
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
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg h-full">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyber-cyan" />
              Attack Timeline
            </h2>
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
              {incident.timeline.map((event, idx) => (
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

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-cyber-blue/10 border border-cyber-blue/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-cyber-cyan mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              AI Investigation Summary
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">{incident.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-slate-400" />
                Affected Assets
              </h2>
              <div className="space-y-3">
                {incident.assets.map((asset, i) => (
                  <div key={i} className="p-3 bg-cyber-darker rounded-lg border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-white">{asset.name}</p>
                      <p className="text-xs text-slate-400">{asset.type}</p>
                    </div>
                    <span className="px-2 py-1 bg-status-critical/10 text-status-critical text-xs font-medium rounded">{asset.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                Key Evidence
              </h2>
              <ul className="space-y-2">
                {incident.evidence.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
