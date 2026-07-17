import { useState } from 'react';
import {
  Beaker, ShieldAlert, Activity, ShieldCheck,
  Shield, AlertTriangle, Cpu, Network,
  ChevronDown, ChevronUp, Clock, Smartphone,
  Download, FileWarning, Fingerprint, Info, CheckCircle2,
  Lock, Database, ArrowDown, GitMerge, Globe
} from 'lucide-react';
import { cn } from '../../utils/cn';

/* ─── Animated SVG Risk Gauge ──────────────────────────────────────── */
function RiskGauge({ score, severity }: { score: number; severity: string }) {
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (score / 100) * circumference;

  const colorMap: Record<string, string> = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#f59e0b',
    Low: '#10b981',
  };
  const gaugeColor = colorMap[severity] ?? '#10b981';

  return (
    <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
      <svg width={radius * 2} height={radius * 2} className="transform -rotate-90">
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="risk-gauge-circle"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white leading-none">{score}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-semibold">/ 100</span>
      </div>
    </div>
  );
}

/* ─── Loading Stages ───────────────────────────────────────────────── */
const STAGES = [
  'Receiving security activity...',
  'Analyzing behaviour with Isolation Forest...',
  'Comparing activity with the normal baseline...',
  'Evaluating cybersecurity risk indicators...',
  'Generating final threat assessment...',
];

/* ─── Severity helpers ─────────────────────────────────────────────── */
const sevColor = (s: string) => {
  if (s === 'Critical') return 'text-status-critical';
  if (s === 'High') return 'text-status-high';
  if (s === 'Medium') return 'text-status-medium';
  return 'text-status-safe';
};

const sevBorder = (s: string) => {
  if (s === 'Critical') return 'border-status-critical/30';
  if (s === 'High') return 'border-status-high/30';
  if (s === 'Medium') return 'border-status-medium/30';
  return 'border-status-safe/30';
};

const sevGlow = (s: string) => {
  if (s === 'Critical') return 'shadow-[0_0_40px_rgba(239,68,68,0.08)]';
  if (s === 'High') return 'shadow-[0_0_40px_rgba(249,115,22,0.08)]';
  if (s === 'Medium') return 'shadow-[0_0_40px_rgba(245,158,11,0.08)]';
  return 'shadow-[0_0_40px_rgba(16,185,129,0.08)]';
};

