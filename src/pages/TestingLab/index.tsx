import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import {
  Beaker, ShieldAlert, Activity, ShieldCheck,
  Shield, AlertTriangle, Cpu, Network,
  Clock, Smartphone, Download, FileWarning, Fingerprint, 
  Lock, Database, ArrowDown, Globe, UploadCloud, FileJson, 
  TerminalSquare, CheckCircle, Crosshair
} from 'lucide-react';
import { cn } from '../../utils/cn';

function RiskGauge({ score }: { score: number }) {
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (score / 100) * circumference;

  let gaugeColor = '#10b981'; // safe
  if (score >= 75) gaugeColor = '#ef4444'; // critical
  else if (score >= 50) gaugeColor = '#f97316'; // high
  else if (score >= 25) gaugeColor = '#f59e0b'; // medium

  return (
    <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
      <svg width={radius * 2} height={radius * 2} className="transform -rotate-90">
        <circle cx={radius} cy={radius} r={normalizedRadius} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        <circle
          cx={radius} cy={radius} r={normalizedRadius} fill="none"
          stroke={gaugeColor} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-white leading-none">{score}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-semibold">/ 100</span>
      </div>
    </div>
  );
}

export default function SecurityTestingLab() {
  const [inputMode, setInputMode] = useState<'manual' | 'upload'>('manual');
  
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setShowResult(false);
    setError(null);

    try {
      let response;
      if (inputMode === 'manual') {
        const payload = {
          username: formData.username.trim() || 'anonymous',
          loginTime: formData.loginTime,
          failedLoginCount: Number(formData.failedLoginCount) || 0,
          deviceType: formData.deviceType,
          knownDevice: formData.knownDevice === 'true',
          ipAddress: formData.ipAddress.trim() || '0.0.0.0',
          country: formData.country.trim() || 'Unknown',
          fileAccessed: formData.fileAccessed.trim(),
          downloadSizeMB: Number(formData.downloadSizeMB) || 0,
          usbConnected: formData.usbConnected === 'true',
          vpnUsed: formData.vpnUsed === 'true',
          timestamp: formData.timestamp ? new Date(formData.timestamp).toISOString() : new Date().toISOString(),
        };

        response = await fetch('http://localhost:3001/api/security-lab/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        if (!selectedFile) {
          throw new Error('Please select a file to upload.');
        }
        const fd = new FormData();
        fd.append('file', selectedFile);

        response = await fetch('http://localhost:3001/api/security-lab/upload-logs', {
          method: 'POST',
          body: fd,
        });
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysisData(data);
      setShowResult(true);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend.');
    } finally {
      setAnalyzing(false);
    }
  };

  const generatePDF = () => {
    if (!analysisData) return;

    const doc = new jsPDF();
    const marginX = 20;
    let posY = 20;

    const addText = (text: string, size: number = 12, isBold: boolean = false) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      
      const lines = doc.splitTextToSize(text, 170);
      doc.text(lines, marginX, posY);
      posY += (lines.length * (size * 0.4)) + 5;
    };

    addText("Security Lab - Incident Report", 22, true);
    posY += 5;
    
    addText(`Incident ID: ${analysisData.request_id || "INC-" + Math.floor(Math.random() * 10000)}`, 12, true);
    addText(`Date & Time: ${new Date().toLocaleString()}`);
    addText(`User: ${formData.username || "Unknown"}`);
    posY += 5;

    addText("Risk Score:", 14, true);
    addText(`${analysisData["Risk Score"]} / 100 (${analysisData["Confidence Percentage"]} Confidence)`);
    posY += 5;

    addText("Detected Attack Type:", 14, true);
    addText(analysisData["Attack Type"]);
    posY += 5;

    addText("Evidence:", 14, true);
    if (analysisData["Evidence"] && analysisData["Evidence"].length > 0) {
      analysisData["Evidence"].forEach((ev: string) => addText(`• ${ev}`));
    } else {
      addText("No suspicious evidence found.");
    }
    posY += 5;

    addText("Attack Timeline:", 14, true);
    if (analysisData["Attack Timeline"] && analysisData["Attack Timeline"].length > 0) {
      analysisData["Attack Timeline"].forEach((t: any) => {
        addText(`[${new Date(t.timestamp).toLocaleTimeString()}] ${t.user}: ${t.event}`);
      });
    } else {
      addText("No events logged.");
    }
    posY += 5;

    if (posY > 250) { doc.addPage(); posY = 20; }

    addText("Predicted Next Action:", 14, true);
    addText(analysisData["Predicted Next Action"]);
    posY += 5;

    addText("MITRE ATT&CK Mapping:", 14, true);
    if (analysisData["MITRE ATT&CK Stages"] && analysisData["MITRE ATT&CK Stages"].length > 0) {
      addText(analysisData["MITRE ATT&CK Stages"].join(', '));
    } else {
      addText("None");
    }
    posY += 5;

    if (posY > 250) { doc.addPage(); posY = 20; }

    addText("Recommended Response:", 14, true);
    addText(analysisData["Recommended Response"]);
    posY += 5;

    addText("Conclusion:", 14, true);
    const conclusion = analysisData["Risk Score"] > 75 
      ? "Critical threat detected. The automated containment procedures have been initiated. Review the evidence immediately to verify the extent of the compromise." 
      : analysisData["Risk Score"] > 50 
      ? "Suspicious behavior flagged. Continued monitoring and immediate investigation are required." 
      : "The activity appears to be benign. No immediate security action is required at this time.";
    addText(conclusion);

    doc.save(`Incident_Report_${analysisData.request_id || "Report"}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="border-b border-cyber-card pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
          <Beaker className="w-6 h-6 text-cyber-cyan" />
          Security Lab Dashboard
        </h1>
        <p className="text-slate-400 text-sm">
          Ingest security logs or simulate activities to evaluate the AI Threat Correlation Engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── LEFT: INPUT FORM ────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg">
            
            {/* Toggle Mode */}
            <div className="flex bg-slate-900 rounded-lg p-1 mb-6 border border-slate-800">
              <button
                type="button"
                onClick={() => setInputMode('manual')}
                className={cn('flex-1 py-2 text-xs font-semibold rounded-md transition-colors', inputMode === 'manual' ? 'bg-cyber-blue text-white' : 'text-slate-400 hover:text-white')}
              >
                Manual Entry
              </button>
              <button
                type="button"
                onClick={() => setInputMode('upload')}
                className={cn('flex-1 py-2 text-xs font-semibold rounded-md transition-colors', inputMode === 'upload' ? 'bg-cyber-blue text-white' : 'text-slate-400 hover:text-white')}
              >
                Upload Logs
              </button>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              {inputMode === 'manual' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold uppercase">Username</label>
                      <input required name="username" value={formData.username} onChange={handleInputChange} type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold uppercase">Login Time</label>
                      <input required name="loginTime" value={formData.loginTime} onChange={handleInputChange} type="time" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold uppercase">Failed Logins</label>
                      <input required name="failedLoginCount" value={formData.failedLoginCount} onChange={handleInputChange} type="number" min="0" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold uppercase">Device</label>
                      <select name="deviceType" value={formData.deviceType} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm">
                        <option value="desktop">Desktop</option>
                        <option value="laptop">Laptop</option>
                        <option value="mobile">Mobile</option>
                        <option value="server">Server</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold uppercase">Known Device</label>
                      <select name="knownDevice" value={formData.knownDevice} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold uppercase">IP Address</label>
                      <input required name="ipAddress" value={formData.ipAddress} onChange={handleInputChange} type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold uppercase">Country</label>
                      <input required name="country" value={formData.country} onChange={handleInputChange} type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold uppercase">File Accessed</label>
                      <input name="fileAccessed" value={formData.fileAccessed} onChange={handleInputChange} type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold uppercase">Download (MB)</label>
                      <input required name="downloadSizeMB" value={formData.downloadSizeMB} onChange={handleInputChange} type="number" min="0" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold uppercase">USB Connected</label>
                      <select name="usbConnected" value={formData.usbConnected} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm">
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <div 
                  className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5 cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json,.csv" />
                  <UploadCloud className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-white mb-1">
                    {selectedFile ? selectedFile.name : 'Click to upload log file'}
                  </p>
                  <p className="text-xs text-slate-500">Supports .CSV or .JSON</p>
                </div>
              )}

              {error && (
                <div className="p-3 mt-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-xs text-red-500">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={analyzing}
                className="w-full py-3.5 mt-2 bg-cyber-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2"
              >
                {analyzing ? 'Analyzing Engine...' : 'Run Analysis'}
                {!analyzing && <Activity className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>

        {/* ── RIGHT: RESULT PANEL ───────────────────────────────────────── */}
        <div className="lg:col-span-8">
          {!showResult && !analyzing && (
            <div className="h-full min-h-[400px] border border-slate-800 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <ShieldCheck className="w-16 h-16 mb-4 text-slate-700" />
              <h3 className="text-lg font-medium text-slate-400">Security Lab Dashboard</h3>
              <p className="text-sm mt-2">Enter data or upload a file to evaluate logs.</p>
            </div>
          )}

          {analyzing && (
            <div className="h-full min-h-[400px] border border-slate-800 bg-cyber-card rounded-xl flex flex-col items-center justify-center p-12 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full border-2 border-cyber-cyan border-t-transparent animate-spin mb-4" />
              <p className="text-cyber-cyan font-bold animate-pulse">Running Correlation Engine...</p>
            </div>
          )}

          {showResult && analysisData && (
            <div className="space-y-6">
              
              {/* Top Banner (Risk Score & Attack Type) */}
              <div className="bg-cyber-darker border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-status-critical" /> Detected Attack Type
                  </p>
                  <h2 className="text-2xl font-extrabold text-white uppercase">{analysisData["Attack Type"]}</h2>
                  <p className="text-sm text-slate-400 mt-2">Confidence: <span className="text-cyber-cyan font-bold">{analysisData["Confidence Percentage"]}</span></p>
                </div>
                <div className="flex-1 flex justify-center sm:justify-end pr-0 sm:pr-4">
                  <button onClick={generatePDF} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-slate-700 shadow-md">
                    <Download className="w-4 h-4" /> Download PDF Report
                  </button>
                </div>
                <div className="shrink-0 flex flex-col items-center">
                  <RiskGauge score={analysisData["Risk Score"]} />
                  <p className="text-xs text-slate-400 font-bold uppercase mt-3">Risk Score</p>
                </div>
              </div>

              {/* Grid Layout for details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Evidence & MITRE */}
                <div className="space-y-6">
                  <div className="bg-cyber-card border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                      Detected Evidence
                    </h3>
                    <ul className="space-y-3 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                      {analysisData["Evidence"]?.length > 0 ? (
                        analysisData["Evidence"].map((ev: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                            <AlertTriangle className="w-4 h-4 text-status-high shrink-0 mt-0.5" />
                            {ev}
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-status-safe flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> No suspicious evidence found.
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-cyber-card border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                      MITRE ATT&CK Flow
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisData["MITRE ATT&CK Stages"]?.length > 0 ? (
                        analysisData["MITRE ATT&CK Stages"].map((stage: string, idx: number) => (
                          <span key={idx} className="px-2.5 py-1 text-[11px] font-bold uppercase bg-slate-800 text-purple-400 border border-purple-900 rounded">
                            {stage}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">None mapped</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Prediction & Response */}
                <div className="space-y-6">
                  <div className="bg-cyber-card border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyber-cyan" /> Predicted Next Attack
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {analysisData["Predicted Next Action"]}
                    </p>
                  </div>

                  <div className="bg-cyber-card border border-slate-800 rounded-xl p-5 shadow-lg">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-status-medium" /> Incident Report
                    </h3>
                    <div className="bg-slate-900 rounded p-4 text-sm text-slate-300 border border-slate-800">
                      <p className="mb-3"><strong className="text-white">Recommendation:</strong> {analysisData["Recommended Response"]}</p>
                      
                      {analysisData["Simulated Actions"] && analysisData["Simulated Actions"].length > 0 && (
                        <div className="mt-4 border-t border-slate-800 pt-3">
                          <p className="text-xs font-bold text-status-critical uppercase mb-2">Automated SOAR Actions Triggered:</p>
                          <ul className="space-y-2">
                            {analysisData["Simulated Actions"].map((act: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                                <TerminalSquare className="w-3.5 h-3.5 text-cyber-cyan" /> {act}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-cyber-card border border-slate-800 rounded-xl p-5 shadow-lg">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                  Attack Timeline
                </h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {analysisData["Attack Timeline"]?.map((t: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-24 shrink-0 text-xs text-slate-500 font-mono mt-0.5">
                        {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="w-px h-full bg-slate-800 relative min-h-[30px]">
                        <span className="absolute top-1 -left-1 w-2 h-2 rounded-full bg-cyber-blue" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-semibold text-white">{t.user}</p>
                        <p className={cn("text-xs mt-1", t.event.includes('Anomaly') ? "text-status-critical" : "text-slate-400")}>
                          {t.event}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!analysisData["Attack Timeline"] || analysisData["Attack Timeline"].length === 0) && (
                    <p className="text-sm text-slate-500">No events logged.</p>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
