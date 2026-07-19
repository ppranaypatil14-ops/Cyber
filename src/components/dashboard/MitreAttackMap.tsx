import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoorOpen, Key, Monitor, Database, ShieldAlert, Crosshair, ShieldCheck, ArrowRight, Sparkles, Terminal, Globe, Clock, UserCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

type ForensicData = {
  time: string;
  ip: string;
  target: string;
  evidence: string;
  details: string;
};

type AttackStage = {
  id: string;
  name: string;
  icon: any;
  mitreId: string;
  desc: string;
  forensics: ForensicData;
};

const STAGES: AttackStage[] = [
  { 
    id: 'initial_access', 
    name: 'Initial Break-In', 
    icon: DoorOpen, 
    mitreId: 'TA0001', 
    desc: 'The hacker found a way into the network.',
    forensics: {
      time: '14:32:05',
      ip: 'Unknown Location (Russia)',
      target: 'Employee Laptop',
      evidence: 'Fake Invoice Email Opened',
      details: 'An employee received a fake email that looked like an urgent invoice. When they clicked the link, it secretly installed a hidden program that gave the hacker access to their laptop.'
    }
  },
  { 
    id: 'credential_access', 
    name: 'Stealing Passwords', 
    icon: Key, 
    mitreId: 'TA0006', 
    desc: 'The hacker tried to steal saved passwords.',
    forensics: {
      time: '14:45:12',
      ip: 'Internal Network',
      target: 'Windows Security System',
      evidence: 'Suspicious Password Request',
      details: 'Once inside the laptop, the hacker used a tool to search the computer\'s memory for saved passwords. They were trying to find an Administrator password to get more control.'
    }
  },
  { 
    id: 'system_access', 
    name: 'Spreading the Attack', 
    icon: Monitor, 
    mitreId: 'TA0008', 
    desc: 'The hacker moved to other computers.',
    forensics: {
      time: '15:10:44',
      ip: 'Employee Laptop -> Database Server',
      target: 'Main Company Database',
      evidence: 'Admin Login Detected',
      details: 'Using the passwords they just stole, the hacker logged into the main company database. They are now moving freely between computers like a normal employee would.'
    }
  },
  { 
    id: 'exfiltration', 
    name: 'Stealing Data', 
    icon: Database, 
    mitreId: 'TA0010', 
    desc: 'Data is being sent outside the company.',
    forensics: {
      time: '15:22:01',
      ip: 'Database Server -> Outside Internet',
      target: 'Customer Records Folder',
      evidence: '2.4 GB Uploaded',
      details: 'The hacker packed up a large amount of sensitive customer data and secretly uploaded it to a server they control on the outside internet.'
    }
  },
];

type ThreatStatus = 'idle' | 'detected' | 'prevented' | 'predicted';

type ActiveThreat = {
  id: string;
  currentStageIdx: number;
  statuses: ThreatStatus[];
};

