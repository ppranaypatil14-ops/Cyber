import { useState } from 'react';
import { Beaker, ShieldAlert, ChevronRight, CheckCircle2, Activity, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function SecurityTestingLab() {
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setShowResult(false);
    
    // Mock API call
    setTimeout(() => {
      setAnalyzing(false);
      setShowResult(true);
    }, 1500);
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
                <input required type="text" defaultValue="Employee-021" className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Login Time</label>
                <input required type="time" defaultValue="02:15" className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Failed Login Attempts</label>
                <input required type="number" min="0" defaultValue="5" className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Device Status</label>
                <select className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors">
                  <option value="unknown">Unknown Device</option>
                  <option value="known">Known Device</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">IP Address</label>
                <input required type="text" defaultValue="192.168.1.45" className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Login Location</label>
                <input required type="text" defaultValue="Moscow, RU" className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Download (MB)</label>
                <input required type="number" min="0" defaultValue="4500" className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Antivirus Status</label>
                <select className="w-full bg-cyber-darker border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyber-cyan transition-colors">
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
                  <input type="radio" name="sensitive" defaultChecked className="accent-cyber-cyan" /> Yes
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="sensitive" className="accent-cyber-cyan" /> No
                </label>
              </div>
            </div>

            {/* TODO: Add FastAPI backend integration here later */}
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
          {showResult ? (
            <div className="bg-cyber-card border border-status-critical/30 rounded-xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.1)] relative overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-status-critical/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-status-critical" />
                    Analysis Result
                  </h2>
                  <p className="text-status-critical font-medium text-sm mt-1">CRITICAL THREAT DETECTED</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Risk Score</p>
                  <p className="text-3xl font-bold text-status-critical">94<span className="text-sm text-slate-500">/100</span></p>
                </div>
              </div>

              <div className="space-y-6">
                
                <div className="p-4 bg-cyber-darker rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Possible Attack</p>
                  <p className="text-lg font-bold text-white">Account Compromise</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Evidence</p>
                  <ul className="space-y-2">
                    {[
                      'Login occurred outside normal working hours',
                      'Unknown device detected',
                      'Multiple failed login attempts',
                      'Sensitive files accessed',
                      'Unusually large data transfer'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <ChevronRight className="w-4 h-4 text-status-critical shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-cyber-darker rounded-lg border border-slate-800">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Attack Stage</p>
                    <p className="text-sm font-semibold text-status-high">Credential Access</p>
                  </div>
                  <div className="p-3 bg-cyber-darker rounded-lg border border-slate-800 relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-cyber-cyan"></div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Predicted Next Attack</p>
                    <p className="text-sm font-semibold text-cyber-cyan mb-1">Data Exfiltration</p>
                    <p className="text-xs text-slate-400">Confidence: 87%</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recommended Response</p>
                  <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <p className="text-sm text-slate-200">
                      Lock account and isolate affected device.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 py-2.5 bg-status-critical hover:bg-status-critical/90 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-status-critical/20">
                    Approve Response
                  </button>
                  <button className="flex-1 py-2.5 bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-cyan border border-cyber-blue/30 text-sm font-bold rounded-lg transition-colors">
                    Start Investigation
                  </button>
                  <button className="flex-1 py-2.5 bg-cyber-darker hover:bg-slate-800 text-slate-300 border border-slate-700 text-sm font-bold rounded-lg transition-colors">
                    Generate Report
                  </button>
                </div>

              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-12 text-center text-slate-500">
              <ShieldCheck className="w-16 h-16 mb-4 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-400 mb-2">Awaiting Activity Data</h3>
              <p className="text-sm">Submit the form to run the mock AI risk analysis engine.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
