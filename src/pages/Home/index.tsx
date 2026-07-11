import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Activity,
  Bot,
  Network,
  Lock,
  Eye,
  ChevronRight,
  Zap,
  Globe,
  Server,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Fingerprint,
  Radar,
} from 'lucide-react';

/* ───────────── animated counter hook ───────────── */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
}

/* ───────────── floating particles component ───────────── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#3b82f6' : '#8b5cf6',
            opacity: Math.random() * 0.5 + 0.1,
            animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ───────────── hex grid background ───────────── */
function HexGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexagons" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
          <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66Z" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
          <path d="M28 166L0 150L0 116L28 100L56 116L56 150L28 166Z" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagons)" />
    </svg>
  );
}

/* ───────────── animated grid line ───────────── */
function GridLine({ direction, offset, delay }: { direction: 'h' | 'v'; offset: string; delay: string }) {
  return (
    <div
      className="absolute bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent"
      style={{
        ...(direction === 'h'
          ? { left: 0, right: 0, top: offset, height: '1px' }
          : { top: 0, bottom: 0, left: offset, width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(6,182,212,0.15), transparent)' }),
        animation: `pulse-glow 4s ease-in-out infinite`,
        animationDelay: delay,
      }}
    />
  );
}

/* ───────────── feature card ───────────── */
function FeatureCard({ icon: Icon, title, desc, gradient, delay }: any) {
  return (
    <div
      className="group relative bg-cyber-card/50 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-7 hover:border-cyber-cyan/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyber-cyan/5"
      style={{ animationDelay: delay }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" style={{ background: gradient }} />
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-blue/20 to-cyber-cyan/10 border border-cyber-cyan/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-cyber-cyan" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

/* ───────────── stat card ───────────── */
function StatCard({ value, suffix, label, icon: Icon }: any) {
  const num = useCounter(value);
  return (
    <div className="text-center px-6 py-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-cyber-cyan/60" />
        <span className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          {num.toLocaleString()}{suffix}
        </span>
      </div>
      <p className="text-sm text-slate-400 font-medium">{label}</p>
    </div>
  );
}

/* ───────────── live threat feed ───────────── */
const threats = [
  { type: 'Critical', source: '103.14.xx.xx', attack: 'SQL Injection detected', target: 'DB-PROD-01', time: '2s ago' },
  { type: 'High', source: '185.92.xx.xx', attack: 'Brute-force SSH attempt', target: 'SRV-GATEWAY', time: '8s ago' },
  { type: 'Critical', source: '45.33.xx.xx', attack: 'Ransomware payload blocked', target: 'WS-FINANCE-07', time: '15s ago' },
  { type: 'Medium', source: '91.240.xx.xx', attack: 'Suspicious DNS exfiltration', target: 'DNS-PRIMARY', time: '22s ago' },
  { type: 'High', source: '62.76.xx.xx', attack: 'Lateral movement detected', target: 'AD-CONTROLLER', time: '31s ago' },
];

/* ═══════════════════════════════════════════════
   MAIN HOME PAGE
   ═══════════════════════════════════════════════ */
export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div className="min-h-screen bg-cyber-dark text-white overflow-x-hidden">

      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-darker/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyber-blue/20 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-cyber-cyan" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">CyberShield <span className="text-cyber-cyan">AI</span></span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#threats" className="text-sm text-slate-400 hover:text-white transition-colors">Live Threats</a>
            <a href="#stats" className="text-sm text-slate-400 hover:text-white transition-colors">Statistics</a>
            <a href="#capabilities" className="text-sm text-slate-400 hover:text-white transition-colors">Capabilities</a>
          </div>
          <Link
            to="/dashboard"
            className="px-5 py-2 bg-gradient-to-r from-cyber-blue to-blue-600 hover:from-blue-600 hover:to-cyber-cyan text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyber-cyan/20 flex items-center gap-2"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        
        {/* Background Image & Gradient Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
          style={{ backgroundImage: 'url(/hero-bg.png)' }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-cyber-dark/60 to-cyber-dark" />
        <HexGrid />
        <FloatingParticles />

        {/* Radial glow that follows cursor */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none transition-all duration-700 ease-out"
          style={{
            left: mousePos.x - 300,
            top: mousePos.y - 300,
            background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(30,58,138,0.2) 40%, transparent 70%)',
          }}
        />

        {/* Grid lines */}
        <GridLine direction="h" offset="20%" delay="0s" />
        <GridLine direction="h" offset="80%" delay="2s" />
        <GridLine direction="v" offset="15%" delay="1s" />
        <GridLine direction="v" offset="85%" delay="3s" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">


          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Next-Gen</span>
            <br />
            <span className="bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-400 bg-clip-text text-transparent">Cyber Security</span>
            <br />
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Operations Centre</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Real-time threat detection, AI-driven investigation, and autonomous response — all unified in a single, intelligent security platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/dashboard"
              className="group px-8 py-3.5 bg-gradient-to-r from-cyber-cyan to-blue-500 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-cyber-cyan/30 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Launch Dashboard
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-3.5 bg-cyber-card/60 backdrop-blur-sm border border-slate-700 hover:border-cyber-cyan/40 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Explore Features
            </a>
          </div>


        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyber-dark to-transparent" />
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="relative py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-cyber-cyan tracking-[0.3em] uppercase mb-3 block">Core Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Intelligent Security</span>
              <br />
              <span className="bg-gradient-to-r from-cyber-cyan to-blue-400 bg-clip-text text-transparent">At Every Layer</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">Comprehensive protection powered by advanced AI, real-time analytics, and automated threat response.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Radar} title="Real-Time Threat Detection" desc="AI continuously monitors network traffic, endpoints, and user behaviour to identify anomalies and zero-day threats in milliseconds." gradient="linear-gradient(135deg, rgba(6,182,212,0.05) 0%, transparent 100%)" delay="0ms" />
            <FeatureCard icon={Bot} title="AI Security Copilot" desc="Natural-language powered assistant that investigates incidents, correlates IOCs, and suggests remediation steps automatically." gradient="linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 100%)" delay="100ms" />
            <FeatureCard icon={Network} title="MITRE ATT&CK Mapping" desc="Automatically maps detected threats to the MITRE ATT&CK framework, providing full attack chain visibility and coverage analysis." gradient="linear-gradient(135deg, rgba(139,92,246,0.05) 0%, transparent 100%)" delay="200ms" />
            <FeatureCard icon={Lock} title="Zero Trust Architecture" desc="Enforce least-privilege access with continuous identity verification, micro-segmentation, and adaptive authentication policies." gradient="linear-gradient(135deg, rgba(16,185,129,0.05) 0%, transparent 100%)" delay="300ms" />
            <FeatureCard icon={Fingerprint} title="Advanced Forensics" desc="Deep-dive investigation tools with full packet capture, memory analysis, and automated evidence collection for incident response." gradient="linear-gradient(135deg, rgba(245,158,11,0.05) 0%, transparent 100%)" delay="400ms" />
            <FeatureCard icon={Cpu} title="Automated Response" desc="SOAR-integrated playbooks that automatically quarantine threats, block malicious IPs, and remediate compromised assets in real-time." gradient="linear-gradient(135deg, rgba(239,68,68,0.05) 0%, transparent 100%)" delay="500ms" />
          </div>
        </div>
      </section>

      {/* ─── LIVE THREAT FEED ─── */}
      <section id="threats" className="relative py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark via-cyber-darker/50 to-cyber-dark" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-status-critical tracking-[0.3em] uppercase mb-3 block">Live Intelligence</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Real-Time Threat Feed</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">Active threats detected and neutralised by CyberShield AI in the last 60 seconds.</p>
          </div>
          <div className="bg-cyber-card/40 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800 bg-cyber-darker/50">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-critical opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-critical" />
              </span>
              <span className="text-sm font-semibold text-slate-300 tracking-wide">THREAT MONITOR — ACTIVE</span>
              <span className="ml-auto text-xs text-slate-500 font-mono">AUTO-REFRESH 5s</span>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800/60 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 font-medium">Severity</th>
                    <th className="px-6 py-3 font-medium">Source IP</th>
                    <th className="px-6 py-3 font-medium">Attack Vector</th>
                    <th className="px-6 py-3 font-medium">Target</th>
                    <th className="px-6 py-3 font-medium text-right">Detected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {threats.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          t.type === 'Critical' ? 'bg-status-critical/10 text-status-critical border border-status-critical/20' :
                          t.type === 'High' ? 'bg-status-high/10 text-status-high border border-status-high/20' :
                          'bg-status-medium/10 text-status-medium border border-status-medium/20'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-300 text-xs">{t.source}</td>
                      <td className="px-6 py-4 text-slate-200 font-medium">{t.attack}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{t.target}</td>
                      <td className="px-6 py-4 text-right text-slate-500 text-xs">{t.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section id="stats" className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-cyber-card/60 via-cyber-card/30 to-cyber-card/60 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-800/50">
              <StatCard value={99} suffix=".97%" label="Uptime SLA" icon={Server} />
              <StatCard value={2847} suffix="" label="Threats Blocked Today" icon={ShieldAlert} />
              <StatCard value={1248} suffix="" label="Assets Monitored" icon={Globe} />
              <StatCard value={18} suffix="ms" label="Detection Latency" icon={Zap} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAPABILITIES GRID ─── */}
      <section id="capabilities" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-cyber-cyan tracking-[0.3em] uppercase mb-3 block">Platform Modules</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Complete Security</span>{' '}
              <span className="bg-gradient-to-r from-cyber-cyan to-blue-400 bg-clip-text text-transparent">Ecosystem</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: BarChart3, name: 'Overview Dashboard', desc: 'Centralised security posture view with real-time risk scoring.', path: '/dashboard' },
              { icon: Activity, name: 'Live Alerts', desc: 'Stream of active threats with severity-based prioritisation.', path: '/dashboard/alerts' },
              { icon: Bot, name: 'AI Security Copilot', desc: 'Conversational AI for threat hunting and incident analysis.', path: '/dashboard/copilot' },
              { icon: Network, name: 'MITRE ATT&CK', desc: 'Full framework mapping with technique detection coverage.', path: '/dashboard/mitre' },
            ].map((mod, i) => (
              <Link
                to={mod.path}
                key={i}
                className="group flex items-start gap-5 p-6 bg-cyber-card/40 backdrop-blur-sm border border-slate-800/60 rounded-2xl hover:border-cyber-cyan/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyber-cyan/5"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyber-blue/20 to-cyber-cyan/10 border border-cyber-cyan/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <mod.icon className="w-6 h-6 text-cyber-cyan" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyber-cyan transition-colors">{mod.name}</h3>
                  <p className="text-sm text-slate-400">{mod.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-cyber-cyan group-hover:translate-x-1 transition-all mt-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="relative py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-darker via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="p-1 rounded-3xl bg-gradient-to-r from-cyber-cyan/20 via-blue-500/20 to-purple-500/20">
            <div className="bg-cyber-darker rounded-3xl px-8 py-16 md:px-16">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-cyber-cyan to-blue-500 rounded-2xl flex items-center justify-center shadow-xl shadow-cyber-cyan/20">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Ready to Secure Your</span>
                <br />
                <span className="bg-gradient-to-r from-cyber-cyan to-blue-400 bg-clip-text text-transparent">Digital Infrastructure?</span>
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
                Access the full security operations centre with AI-powered detection, real-time monitoring, and automated threat response.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyber-cyan to-blue-500 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-cyber-cyan/30 hover:-translate-y-0.5"
              >
                <ShieldAlert className="w-5 h-5" />
                Enter Security Operations Centre
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-800/50 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-cyber-cyan" />
            <span className="font-bold text-white">CyberShield <span className="text-cyber-cyan">AI</span></span>
            <span className="text-slate-600 text-sm">|</span>
            <span className="text-slate-500 text-sm">Detect. Predict. Defend.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-status-safe" />
            <span className="text-xs text-slate-500">All Systems Operational</span>
            <span className="text-slate-700 mx-2">·</span>
            <span className="text-xs text-slate-600">© 2026 CyberShield AI</span>
          </div>
        </div>
      </footer>

      {/* ─── GLOBAL ANIMATIONS ─── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
          50% { transform: translateY(-10px) translateX(-5px); opacity: 0.3; }
          75% { transform: translateY(-25px) translateX(8px); opacity: 0.4; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
