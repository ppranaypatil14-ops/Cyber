import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShieldAlert,
  Bot,
  Network,
  Lock,
  Eye,
  ChevronRight,
  Zap,
  Globe,
  Server,
  ShieldCheck,
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
      className="group relative bg-[#0f3b2c] border border-emerald-500/20 rounded-2xl p-7 hover:border-emerald-300 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-400/20"
      style={{ animationDelay: delay }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" style={{ background: gradient }} />
      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-emerald-100" />
      </div>
      <h3 className="text-xl md:text-2xl font-extrabold mb-3" style={{ color: '#e6fff8', textShadow: '0 2px 18px rgba(0,0,0,0.65)' }}>{title}</h3>
      <p className="text-sm text-slate-200 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

/* ───────────── live stat card ───────────── */
function LiveStatCard({ initialValue, suffix, label, icon: Icon, isLive = false, isFluctuating = false }: any) {
  const [value, setValue] = useState(initialValue);

  // Initial animation
  const num = useCounter(value);

  useEffect(() => {
    if (!isLive && !isFluctuating) return;
    
    const interval = setInterval(() => {
      if (isLive) {
        // Increment slowly over time
        setValue((prev: number) => prev + Math.floor(Math.random() * 3));
      } else if (isFluctuating) {
        // Fluctuate latency
        setValue(initialValue + Math.floor(Math.random() * 5) - 2);
      }
    }, isFluctuating ? 2000 : 3500);

    return () => clearInterval(interval);
  }, [isLive, isFluctuating, initialValue]);

  // Use the animated `num` for the initial load, then switch to the real `value` once loaded
  const displayValue = num === value || isLive || isFluctuating ? value : num;

  return (
    <div className="text-center px-6 py-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-cyber-cyan/60" />
        <span className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          {displayValue.toLocaleString()}{suffix}
        </span>
      </div>
      <p className="text-sm text-slate-400 font-medium flex items-center justify-center gap-1.5">
        {label}
        {(isLive || isFluctuating) && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        )}
      </p>
    </div>
  );
}

/* ───────────── live threat feed ───────────── */
/* ───────────── live threat feed hook ───────────── */
const ATTACK_VECTORS = ['SQL Injection', 'Ransomware Payload', 'DDoS Reflection', 'Cobalt Strike Beacon', 'Zero-Day Exploit', 'Privilege Escalation', 'Lateral Movement'];
const TARGETS = ['DB-PROD-01', 'SRV-GATEWAY', 'WS-FINANCE', 'DNS-PRIMARY', 'AD-CONTROLLER', 'API-GATEWAY', 'K8S-CLUSTER'];
const SEVERITIES = ['Critical', 'High', 'High', 'Medium']; // Weighted towards High/Critical

function useLiveThreats(maxItems = 5) {
  const [threats, setThreats] = useState<any[]>([]);

  useEffect(() => {
    // Initial seed
    const initial = Array.from({ length: maxItems }).map(() => createRandomThreat());
    setThreats(initial);

    const interval = setInterval(() => {
      setThreats(prev => {
        const newThreat = createRandomThreat();
        return [newThreat, ...prev].slice(0, maxItems);
      });
    }, 2500 + Math.random() * 2000); // Random interval between 2.5s and 4.5s

    return () => clearInterval(interval);
  }, [maxItems]);

  return threats;
}

function createRandomThreat() {
  const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  const vector = ATTACK_VECTORS[Math.floor(Math.random() * ATTACK_VECTORS.length)];
  const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
  const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  const id = Math.random().toString(36).substring(7);
  const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' });
  
  return { id, type: severity, source: ip, attack: vector, target, time };
}