/* ─── Evidence icon/title mapping from reason text ─────────────────── */
function parseEvidence(reason: string) {
  const r = reason.toLowerCase();
  if (r.includes('time'))
    return { title: 'Unusual Login Time', icon: <Clock className="w-4 h-4" /> };
  if (r.includes('failed login'))
    return { title: 'Multiple Failed Login Attempts', icon: <Lock className="w-4 h-4" /> };
  if (r.includes('device'))
    return { title: 'Unknown Device', icon: <Smartphone className="w-4 h-4" /> };
  if (r.includes('download') || r.includes('large data'))
    return { title: 'Excessive Data Download', icon: <Download className="w-4 h-4" /> };
  if (r.includes('sensitive'))
    return { title: 'Sensitive File Access', icon: <FileWarning className="w-4 h-4" /> };
  if (r.includes('antivirus'))
    return { title: 'Antivirus Disabled', icon: <ShieldAlert className="w-4 h-4" /> };
  return { title: 'Security Indicator', icon: <AlertTriangle className="w-4 h-4" /> };
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function SecurityTestingLab() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const [formData, setFormData] = useState({
    username: 'john.doe',
    loginTime: '02:15',
    failedLoginCount: 5,
    deviceType: 'unknown',
    knownDevice: 'false',
    ipAddress: '192.168.1.105',
    country: 'Russia',
    fileAccessed: '/etc/passwd',
    downloadSizeMB: 4500,
    usbConnected: 'true',
    vpnUsed: 'false',
    timestamp: new Date().toISOString().slice(0, 16),
  });

  /* ── Form helpers ──────────────────────────────────────────────── */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadNormal = () =>
    setFormData({
      username: 'alice.smith',
      loginTime: '09:30',
      failedLoginCount: 0,
      deviceType: 'laptop',
      knownDevice: 'true',
      ipAddress: '10.0.0.42',
      country: 'United States',
      fileAccessed: '',
      downloadSizeMB: 150,
      usbConnected: 'false',
      vpnUsed: 'false',
      timestamp: new Date().toISOString().slice(0, 16),
    });

  const loadSuspicious = () =>
    setFormData({
      username: 'bob.hacker',
      loginTime: '02:00',
      failedLoginCount: 18,
      deviceType: 'unknown',
      knownDevice: 'false',
      ipAddress: '45.33.32.156',
      country: 'Russia',
      fileAccessed: '/var/db/credentials.db',
      downloadSizeMB: 15000,
      usbConnected: 'true',
      vpnUsed: 'true',
      timestamp: new Date().toISOString().slice(0, 16),
    });

  const clearForm = () => {
    setFormData({
      username: '',
      loginTime: '',
      failedLoginCount: 0,
      deviceType: 'laptop',
      knownDevice: 'true',
      ipAddress: '',
      country: '',
      fileAccessed: '',
      downloadSizeMB: 0,
      usbConnected: 'false',
      vpnUsed: 'false',
      timestamp: new Date().toISOString().slice(0, 16),
    });
    setShowResult(false);
    setAnalysisData(null);
    setSubmittedData(null);
  };

  /* ── Live loading stages ───────────────────────────────────────── */
  const runStages = async () => {
    for (let i = 0; i < STAGES.length; i++) {
      setAnalysisStage(i);
      await new Promise((r) => setTimeout(r, 380));
    }
  };

  /* ── Submit ────────────────────────────────────────────────────── */
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setShowResult(false);
    setError(null);
    setAnalysisStage(0);
    setWorkflowOpen(false);

    setSubmittedData({ ...formData });

    // Build the new 12-field payload for the Node.js API
    const payload = {
      username:         formData.username.trim() || 'anonymous',
      loginTime:        formData.loginTime,
      failedLoginCount: Number(formData.failedLoginCount) || 0,
      deviceType:       formData.deviceType,
      knownDevice:      formData.knownDevice === 'true',
      ipAddress:        formData.ipAddress.trim() || '0.0.0.0',
      country:          formData.country.trim() || 'Unknown',
      fileAccessed:     formData.fileAccessed.trim(),
      downloadSizeMB:   Number(formData.downloadSizeMB) || 0,
      usbConnected:     formData.usbConnected === 'true',
      vpnUsed:          formData.vpnUsed === 'true',
      timestamp:        formData.timestamp ? new Date(formData.timestamp).toISOString() : new Date().toISOString(),
    };

    try {
      // Try Node.js Express server first (port 3001), fallback to FastAPI (port 8000)
      const NODE_API = 'http://localhost:3001/api/security-lab/simulate';
      const FASTAPI   = 'http://127.0.0.1:8000/api/analyze';

      let response: Response | null = null;
      let usedEndpoint = '';

      const [nodeResp] = await Promise.allSettled([
        fetch(NODE_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }),
      ]);

      if (nodeResp.status === 'fulfilled' && nodeResp.value.ok) {
        response = nodeResp.value;
        usedEndpoint = 'Node.js';
      } else {
        // Fallback to FastAPI
        response = await fetch(FASTAPI, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        usedEndpoint = 'FastAPI';
      }

      await runStages();

      if (!response || !response.ok)
        throw new Error(`API Error: ${response?.status} ${response?.statusText}`);

      const data = await response.json();
      console.log(`[SecurityLab] Result from ${usedEndpoint}:`, data);
      setAnalysisData(data);
      setShowResult(true);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend. Start the Node.js server: cd security-lab-server && npm install && npm start');
    } finally {
      setAnalyzing(false);
    }
  };

  /* ─── Baseline comparison helpers ──────────────────────────────── */
  const baselineRows = submittedData
    ? [
        {
          label: 'Login Time',
          current: submittedData.loginTime || '—',
          baseline: 'Mostly 08:00–19:00',
          status: (() => {
            const h = parseInt(submittedData.loginTime?.split(':')[0], 10);
            return isNaN(h) ? 'Unknown' : h < 6 || h > 20 ? 'Unusual' : 'Normal';
          })(),
        },
        {
          label: 'Failed Login Attempts',
          current: String(submittedData.failedLogins),
          baseline: 'Usually 0–2',
          status:
            submittedData.failedLogins > 5
              ? 'Highly Unusual'
              : submittedData.failedLogins > 2
                ? 'Unusual'
                : 'Normal',
        },
        {
          label: 'Device',
          current: submittedData.deviceStatus === 'known' ? 'Known' : 'Unknown',
          baseline: '93% Known Devices',
          status: submittedData.deviceStatus === 'unknown' ? 'Suspicious' : 'Normal',
        },
        {
          label: 'Download',
          current: `${Number(submittedData.downloadMb).toLocaleString()} MB`,
          baseline: 'Usually Below 500 MB',
          status:
            submittedData.downloadMb > 5000
              ? 'Highly Unusual'
              : submittedData.downloadMb > 1000
                ? 'Above Normal'
                : 'Normal',
        },
        {
          label: 'Sensitive File Access',
          current: submittedData.sensitiveAccess === 'yes' ? 'Yes' : 'No',
          baseline: 'Usually No',
          status: submittedData.sensitiveAccess === 'yes' ? 'Security Indicator' : 'Normal',
        },
        {
          label: 'Antivirus',
          current: submittedData.antivirusStatus === 'active' ? 'Active' : 'Disabled',
          baseline: '96% Active',
          status: submittedData.antivirusStatus === 'disabled' ? 'Security Indicator' : 'Normal',
        },
      ]
    : [];

  const statusBadge = (s: string) => {
    if (s === 'Normal')
      return 'bg-status-safe/15 text-status-safe';
    if (s === 'Unusual' || s === 'Suspicious' || s === 'Above Normal')
      return 'bg-status-medium/15 text-status-medium';
    if (s === 'Highly Unusual')
      return 'bg-status-critical/15 text-status-critical';
    if (s === 'Security Indicator')
      return 'bg-status-high/15 text-status-high';
    return 'bg-slate-700/30 text-slate-400';
  };

  /* ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="border-b border-cyber-card pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
          <Beaker className="w-6 h-6 text-cyber-cyan" />
          AI Security Testing Lab
        </h1>
        <p className="text-slate-400 text-sm">
          Test the machine-learning anomaly detection and rule-based cybersecurity risk engine with real predictions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ────────────────── LEFT: INPUT FORM ────────────────── */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-cyber-cyan" />
              Simulate Activity
            </h2>

            {/* Judge demo buttons */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                type="button"
                onClick={loadNormal}
                className="py-2 text-xs font-semibold bg-status-safe/10 hover:bg-status-safe/20 text-status-safe rounded-lg border border-status-safe/20 transition-colors"
              >
                Load Normal Activity
              </button>
              <button
                type="button"
                onClick={loadSuspicious}
                className="py-2 text-xs font-semibold bg-status-critical/10 hover:bg-status-critical/20 text-status-critical rounded-lg border border-status-critical/20 transition-colors"
              >
                Load Suspicious Activity
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="col-span-2 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg border border-dashed border-slate-700 hover:border-slate-500 transition-colors"
              >
                Clear for Custom Test
              </button>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">

              {/* Row 1: Username + Login Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="lab-label">
                    <Fingerprint className="w-3 h-3" /> Username
                  </label>
                  <input required name="username" value={formData.username} onChange={handleInputChange}
                    type="text" placeholder="john.doe" className="lab-input" />
                </div>
                <div className="space-y-1.5">
                  <label className="lab-label">
                    <Clock className="w-3 h-3" /> Login Time
                  </label>
                  <input required name="loginTime" value={formData.loginTime} onChange={handleInputChange}
                    type="time" className="lab-input" />
                </div>
              </div>

              {/* Row 2: Failed Login Count + Device Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="lab-label">
                    <ShieldAlert className="w-3 h-3" /> Failed Login Count
                  </label>
                  <input required name="failedLoginCount" value={formData.failedLoginCount}
                    onChange={handleInputChange} type="number" min="0" className="lab-input" />
                </div>
                <div className="space-y-1.5">
                  <label className="lab-label">
                    <Smartphone className="w-3 h-3" /> Device Type
                  </label>
                  <select name="deviceType" value={formData.deviceType} onChange={handleInputChange} className="lab-input">
                    <option value="desktop">Desktop</option>
                    <option value="laptop">Laptop</option>
                    <option value="mobile">Mobile</option>
                    <option value="tablet">Tablet</option>
                    <option value="server">Server</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Known Device + IP Address */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="lab-label">
                    <Shield className="w-3 h-3" /> Known Device
                  </label>
                  <select name="knownDevice" value={formData.knownDevice} onChange={handleInputChange} className="lab-input">
                    <option value="true">Yes — Recognised</option>
                    <option value="false">No — Unknown</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="lab-label">
                    <Network className="w-3 h-3" /> IP Address
                  </label>
                  <input required name="ipAddress" value={formData.ipAddress} onChange={handleInputChange}
                    type="text" placeholder="192.168.1.1" className="lab-input" />
                </div>
              </div>

              {/* Row 4: Country + File Accessed */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="lab-label">
                    <Globe className="w-3 h-3" /> Country
                  </label>
                  <input required name="country" value={formData.country} onChange={handleInputChange}
                    type="text" placeholder="United States" className="lab-input" />
                </div>
                <div className="space-y-1.5">
                  <label className="lab-label">
                    <FileWarning className="w-3 h-3" /> File Accessed
                  </label>
                  <input name="fileAccessed" value={formData.fileAccessed} onChange={handleInputChange}
                    type="text" placeholder="/etc/passwd (optional)" className="lab-input" />
                </div>
              </div>

              {/* Row 5: Download Size + USB Connected */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="lab-label">
                    <Download className="w-3 h-3" /> Download Size (MB)
                  </label>
                  <input required name="downloadSizeMB" value={formData.downloadSizeMB}
                    onChange={handleInputChange} type="number" min="0" step="0.1" className="lab-input" />
                </div>
                <div className="space-y-1.5">
                  <label className="lab-label">
                    <ArrowDown className="w-3 h-3" /> USB Connected
                  </label>
                  <select name="usbConnected" value={formData.usbConnected} onChange={handleInputChange} className="lab-input">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              {/* Row 6: VPN Used + Timestamp */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="lab-label">
                    <Lock className="w-3 h-3" /> VPN Used
                  </label>
                  <select name="vpnUsed" value={formData.vpnUsed} onChange={handleInputChange} className="lab-input">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="lab-label">
                    <Clock className="w-3 h-3" /> Timestamp
                  </label>
                  <input name="timestamp" value={formData.timestamp} onChange={handleInputChange}
                    type="datetime-local" className="lab-input" />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 mt-2 bg-status-critical/10 border border-status-critical/30 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-status-critical shrink-0" />
                  <p className="text-sm text-status-critical">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={analyzing}
                className="w-full mt-4 py-3.5 bg-cyber-blue hover:bg-cyber-blue/80 disabled:opacity-50 disabled:hover:bg-cyber-blue text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-cyber-blue/20 flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                {analyzing ? (
                  <span className="flex items-center gap-3">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Activity…
                  </span>
                ) : (
                  <>
                    Analyze Security Activity
                    <Activity className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ────────────────── RIGHT: RESULT PANEL ────────────────── */}
        <div className="lg:col-span-7">
          {/* Loading Sequence */}
          {analyzing && (
            <div className="h-full min-h-[420px] border border-slate-800 bg-cyber-card rounded-xl flex flex-col items-center justify-center p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-cyber-cyan/[0.03] animate-pulse" />
              <div className="relative z-10 flex flex-col items-center max-w-md w-full">
                <div className="w-16 h-16 rounded-full bg-cyber-darker border border-cyber-cyan/30 flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin" />
                  <Cpu className="w-6 h-6 text-cyber-cyan animate-pulse" />
                </div>
                <div className="w-full space-y-4">
                  {STAGES.map((stage, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center gap-3 transition-all duration-300',
                        i === analysisStage && 'opacity-100',
                        i < analysisStage && 'opacity-40',
                        i > analysisStage && 'opacity-0 translate-x-4',
                      )}
                    >
                      {i < analysisStage ? (
                        <CheckCircle2 className="w-4 h-4 text-status-safe shrink-0" />
                      ) : i === analysisStage ? (
                        <span className="w-4 h-4 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border-2 border-slate-700 shrink-0" />
                      )}
                      <span className={cn('text-sm font-medium', i === analysisStage ? 'text-cyber-cyan' : 'text-slate-400')}>
                        {stage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Blank / Awaiting */}
          {!analyzing && !showResult && (
            <div className="h-full min-h-[420px] border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-12 text-center text-slate-500">
              <ShieldCheck className="w-16 h-16 mb-4 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-400 mb-2">Awaiting Activity Data</h3>
              <p className="text-sm">Submit the form to run the AI risk analysis engine.</p>
            </div>
          )}

          {/* ═══ FULL RESULT ════════════════════════════════════ */}
          {!analyzing && showResult && analysisData && (
            <div className="space-y-5 result-enter">
              {/* ── 1. TOP BANNER ──────────────────────────────── */}
              <div
                className={cn(
                  'rounded-xl p-6 relative overflow-hidden border backdrop-blur-sm',
                  sevBorder(analysisData.severity),
                  sevGlow(analysisData.severity),
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
                  <div className="flex-1 min-w-0">
                    {/* Status label */}
                    <p
                      className={cn(
                        'text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2',
                        sevColor(analysisData.severity),
                      )}
                    >
                      {analysisData.is_anomaly ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                      {analysisData.is_anomaly ? 'Suspicious Behaviour Detected' : 'No Significant Threat Detected'}
                    </p>

                    {/* Main heading */}
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 uppercase tracking-tight">
                      {analysisData.is_anomaly ? 'Anomalous Activity Detected' : 'Normal Activity'}
                    </h2>

                    <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                      {analysisData.is_anomaly
                        ? 'The submitted activity deviates from established baseline patterns. Further investigation is recommended.'
                        : 'The submitted activity falls within expected behavioural parameters. No immediate security action required.'}
                    </p>

                    {/* Classification + Severity pills */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border',
                          analysisData.is_anomaly
                            ? 'bg-status-critical/10 text-status-critical border-status-critical/30'
                            : 'bg-status-safe/10 text-status-safe border-status-safe/30',
                        )}
                      >
                        {analysisData.classification}
                      </span>
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border',
                          analysisData.severity === 'Critical' && 'bg-status-critical/10 text-status-critical border-status-critical/30',
                          analysisData.severity === 'High' && 'bg-status-high/10 text-status-high border-status-high/30',
                          analysisData.severity === 'Medium' && 'bg-status-medium/10 text-status-medium border-status-medium/30',
                          analysisData.severity === 'Low' && 'bg-status-safe/10 text-status-safe border-status-safe/30',
                        )}
                      >
                        {analysisData.severity} Severity
                      </span>
                    </div>
                  </div>

                  {/* Gauge */}
                  <div className="shrink-0 flex flex-col items-center">
                    <RiskGauge score={analysisData.final_risk_score} severity={analysisData.severity} />
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2 font-semibold">
                      Final Risk Score
                    </p>
                  </div>
                </div>
              </div>

              {/* ── 2. TWO-COLUMN ANALYSIS CARDS ──────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* ML Anomaly Analysis */}
                <div className="bg-cyber-card border border-slate-800 rounded-xl p-5 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyber-cyan" /> ML Anomaly Analysis
                    </h3>
                    <div className="group/tip relative">
                      <Info className="w-4 h-4 text-slate-500 cursor-help" />
                      <div className="absolute right-0 bottom-full mb-2 w-64 bg-slate-800 border border-slate-700 text-xs text-slate-300 p-3 rounded-lg opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-30 shadow-xl">
                        This result was generated by an Isolation Forest model trained on normal employee activity patterns.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Model Used</p>
                      <p className="text-sm font-semibold text-slate-200">{analysisData.model}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Training Baseline</p>
                      <p className="text-sm font-semibold text-slate-200">
                        {analysisData.training_records.toLocaleString()} Records
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">ML Prediction</p>
                      <p
                        className={cn(
                          'text-sm font-bold uppercase',
                          analysisData.classification === 'Anomaly' ? 'text-status-high' : 'text-status-safe',
                        )}
                      >
                        {analysisData.classification}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Behaviour Difference</p>
                      <p className="text-sm font-semibold text-slate-200">{analysisData.behaviour_difference}</p>
                    </div>
                  </div>

                  {/* Confidence Visualization */}
                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex justify-between text-xs font-medium mb-2">
                      <span className="text-slate-400">ML Anomaly Score</span>
                      <span className={cn('font-bold', analysisData.ml_anomaly_score >= 60 ? 'text-status-high' : 'text-status-safe')}>
                        {analysisData.ml_anomaly_score}/100
                      </span>
                    </div>
                    {/* Gradient bar + indicator */}
                    <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-status-safe via-status-medium to-status-critical opacity-60 rounded-full" />
                    </div>
                    <div className="relative w-full h-0 mb-1">
                      <div
                        className="absolute -top-[11px] w-4 h-4 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)] border-2 border-slate-900 transition-all duration-1000 ease-out"
                        style={{ left: `clamp(0%, calc(${analysisData.ml_anomaly_score}% - 8px), calc(100% - 16px))` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] uppercase text-slate-500 mt-3 font-semibold tracking-wider">
                      <span>Normal Behaviour</span>
                      <span>Highly Unusual</span>
                    </div>
                    <p className="text-[10px] text-cyber-cyan text-center mt-3 font-semibold tracking-wide uppercase">
                      Real ML Prediction
                    </p>
                  </div>
                </div>

                {/* Cybersecurity Risk Analysis */}
                <div className="bg-cyber-card border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
                  <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-status-critical" /> Cybersecurity Risk Analysis
                  </h3>

                  <div className="space-y-3 flex-1">
                    {/* Rule-based */}
                    <div className="bg-cyber-darker rounded-lg p-3.5 border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-semibold text-slate-300">Rule-Based Security Risk</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Known security warning signs.</p>
                        </div>
                        <span className="text-xl font-bold text-white">
                          {analysisData.cybersecurity_risk_score}
                          <span className="text-xs text-slate-500">/100</span>
                        </span>
                      </div>
                    </div>

                    {/* Final combined */}
                    <div className="bg-cyber-darker rounded-lg p-3.5 border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-semibold text-slate-300">Final Combined Risk</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">ML anomaly + security indicators.</p>
                        </div>
                        <span className={cn('text-xl font-bold', sevColor(analysisData.severity))}>
                          {analysisData.final_risk_score}
                          <span className="text-xs text-slate-500">/100</span>
                        </span>
                      </div>
                    </div>

                    {/* Severity */}
                    <div className="bg-cyber-darker rounded-lg p-3.5 border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs font-semibold text-slate-300">Severity</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Based on final combined risk.</p>
                        </div>
                        <span className={cn('text-base font-bold uppercase', sevColor(analysisData.severity))}>
                          {analysisData.severity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      <strong className="text-slate-300">Formula:</strong> 40% ML Anomaly Score + 60% Cybersecurity Risk Score = Final Combined Risk.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── 3. ACTIVITY VS NORMAL BASELINE ────────────── */}
              {submittedData && (
                <div className="bg-cyber-card border border-slate-800 rounded-xl p-5 shadow-lg overflow-hidden">
                  <h3 className="text-xs font-bold text-white mb-1 uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyber-cyan" /> Activity vs Normal Baseline
                  </h3>
                  <p className="text-[10px] text-slate-500 mb-4">Comparison with Training Baseline</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-[10px] uppercase tracking-wider text-slate-500 bg-cyber-darker border-y border-slate-800">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">Activity</th>
                          <th className="py-2.5 px-4 font-semibold">Current</th>
                          <th className="py-2.5 px-4 font-semibold">Normal Baseline</th>
                          <th className="py-2.5 px-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {baselineRows.map((row, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-2.5 px-4 text-slate-300 text-xs font-medium">{row.label}</td>
                            <td className="py-2.5 px-4 text-white font-semibold text-xs">{row.current}</td>
                            <td className="py-2.5 px-4 text-slate-400 text-xs">{row.baseline}</td>
                            <td className="py-2.5 px-4">
                              <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold', statusBadge(row.status))}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── 4. WHY WAS THIS ACTIVITY FLAGGED? ─────────── */}
              <div className="bg-cyber-card border border-slate-800 rounded-xl p-5 shadow-lg">
                <h3 className="text-xs font-bold text-white mb-1 uppercase tracking-wider flex items-center gap-2">
                  <FileWarning className="w-4 h-4 text-status-high" /> Why Was This Activity Flagged?
                </h3>
                <p className="text-[10px] text-slate-500 mb-4">Cybersecurity Risk Indicators</p>

                {analysisData.reasons.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysisData.reasons.map((reason: string, i: number) => {
                      const { title, icon } = parseEvidence(reason);
                      return (
                        <div
                          key={i}
                          className="bg-cyber-darker border border-slate-700/50 rounded-lg p-4 flex gap-3 hover:border-slate-600 transition-colors"
                        >
                          <div className="shrink-0 w-9 h-9 rounded-lg bg-status-high/10 flex items-center justify-center text-status-high">
                            {icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-200 mb-0.5">{title}</p>
                            <p className="text-xs text-slate-400 leading-relaxed">{reason}.</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-cyber-darker border border-slate-700/50 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <ShieldCheck className="w-8 h-8 text-status-safe mb-2" />
                    <p className="text-sm font-medium text-slate-300">No rule-based security risk indicators were triggered.</p>
                  </div>
                )}
              </div>

              {/* ── 5. HOW WAS THIS RESULT GENERATED? ─────────── */}
              <div className="bg-cyber-card border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <button
                  onClick={() => setWorkflowOpen((o) => !o)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <GitMerge className="w-4 h-4 text-cyber-cyan" /> How Was This Result Generated?
                  </h3>
                  {workflowOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {workflowOpen && (
                  <div className="px-5 pb-6 border-t border-slate-800 bg-cyber-darker/50">
                    <div className="py-6 flex flex-col items-center space-y-1.5 max-w-md mx-auto">
                      {/* Step nodes */}
                      {[
                        { text: 'New Employee Activity', icon: <Activity className="w-4 h-4 text-slate-400" />, cls: 'bg-slate-800 border-slate-700' },
                        { text: 'FastAPI Backend Received the Activity', icon: <Network className="w-4 h-4 text-cyber-cyan" />, cls: 'bg-cyber-blue/15 border-cyber-blue/30' },
                        { text: 'Isolation Forest Compared It With the Learned Normal-Behaviour Baseline', icon: <Cpu className="w-4 h-4 text-purple-400" />, cls: 'bg-purple-500/10 border-purple-500/30' },
                        { text: 'ML Generated a Real Anomaly Prediction and Score', icon: <Cpu className="w-4 h-4 text-cyber-cyan" />, cls: 'bg-cyber-card border-slate-700' },
                        { text: 'Cybersecurity Risk Engine Checked Known Security Indicators', icon: <ShieldAlert className="w-4 h-4 text-status-critical" />, cls: 'bg-cyber-card border-slate-700' },
                        { text: 'ML Score and Cybersecurity Risk Were Combined', icon: <GitMerge className="w-4 h-4 text-slate-400" />, cls: 'bg-slate-800 border-slate-700' },
                        { text: 'Final Risk, Severity, and Evidence Were Generated', icon: <Shield className="w-4 h-4 text-white" />, cls: cn('border', sevBorder(analysisData.severity)) },
                      ].map((step, i, arr) => (
                        <div key={i} className="flex flex-col items-center w-full">
                          <div
                            className={cn(
                              'w-full px-4 py-2.5 rounded-lg border text-sm font-medium text-white flex items-center gap-2.5 justify-center text-center',
                              step.cls,
                            )}
                          >
                            {step.icon}
                            <span className="leading-tight">{step.text}</span>
                          </div>
                          {i < arr.length - 1 && <ArrowDown className="w-4 h-4 text-slate-600 my-1 shrink-0" />}
                        </div>
                      ))}
                    </div>

                    <p className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 mt-2">
                      <Info className="w-3.5 h-3.5" />
                      The result is dynamically generated from the submitted activity. Predictions and scores are not hard-coded.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