export default function MitreAttackMap() {
  const navigate = useNavigate();
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [threat, setThreat] = useState<ActiveThreat>({
    id: 'SIM-001',
    currentStageIdx: 0,
    statuses: ['idle', 'idle', 'idle', 'idle']
  });

  // Live simulation engine
  useEffect(() => {
    let step = 0;
    
    const interval = setInterval(() => {
      setThreat(prev => {
        const newStatuses = [...prev.statuses];
        
        if (step === 0) {
          newStatuses[0] = 'detected';
          newStatuses[1] = 'predicted';
        } else if (step === 1) {
          newStatuses[0] = 'detected';
          newStatuses[1] = 'detected';
          newStatuses[2] = 'predicted';
        } else if (step === 2) {
          newStatuses[0] = 'detected';
          newStatuses[1] = 'detected';
          newStatuses[2] = 'prevented';
          newStatuses[3] = 'idle';
        } else if (step > 3) {
          step = -1;
          return { id: Math.random().toString(36).substr(2, 6).toUpperCase(), currentStageIdx: 0, statuses: ['idle', 'idle', 'idle', 'idle'] };
        }
        
        return { ...prev, currentStageIdx: step, statuses: newStatuses };
      });
      step++;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleStageClick = (stage: AttackStage) => {
    // Toggle selection panel instead of immediately jumping to Copilot
    setSelectedStageId(prev => prev === stage.id ? null : stage.id);
  };

  const handleCopilotHandoff = (stage: AttackStage) => {
    localStorage.setItem('copilot_initial_prompt', `Analyze the ${stage.mitreId} - ${stage.name} attempt. Evidence: ${stage.forensics.evidence}. ${stage.forensics.details} Recommend immediate mitigation strategies.`);
    navigate('/dashboard/copilot');
  };

  const getStatusColor = (status: ThreatStatus) => {
    switch (status) {
      case 'detected': return 'border-amber-500 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
      case 'prevented': return 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
      case 'predicted': return 'border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse';
      default: return 'border-slate-700 bg-slate-800/50 text-slate-500';
    }
  };

  const getStatusIcon = (status: ThreatStatus) => {
    switch (status) {
      case 'detected': return <ShieldAlert className="w-3 h-3 text-amber-400" />;
      case 'prevented': return <ShieldCheck className="w-3 h-3 text-emerald-400" />;
      case 'predicted': return <Crosshair className="w-3 h-3 text-red-400 animate-ping" />;
      default: return null;
    }
  };

  const selectedStage = STAGES.find(s => s.id === selectedStageId);
  const selectedStatus = selectedStage ? threat.statuses[STAGES.findIndex(s => s.id === selectedStageId)] : 'idle';

  return (
    <div className="bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-500">
      {/* Background hex glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            MITRE ATT&CK <span className="text-emerald-400">Kill Chain</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">Live tracking of active threat vectors</p>
        </div>
        <div className="flex gap-4 text-xs font-medium bg-black/40 px-4 py-2 rounded-full border border-white/5">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Detected</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Predicted</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Prevented</div>
        </div>
      </div>

      <div className="relative flex justify-between items-center w-full max-w-5xl mx-auto py-10">
        
        {/* Animated Background Line */}
        <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0 overflow-hidden">
          {threat.currentStageIdx >= 0 && threat.currentStageIdx < 3 && (
            <div 
              className="h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-1/3 absolute top-0"
              style={{
                animation: 'slide-right 2s linear infinite',
                left: `${(threat.currentStageIdx * 33)}%`
              }}
            />
          )}
        </div>

        {/* Nodes */}
        {STAGES.map((stage, idx) => {
          const status = threat.statuses[idx];
          const Icon = stage.icon;
          const isSelected = selectedStageId === stage.id;
          
          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center group cursor-pointer" onClick={() => handleStageClick(stage)}>
              
              {/* Connector dots */}
              {idx < STAGES.length - 1 && (
                <ArrowRight className={cn(
                  "absolute -right-[80%] top-6 w-6 h-6 -translate-y-1/2 hidden md:block transition-colors duration-500",
                  threat.currentStageIdx >= idx ? "text-emerald-400/50" : "text-slate-700"
                )} />
              )}

              {/* Main Node Box */}
              <div className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 backdrop-blur-md relative",
                getStatusColor(status),
                isSelected ? "scale-110 -translate-y-2 border-white/60 shadow-[0_0_25px_rgba(255,255,255,0.2)]" : "group-hover:scale-110 group-hover:-translate-y-2 group-hover:border-white/40"
              )}>
                <Icon className="w-6 h-6 md:w-8 md:h-8" />
                
                {/* Status Badge */}
                {status !== 'idle' && (
                  <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#05130e] border border-slate-700 rounded-full flex items-center justify-center shadow-lg">
                    {getStatusIcon(status)}
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="mt-4 text-center">
                <p className={cn("text-xs font-mono mb-1 transition-colors", isSelected ? "text-emerald-300 font-bold" : "text-emerald-400/80")}>{stage.mitreId}</p>
                <h4 className={cn("text-sm font-bold whitespace-nowrap transition-colors", isSelected ? "text-white" : "text-slate-300")}>{stage.name}</h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── DETAILED FORENSICS PANEL ─── */}
      <div className={cn(
        "mt-8 grid transition-all duration-500 ease-in-out",
        selectedStageId ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          {selectedStage && (
            <div className="bg-[#030d0a]/60 backdrop-blur-2xl border border-emerald-500/20 rounded-2xl p-6 shadow-inner relative">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-emerald-500/10 pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">{selectedStage.mitreId}</span>
                    <h3 className="text-xl font-bold text-white">{selectedStage.name}</h3>
                    {selectedStatus !== 'idle' && (
                      <span className={cn(
                        "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1",
                        selectedStatus === 'detected' && "bg-amber-500 text-amber-950",
                        selectedStatus === 'prevented' && "bg-emerald-500 text-emerald-950",
                        selectedStatus === 'predicted' && "bg-red-500 text-white animate-pulse"
                      )}>
                        {getStatusIcon(selectedStatus)} {selectedStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{selectedStage.desc}</p>
                </div>
                
                {/* Copilot Action Button */}
                <button 
                  onClick={() => handleCopilotHandoff(selectedStage)}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-emerald-100 group-hover:animate-pulse" />
                  Investigate with AI
                </button>
              </div>

              {/* Forensic Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Col: Attributes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Time of Attack</p>
                      <p className="text-sm font-medium text-slate-200">{selectedStage.forensics.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Where It Came From</p>
                      <p className="text-sm font-medium text-slate-200 font-mono">{selectedStage.forensics.ip}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">What Was Targeted</p>
                      <p className="text-sm font-medium text-slate-200">{selectedStage.forensics.target}</p>
                    </div>
                  </div>
                </div>

                {/* Right Col: Evidence & Summary */}
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-slate-400" /> What We Found
                    </p>
                    <div className="bg-black/80 border border-slate-800 rounded-lg p-3 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
                      {selectedStage.forensics.evidence}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Simple Explanation</p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {selectedStage.forensics.details}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
      
      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}} />
    </div>
  );
}