/* ───────────── insight stat ───────────── */
function InsightStat({ label, value, suffix, desc }: { label: string, value: number, suffix: string, desc: string }) {
  const num = useCounter(value, 3000); // 3 second animation
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-600 mb-4 font-semibold">{label}</p>
      <p className="text-5xl font-bold text-slate-900">{num}{suffix}</p>
      <p className="mt-3 text-sm text-slate-700">{desc}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN HOME PAGE
   ═══════════════════════════════════════════════ */
export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const liveThreats = useLiveThreats(5);
  const { user } = useAuth();

  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#03120d] text-slate-100 overflow-x-hidden">

      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-slate-900/30 shadow-sm" style={{ background: 'rgba(8,15,20,0.75)' }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center" style={{background:'#000'}}>
            <img src="/raksha-logo.png" alt="Raksha" className="h-12 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#threats" className="text-sm text-slate-300 hover:text-white transition-colors">Live Threats</a>
            <a href="#stats" className="text-sm text-slate-300 hover:text-white transition-colors">Statistics</a>
            <a href="#capabilities" className="text-sm text-slate-300 hover:text-white transition-colors">Capabilities</a>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard/profile" className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyber-blue to-cyber-cyan p-0.5 shadow-lg shadow-cyber-cyan/20 block hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-cyber-blue">{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:block text-sm text-slate-300 hover:text-white font-semibold transition-colors"
              >
                Log in
              </Link>
            )}
            <Link
              to="/dashboard"
              className="px-5 py-2 bg-gradient-to-r from-emerald-400 to-lime-300 hover:from-lime-300 hover:to-emerald-400 text-slate-950 text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-400/20 flex items-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 bg-[#02100c] text-white overflow-hidden">
        
        {/* Background Image & Gradient Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-no-repeat bg-cover opacity-100"
          style={{ backgroundImage: 'url(/hero-bg.png)', backgroundPosition: 'center 30%' }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#02100c]/10 via-[#02100c]/70 to-[#02100c]" />
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
          <h1 className="text-5xl md:text-[5.5rem] lg:text-[6.2rem] font-black tracking-tight mb-6 leading-[1.02]">
            <span className="text-emerald-200">Next-Gen</span>
            <br />
            <span className="text-emerald-300">Cyber Security</span>
            <br />
            <span className="text-slate-100">Operations Centre</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Real-time threat detection, AI-driven investigation, and autonomous response — all unified in a single, intelligent security platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/dashboard"
              className="group px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-lime-300 hover:from-lime-300 hover:to-emerald-400 text-slate-950 font-black rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-400/30 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Launch Dashboard
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-3.5 bg-slate-900/90 border border-slate-700 hover:border-emerald-400 text-slate-100 hover:text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-emerald-400/10"
            >
              <Eye className="w-5 h-5 text-cyber-blue" />
              Explore Features
            </a>
          </div>


        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#02100c] to-transparent" />
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="relative py-28 px-6 bg-[#031d16]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-cyan-200 tracking-[0.3em] uppercase mb-3 block">Core Capabilities</span>
            <h2 className="text-5xl md:text-[4.8rem] font-black tracking-tight mb-4 leading-[1.05]" style={{ color: '#7dd3fc', textShadow: '0 0 36px rgba(125,211,252,0.35)' }}>
              <span className="block text-cyan-200">Intelligent Security</span>
              <span className="block text-cyan-100 mt-6">At Every Layer</span>
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto">Comprehensive protection powered by advanced AI, real-time analytics, and automated threat response.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Radar} title="Real-Time Threat Detection" desc="AI continuously monitors network traffic, endpoints, and user behaviour to identify anomalies and zero-day threats in milliseconds." gradient="linear-gradient(135deg, rgba(6,182,212,0.08) 0%, transparent 100%)" delay="0ms" />
            <FeatureCard icon={Bot} title="AI Security Copilot" desc="Natural-language powered assistant that investigates incidents, correlates IOCs, and suggests remediation steps automatically." gradient="linear-gradient(135deg, rgba(59,130,246,0.08) 0%, transparent 100%)" delay="100ms" />
            <FeatureCard icon={Network} title="MITRE ATT&CK Mapping" desc="Automatically maps detected threats to the MITRE ATT&CK framework, providing full attack chain visibility and coverage analysis." gradient="linear-gradient(135deg, rgba(139,92,246,0.08) 0%, transparent 100%)" delay="200ms" />
            <FeatureCard icon={Lock} title="Zero Trust Architecture" desc="Enforce least-privilege access with continuous identity verification, micro-segmentation, and adaptive authentication policies." gradient="linear-gradient(135deg, rgba(16,185,129,0.08) 0%, transparent 100%)" delay="300ms" />
            <FeatureCard icon={Fingerprint} title="Advanced Forensics" desc="Deep-dive investigation tools with full packet capture, memory analysis, and automated evidence collection for incident response." gradient="linear-gradient(135deg, rgba(59,130,246,0.08) 0%, transparent 100%)" delay="400ms" />
            <FeatureCard icon={Cpu} title="Automated Response" desc="SOAR-integrated playbooks that automatically quarantine threats, block malicious IPs, and remediate compromised assets in real-time." gradient="linear-gradient(135deg, rgba(59,130,246,0.08) 0%, transparent 100%)" delay="500ms" />
          </div>
        </div>
      </section>

      {/* ─── ATTACK SURFACE SECTION ─── */}
      <section id="threats" className="relative py-24 px-6 bg-[#02120d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-[4.8rem] font-black tracking-tight mb-4"
              style={{ color: '#7dd3fc', textShadow: '0 0 36px rgba(125,211,252,0.35)' }}
            >
              Defense Across Every Attack Surface
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">A single, unified platform to secure devices, users, apps, and data – end to end.</p>
          </div>
          <div className="rounded-[32px] overflow-hidden border border-slate-800 shadow-xl bg-[#081f17]">
            <img
              src="/attack-surface.png"
              alt="Defense across every attack surface diagram"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section id="stats" className="relative py-20 px-6 bg-[#02120d]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#081f17] border border-slate-800 rounded-2xl p-8 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-800">
              <LiveStatCard initialValue={99} suffix=".97%" label="Uptime SLA" icon={Server} />
              <LiveStatCard initialValue={2847} suffix="" label="Threats Blocked Today" icon={ShieldAlert} isLive={true} />
              <LiveStatCard initialValue={1248} suffix="" label="Assets Monitored" icon={Globe} />
              <LiveStatCard initialValue={18} suffix="ms" label="Detection Latency" icon={Zap} isFluctuating={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── OPERATIONAL INSIGHTS SECTION ─── */}
      <section id="operational-insights" className="relative py-24 px-6 bg-[#031d16]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-cyan-200 tracking-[0.3em] uppercase mb-3 block">Operational insights</span>
            <h2 className="text-5xl md:text-[4.8rem] font-black tracking-tight mb-4 text-cyan-200"
              style={{ textShadow: '0 0 30px rgba(111,211,255,0.35)' }}
            >What the platform helps you do</h2>
            <p className="text-slate-200 max-w-xl mx-auto">Turn data into action with clear security metrics, faster incident response, and better visibility across your attack surface.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-emerald-500/10 bg-[#081f17] p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-100 w-12 h-12 mb-5">
                  <ShieldCheck className="w-6 h-6 text-emerald-100" />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: '#e6fff8', textShadow: '0 2px 18px rgba(0,0,0,0.6)' }}>Incident Prioritization</h3>
              <p className="text-slate-300 leading-relaxed">Automatically rank alerts and focus your team on the threats that matter most, reducing noise and speeding up response time.</p>
            </div>

            <div className="rounded-3xl border border-emerald-500/10 bg-[#081f17] p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-100 w-12 h-12 mb-5">
                <Radar className="w-6 h-6 text-emerald-100" />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#e6fff8', textShadow: '0 2px 18px rgba(0,0,0,0.6)' }}>Threat Intelligence</h3>
              <p className="text-slate-300 leading-relaxed">Get concise, actionable alerts from the latest threat feeds, mapped to MITRE and cross-correlated with your environment.</p>
            </div>

            <div className="rounded-3xl border border-emerald-500/10 bg-[#081f17] p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-100 w-12 h-12 mb-5">
                <Globe className="w-6 h-6 text-emerald-100" />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#e6fff8', textShadow: '0 2px 18px rgba(0,0,0,0.6)' }}>Visibility & Reporting</h3>
              <p className="text-slate-300 leading-relaxed">Monitor asset health, user activity, and system risk with clean dashboards and summary reports for security teams.</p>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightStat label="Security score" value={87} suffix="" desc="Based on network, endpoint, and identity risk." />
            <InsightStat label="Average response" value={8} suffix="m" desc="Time to contain high-risk incidents." />
            <InsightStat label="Threat coverage" value={99} suffix="%" desc="Detected across endpoints, networks and cloud workloads." />
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="relative py-28 px-6 bg-[#02110b]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d3d1f]/20 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="p-1 rounded-3xl bg-gradient-to-r from-emerald-400/20 via-lime-300/20 to-emerald-300/20">
            <div className="bg-[#081f17] border border-slate-800 rounded-3xl px-8 py-16 md:px-16 shadow-2xl shadow-emerald-400/10">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-lime-300 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-400/30">
                <ShieldCheck className="w-8 h-8 text-slate-950" />
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-slate-50">
                <span className="block">Ready to Secure Your</span>
                <span className="block text-emerald-400">Digital Infrastructure?</span>
              </h2>
              <p className="text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed">
                Access the full security operations centre with AI-powered detection, real-time monitoring, and automated threat response.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-400 to-lime-300 hover:from-lime-300 hover:to-emerald-400 text-slate-950 font-black rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-400/20 hover:-translate-y-0.5"
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
      <footer className="border-t border-slate-800 py-16 px-6 bg-[#01100a] text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-4 text-center lg:text-left">
            <span className="text-xs uppercase tracking-[0.45em] text-emerald-400">Your infrastructure cannot wait</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-50">Secure every layer with the platform built for rapid response.</h2>
            <p className="max-w-2xl text-slate-400">The average attacker is present for 197 days before detection. Every hour matters — request a live demo and see the platform in your environment.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-400 to-lime-300 text-slate-950 font-black rounded-xl shadow-2xl shadow-emerald-400/20"
            >
              Request a Live Demo
            </Link>
            <div className="text-sm text-slate-500 text-center lg:text-right">
              <p>© 2026 Raksha</p>
              <p className="mt-2">Built for urgent security operations.</p>
            </div>
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
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
