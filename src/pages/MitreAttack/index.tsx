import { ShieldAlert, Crosshair, Network, ArrowRight, ShieldCheck, Database, Key, Activity } from 'lucide-react';
import { cn } from '../../utils/cn';

const attackStages = [
  {
    id: 1,
    title: 'Initial Access',
    status: 'Detected',
    desc: 'Adversaries trying to get into your network.',
    icon: Crosshair,
    color: 'border-status-critical text-status-critical bg-status-critical/10'
  },
  {
    id: 2,
    title: 'Credential Access',
    status: 'Detected',
    desc: 'Stealing account names and passwords.',
    icon: Key,
    color: 'border-status-critical text-status-critical bg-status-critical/10'
  },
  {
    id: 3,
    title: 'Sensitive Data Access',
    status: 'Current Stage',
    desc: 'Accessing critical databases and files.',
    icon: Database,
    color: 'border-status-high text-status-high bg-status-high/10',
    isActive: true
  },
  {
    id: 4,
    title: 'Lateral Movement',
    status: 'Possible',
    desc: 'Moving through your environment.',
    icon: Network,
    color: 'border-slate-700 text-slate-400 bg-cyber-darker'
  },
  {
    id: 5,
    title: 'Data Exfiltration',
    status: 'AI Predicted',
    desc: 'Stealing data from your network.',
    icon: ShieldAlert,
    color: 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
  }
];

export default function MitreAttack() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="border-b border-cyber-card pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">MITRE ATT&CK Visualization</h1>
        <p className="text-slate-400 text-sm">Real-time threat mapping of INC-2026-0042 to the MITRE ATT&CK framework.</p>
      </div>

      <div className="bg-cyber-card border border-slate-800 rounded-xl p-8 shadow-lg overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Horizontal Attack Path */}
          <div className="flex items-center justify-between relative mb-12">
            
            {/* Connecting Line */}
            <div className="absolute left-[5%] right-[5%] top-1/2 -translate-y-1/2 h-1 bg-slate-800 z-0">
              <div className="h-full bg-gradient-to-r from-status-critical via-status-high to-transparent w-1/2"></div>
            </div>

            {attackStages.map((stage, idx) => (
              <div key={stage.id} className="relative z-10 flex flex-col items-center w-40">
                <div className={cn(
                  "w-16 h-16 rounded-full border-2 flex items-center justify-center bg-cyber-darker mb-4 transition-all duration-300",
                  stage.color,
                  stage.isActive && "scale-110 shadow-lg shadow-status-high/20"
                )}>
                  <stage.icon className="w-6 h-6" />
                </div>
                
                <h3 className="font-bold text-white text-center text-sm mb-2">{stage.title}</h3>
                
                <span className={cn(
                  "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full",
                  stage.status === 'Detected' && "bg-status-critical text-white",
                  stage.status === 'Current Stage' && "bg-status-high text-white animate-pulse",
                  stage.status === 'Possible' && "bg-slate-700 text-slate-300",
                  stage.status === 'AI Predicted' && "bg-cyber-cyan text-cyber-darker"
                )}>
                  {stage.status}
                </span>
              </div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-5 gap-4">
            {attackStages.map((stage) => (
              <div key={stage.id} className="bg-cyber-darker border border-slate-800 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-400">{stage.desc}</p>
                {stage.status === 'Detected' && (
                  <div className="mt-3 text-xs text-status-critical flex justify-center items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Evidence Found
                  </div>
                )}
                {stage.status === 'Current Stage' && (
                  <div className="mt-3 text-xs text-status-high flex justify-center items-center gap-1">
                    <Activity className="w-3 h-3" /> Active Now
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
