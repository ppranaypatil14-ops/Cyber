import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, AlertTriangle, FileText, Monitor, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Incident {
  id: string;
  title: string;
  risk: number;
  status: string;
  timeline: { time: string; desc: string; type: string }[];
  summary: string;
  assets: { name: string; type: string; status: string }[];
  evidence: string[];
}

export default function AttackInvestigation() {
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to fetch incident details
    const fetchIncident = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const isContained = localStorage.getItem('simulated_contained') === 'true';

        let timeline = [
          { time: '10:01 AM', desc: 'Multiple failed login attempts detected', type: 'warning' },
          { time: '10:03 AM', desc: 'Successful login from an unknown device', type: 'danger' },
          { time: '10:05 AM', desc: 'Sensitive database accessed', type: 'danger' },
          { time: '10:07 AM', desc: 'Large data transfer initiated', type: 'danger' },
          { time: '10:08 AM', desc: 'AI detected account compromise', type: 'ai' },
          { time: '10:09 AM', desc: 'Data exfiltration predicted', type: 'ai' },
          { time: '10:10 AM', desc: 'Account temporarily locked', type: 'success' },
        ];

        if (isContained) {
          timeline = [
            ...timeline,
            { time: '10:10 AM', desc: 'AI Response Started', type: 'ai' },
            { time: '10:10 AM', desc: 'Account Locked', type: 'success' },
            { time: '10:10 AM', desc: 'Unknown Device Blocked', type: 'success' },
            { time: '10:11 AM', desc: 'Password Reset', type: 'success' },
            { time: '10:11 AM', desc: 'Security Team Notified', type: 'success' },
            { time: '10:11 AM', desc: 'Forensic Snapshot Created', type: 'success' },
            { time: '10:11 AM', desc: 'Continuous Monitoring Enabled', type: 'success' },
            { time: '10:12 AM', desc: 'Incident Successfully Contained', type: 'success' }
          ];
        }

        const summary = "Based on behavioral analysis, a malicious actor successfully brute-forced Employee-021's credentials after multiple failed attempts. The actor then accessed the network from a previously unknown device, immediately pivoted to Server-DB-04, and initiated a large data transfer. The AI engine detected this anomalous sequence and flagged a high probability (87%) of data exfiltration. Automated containment locked the account at 10:10 AM." + (isContained ? "\n\nThe automated incident response workflow successfully contained the attack. Immediate threats have been mitigated. The incident is now ready for analyst review." : "");

        setIncident({
          id: 'INC-2026-0042',
          title: 'Possible Account Compromise',
          risk: 94,
          status: isContained ? 'Contained' : 'Active Investigation',
          timeline,
          summary,
          assets: [
            { name: 'Employee-021', type: 'User Account', status: 'Locked' },
            { name: 'Server-DB-04', type: 'Database Server', status: isContained ? 'Secured' : 'At Risk' }
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

    const handleSimulatedContained = () => {
      fetchIncident();
    };
    window.addEventListener('simulated_contained', handleSimulatedContained);
    return () => window.removeEventListener('simulated_contained', handleSimulatedContained);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading Investigation...</p>
        </div>
      </div>
    );
  }

  if (!incident) return null;

  const handleTakeAction = () => {
    if (!incident) return;
    
    const contextData = {
      type: "incident_handoff",
      incident: {
        id: incident.id,
        employeeId: incident.assets.find(a => a.type === 'User Account')?.name || 'Unknown',
        severity: 'Critical',
        riskScore: incident.risk,
        attackName: incident.title,
        status: incident.status,
        timeline: incident.timeline,
        evidence: incident.evidence,
        summary: incident.summary
      }
    };

    localStorage.setItem('copilot_initial_prompt', JSON.stringify(contextData));
    navigate('/dashboard/copilot');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {incident.status === 'Contained' ? (
                <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  ✓ Contained
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-red-500/15 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  Critical
                </span>
              )}
              <span className="text-xs font-mono text-slate-500">{incident.id}</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-2">{incident.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Risk: <strong className="text-white">{incident.risk}%</strong>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Activity className="w-4 h-4 text-emerald-400" />
                Status: <span className={incident.status === 'Contained' ? 'text-emerald-400 font-bold' : 'text-white font-bold'}>{incident.status}</span>
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleTakeAction}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2"
            >
              Take Action
            </button>
            <button className="px-5 py-2.5 bg-[#030d09] hover:bg-emerald-900/20 text-slate-300 text-xs font-bold rounded-xl transition-all border border-emerald-500/20">
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-6 shadow-2xl h-full">
            <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-emerald-400" />
              Attack Timeline
            </h2>
            <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-emerald-500/10 h-[500px] overflow-y-auto custom-scrollbar pr-4">
              {incident.timeline.map((event, idx) => (
                <div key={idx} className={cn("relative", incident.status === 'Contained' && idx >= 7 ? "animate-in slide-in-from-left-4 fade-in duration-500" : "")} style={{ animationDelay: `${(idx - 7) * 100}ms` }}>
                  <div className={cn(
                    "absolute -left-[29px] w-3 h-3 rounded-full border-2 border-[#05130e]",
                    event.type === 'danger' ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]" : 
                    event.type === 'warning' ? "bg-orange-500" :
                    event.type === 'ai' ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" :
                    "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]"
                  )}></div>
                  <p className="text-[10px] font-bold text-slate-500 mb-0.5 uppercase tracking-wider">{event.time}</p>
                  <p className="text-xs text-slate-200 font-medium">{event.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              AI Investigation Summary
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{incident.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-5 shadow-2xl">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Monitor className="w-4 h-4 text-emerald-400" />
                Affected Assets
              </h2>
              <div className="space-y-3">
                {incident.assets.map((asset, i) => (
                  <div key={i} className="p-3 bg-[#030d09] rounded-xl border border-emerald-500/10 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">{asset.name}</p>
                      <p className="text-[10px] text-slate-500">{asset.type}</p>
                    </div>
                    <span className={cn("px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider", 
                      asset.status === 'Secured' ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" :
                      "bg-red-500/15 text-red-400 border border-red-500/20"
                    )}>{asset.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-5 shadow-2xl">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-emerald-400" />
                Key Evidence
              </h2>
              <ul className="space-y-2">
                {incident.evidence.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300 p-2 bg-[#030d09] border border-emerald-500/10 rounded-xl">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
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
