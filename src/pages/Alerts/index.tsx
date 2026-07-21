import { useState } from 'react';
import { Search, Filter, Calendar, ShieldAlert, X, ShieldCheck, ChevronRight, Activity, Sparkles, Bot } from 'lucide-react';
import { detailedAlerts } from '../../data/mockAlertsData';
import { cn } from '../../utils/cn';

export default function LiveAlerts() {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [filter, setFilter] = useState('All');

  const filteredAlerts = filter === 'All' 
    ? detailedAlerts 
    : detailedAlerts.filter(a => a.severity === filter);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 animate-in fade-in duration-500">
      
      {/* Main Alerts List */}
      <div className={cn("flex flex-col flex-1 bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300", selectedAlert ? "lg:w-2/3" : "w-full")}>
        
        {/* Header & Filters */}
        <div className="p-6 border-b border-emerald-500/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-400" />
                Live Security Alerts
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </h1>
              <p className="text-xs text-slate-400 mt-1">Real-time threat detection feed</p>
            </div>
            <button className="px-4 py-2 bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2 border border-emerald-500/30">
              <Filter className="w-3.5 h-3.5" />
              Advanced Filters
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search alerts, devices, IP..." 
                className="w-full bg-[#030d09] border border-emerald-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
            
            {/* Severity Tabs */}
            <div className="flex p-1 bg-[#030d09] border border-emerald-500/10 rounded-xl">
              {['All', 'Critical', 'High', 'Medium', 'Low'].map(lvl => (
                <button 
                  key={lvl}
                  onClick={() => setFilter(lvl)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                    filter === lvl ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md" : "text-slate-400 hover:text-white"
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Date Filter */}
            <button className="flex items-center gap-2 px-3 py-2 bg-[#030d09] border border-emerald-500/15 rounded-xl text-xs text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all font-medium">
              <Calendar className="w-3.5 h-3.5" />
              Last 24 Hours
            </button>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#030d09] sticky top-0 z-10">
              <tr className="border-b border-emerald-500/10 text-slate-400">
                <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Severity</th>
                <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Attack Name</th>
                <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Device / User</th>
                <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Detection Time</th>
                <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/5">
              {filteredAlerts.map((alert) => (
                <tr 
                  key={alert.id} 
                  onClick={() => setSelectedAlert(alert)}
                  className={cn(
                    "transition-all cursor-pointer",
                    selectedAlert?.id === alert.id ? "bg-emerald-900/20 border-l-2 border-l-emerald-400" : "hover:bg-emerald-900/10 border-l-2 border-l-transparent"
                  )}
                >
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                      alert.severity === 'Critical' ? "bg-red-500/15 text-red-400 border border-red-500/20" :
                      alert.severity === 'High' ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" :
                      "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                    )}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white text-xs">{alert.attackName}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{alert.userDevice}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-mono">{alert.detectionTime}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#030d09] rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-500", alert.riskScore > 80 ? "bg-red-500" : alert.riskScore > 60 ? "bg-orange-500" : "bg-amber-500")} 
                          style={{ width: `${alert.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-white">{alert.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                      {alert.status === 'Investigating' && <Activity className="w-3.5 h-3.5 text-cyan-400" />}
                      {alert.status === 'Contained' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      {alert.status === 'Monitoring' && <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />}
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAlerts.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
              <ShieldCheck className="w-12 h-12 mb-4 opacity-50 text-emerald-400" />
              <p className="text-sm font-medium">No alerts found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Alert Details Panel */}
      {selectedAlert && (
        <div className="w-1/3 bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
          <div className="p-4 border-b border-emerald-500/10 flex justify-between items-center bg-[#030d09]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Alert Details</h2>
            <button 
              onClick={() => setSelectedAlert(null)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-emerald-900/30 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
            
            {/* Summary Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <span className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                  selectedAlert.severity === 'Critical' ? "bg-red-500/15 text-red-400 border border-red-500/20" :
                  selectedAlert.severity === 'High' ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" :
                  "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                )}>
                  {selectedAlert.severity}
                </span>
                <span className="text-xs font-mono text-slate-500">{selectedAlert.id}</span>
              </div>
              <h3 className="text-lg font-black text-white">{selectedAlert.attackName}</h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#030d09] rounded-xl border border-emerald-500/10">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Affected Asset</p>
                <p className="text-xs font-bold text-white">{selectedAlert.userDevice}</p>
              </div>
              <div className="p-3 bg-[#030d09] rounded-xl border border-emerald-500/10">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">IP Address</p>
                <p className="text-xs font-bold text-white font-mono">{selectedAlert.ipAddress}</p>
              </div>
              <div className="p-3 bg-[#030d09] rounded-xl border border-emerald-500/10">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Detection Time</p>
                <p className="text-xs font-bold text-white">{selectedAlert.detectionTime}</p>
              </div>
              <div className="p-3 bg-[#030d09] rounded-xl border border-emerald-500/10">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Risk Score</p>
                <p className={cn("text-xs font-black", selectedAlert.riskScore > 80 ? "text-red-400" : "text-orange-400")}>
                  {selectedAlert.riskScore}/100
                </p>
              </div>
            </div>

            {/* Evidence */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-300 mb-3 uppercase tracking-wider">Detection Evidence</h4>
              <ul className="space-y-2">
                {selectedAlert.evidence.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 p-2 bg-[#030d09] border border-emerald-500/10 rounded-xl">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Explanation */}
            <div className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">
              <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                AI Security Analysis
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedAlert.aiExplanation}
              </p>
            </div>

            {/* Recommended Response */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-300 mb-3 uppercase tracking-wider">Recommended Response</h4>
              <div className="p-3 bg-[#030d09] border border-emerald-500/10 rounded-xl">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedAlert.recommendedResponse}
                </p>
              </div>
            </div>

          </div>
          
          <div className="p-4 border-t border-emerald-500/10 bg-[#030d09] flex gap-3">
            <button className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/30">
              Investigate Further
            </button>
            <button className="flex-1 py-2.5 bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all">
              Mark Resolved
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
