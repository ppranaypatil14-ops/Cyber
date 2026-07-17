import { Bot, Network, Grid, FlaskConical, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const modules = [
  {
    title: 'Autonomous Detection',
    description: 'AI-driven threat hunting and automated response mechanisms.',
    icon: Bot,
    path: '/dashboard/alerts',
    color: 'text-blue-300',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-400',
    shadow: 'hover:shadow-blue-500/20',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, transparent 100%)'
  },
  {
    title: 'Attack Correlation',
    description: 'Advanced graph-based analysis of multi-stage attacks.',
    icon: Network,
    path: '/dashboard/investigation',
    color: 'text-indigo-300',
    bg: 'bg-indigo-500/20',
    border: 'border-indigo-500/30',
    hoverBorder: 'hover:border-indigo-400',
    shadow: 'hover:shadow-indigo-500/20',
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, transparent 100%)'
  },
  {
    title: 'MITRE ATT&CK Matrix',
    description: 'Real-time mapping of adversary tactics and techniques.',
    icon: Grid,
    path: '/dashboard/mitre',
    color: 'text-purple-300',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    hoverBorder: 'hover:border-purple-400',
    shadow: 'hover:shadow-purple-500/20',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, transparent 100%)'
  },
  {
    title: 'Security Lab',
    description: 'Isolated environment for malware analysis and detonation.',
    icon: FlaskConical,
    path: '/dashboard/lab',
    color: 'text-cyan-300',
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-400',
    shadow: 'hover:shadow-cyan-500/20',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, transparent 100%)'
  },
  {
    title: 'Stress Testing',
    description: 'Continuous simulation of attack vectors and vulnerabilities.',
    icon: Zap,
    path: '/dashboard/lab',
    color: 'text-amber-300',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
    hoverBorder: 'hover:border-amber-400',
    shadow: 'hover:shadow-amber-500/20',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, transparent 100%)'
  },
  {
    title: 'AI Security Co-Pilot',
    description: 'Your intelligent assistant for security operations and triage.',
    icon: Sparkles,
    path: '/dashboard/copilot',
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-400',
    shadow: 'hover:shadow-emerald-500/20',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, transparent 100%)'
  }
];

export default function OverviewDashboard() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500 pb-12 pt-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.5)', opacity: 1 }}>Dashboard</h1>
      </div>

      {/* 2x3 Grid with adjusted smaller size and dark mode vibrant styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, idx) => {
          const Icon = mod.icon;
          return (
            <Link 
              key={idx} 
              to={mod.path}
              className={cn(
                "group relative bg-[#0f3b2c]/40 border rounded-[20px] p-6 hover:-translate-y-1.5 transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden min-h-[240px] shadow-lg",
                mod.border,
                mod.hoverBorder,
                mod.shadow
              )}
            >
              {/* Vibrant subtle gradient background on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" 
                style={{ background: mod.gradient }} 
              />
              
              <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110", mod.bg, mod.border, "border")}>
                <Icon className={cn("w-10 h-10", mod.color)} />
              </div>
              
              <h3 className="text-2xl font-extrabold mb-4 relative z-20 tracking-tight" style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.8)', opacity: 1 }}>{mod.title}</h3>
              <p className="text-base leading-relaxed relative z-20 max-w-[250px] font-medium" style={{ color: '#f1f5f9', opacity: 1 }}>{mod.description}</p>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
