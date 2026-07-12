import { useState } from 'react';
import { Beaker, ShieldAlert, ChevronRight, Activity, ShieldCheck, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function SecurityTestingLab() {
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    loginTime: '02:15',
    failedLogins: 5,
    deviceStatus: 'unknown', // 'known' or 'unknown'
    downloadMb: 4500,
    antivirusStatus: 'disabled', // 'active' or 'disabled'
    sensitiveAccess: 'yes' // 'yes' or 'no'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setShowResult(false);
    setError(null);
    
    // Parse values for API
    const loginHour = parseInt(formData.loginTime.split(':')[0], 10);
    const failedLogins = parseInt(formData.failedLogins.toString(), 10);
    const knownDevice = formData.deviceStatus === 'known' ? 1 : 0;
    const downloadMb = parseFloat(formData.downloadMb.toString());
    const antivirusActive = formData.antivirusStatus === 'active' ? 1 : 0;
    const sensitiveFileAccess = formData.sensitiveAccess === 'yes' ? 1 : 0;

    const payload = {
      login_hour: loginHour,
      failed_logins: failedLogins,
      known_device: knownDevice,
      download_mb: downloadMb,
      sensitive_file_access: sensitiveFileAccess,
      antivirus_active: antivirusActive
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysisData(data);
      setShowResult(true);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend. Is FastAPI running?');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="border-b border-cyber-card pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
          <Beaker className="w-6 h-6 text-cyber-cyan" />
          AI Security Testing Lab
        </h1>
        <p className="text-slate-400 text-sm">Enter custom user and system activity to test the cyber-risk detection engine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-3">Simulate Activity</h2>
          
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Employee / User ID</label>
                <input type="text" defaultValue="Employee-021" className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Login Time</label>
                <input required name="loginTime" value={formData.loginTime} onChange={handleInputChange} type="time" className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Failed Login Attempts</label>
                <input required name="failedLogins" value={formData.failedLogins} onChange={handleInputChange} type="number" min="0" className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Device Status</label>
                <select name="deviceStatus" value={formData.deviceStatus} onChange={handleInputChange} className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors">
                  <option value="unknown">Unknown Device</option>
                  <option value="known">Known Device</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">IP Address</label>
                <input type="text" defaultValue="192.168.1.45" className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Login Location</label>
                <input type="text" defaultValue="Moscow, RU" className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Download (MB)</label>
                <input required name="downloadMb" value={formData.downloadMb} onChange={handleInputChange} type="number" min="0" step="0.1" className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Antivirus Status</label>
                <select name="antivirusStatus" value={formData.antivirusStatus} onChange={handleInputChange} className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors">
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                Sensitive Files Accessed
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="sensitiveAccess" value="yes" checked={formData.sensitiveAccess === 'yes'} onChange={handleInputChange} className="accent-cyber-cyan" /> Yes
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="sensitiveAccess" value="no" checked={formData.sensitiveAccess === 'no'} onChange={handleInputChange} className="accent-cyber-cyan" /> No
                </label>
              </div>
            </div>

            {error && (
              <div className="p-3 mt-4 bg-status-critical/10 border border-status-critical/30 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-status-critical shrink-0" />
                <p className="text-sm text-status-critical">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={analyzing}
              className="w-full mt-6 py-3 bg-cyber-blue hover:bg-cyber-blue/80 disabled:opacity-50 text-white font-bold rounded-lg transition-colors shadow-lg shadow-cyber-blue/20 flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing Activity...
                </>
              ) : (
                <>
                  Analyze Security Activity
                  <Activity className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Analysis Result */}
        <div>
          {showResult && analysisData ? (
            <div className={cn("border rounded-xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-300", 
              analysisData.is_anomaly ? "bg-cyber-card border-status-critical/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]" : "bg-cyber-card border-status-safe/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
            )}>
              <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10",
                analysisData.is_anomaly ? "bg-status-critical/10" : "bg-status-safe/10"
              )}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {analysisData.is_anomaly ? <ShieldAlert className="w-5 h-5 text-status-critical" /> : <ShieldCheck className="w-5 h-5 text-status-safe" />}
                    Analysis Result
                  </h2>
                  <p className={cn("font-medium text-sm mt-1 uppercase", analysisData.is_anomaly ? "text-status-critical" : "text-status-safe")}>
                    {analysisData.is_anomaly ? "THREAT DETECTED" : "NORMAL ACTIVITY"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Risk Score</p>
                  <p className={cn("text-3xl font-bold", analysisData.is_anomaly ? "text-status-critical" : "text-status-safe")}>
                    {analysisData.risk_score}<span className="text-sm text-slate-500">/100</span>
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                
                <div className="p-4 bg-cyber-darker rounded-lg border border-slate-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Classification</p>
                      <p className="text-lg font-bold text-white">{analysisData.classification}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Severity</p>
                      <p className={cn("text-lg font-bold", 
                        analysisData.severity === 'Critical' ? 'text-status-critical' :
                        analysisData.severity === 'High' ? 'text-status-high' :
                        analysisData.severity === 'Medium' ? 'text-status-medium' :
                        'text-status-safe'
                      )}>{analysisData.severity}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Model Used</p>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Shield className="w-4 h-4 text-cyber-cyan" />
                    {analysisData.model}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Evidence / Reasons</p>
                  {analysisData.reasons.length > 0 ? (
                    <ul className="space-y-2">
                      {analysisData.reasons.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <ChevronRight className="w-4 h-4 text-status-critical shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-status-safe" />
                      No suspicious patterns detected
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-12 text-center text-slate-500">
              <ShieldCheck className="w-16 h-16 mb-4 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-400 mb-2">Awaiting Activity Data</h3>
              <p className="text-sm">Submit the form to run the AI risk analysis engine.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
