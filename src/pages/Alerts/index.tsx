import { useState } from 'react';
import { Search, Filter, Calendar, ShieldAlert, X, ShieldCheck, ChevronRight, Activity } from 'lucide-react';
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
      <div className={cn("flex flex-col flex-1 bg-cyber-card border border-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300", selectedAlert ? "lg:w-2/3" : "w-full")}>
        
        {/* Header & Filters */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Live Security Alerts</h1>
            <button className="px-4 py-2 bg-cyber-blue hover:bg-cyber-blue/80 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search alerts, devices, IP..." 
                className="w-full bg-cyber-darker border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyber-cyan transition-colors"
              />
            </div>
            
            {/* Severity Tabs */}
            <div className="flex p-1 bg-cyber-darker border border-slate-800 rounded-lg">
              {['All', 'Critical', 'High', 'Medium', 'Low'].map(lvl => (
                <button 
                  key={lvl}
                  onClick={() => setFilter(lvl)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-medium rounded-md transition-colors",
                    filter === lvl ? "bg-cyber-card text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Date Filter */}
            <button className="flex items-center gap-2 px-3 py-2 bg-cyber-darker border border-slate-800 rounded-lg text-sm text-slate-300 hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
              Last 24 Hours
            </button>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-cyber-darker sticky top-0 z-10">
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-6 py-4 font-medium">Severity</th>
                <th className="px-6 py-4 font-medium">Attack Name</th>
                <th className="px-6 py-4 font-medium">Device / User</th>
                <th className="px-6 py-4 font-medium">Detection Time</th>
                <th className="px-6 py-4 font-medium">Risk Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAlerts.map((alert) => (
                <tr 
                  key={alert.id} 
                  onClick={() => setSelectedAlert(alert)}
                  className={cn(
                    "transition-colors cursor-pointer",
                    selectedAlert?.id === alert.id ? "bg-cyber-blue/10 border-l-2 border-l-cyber-cyan" : "hover:bg-slate-800/20 border-l-2 border-l-transparent"
                  )}
                >
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider",
                      alert.severity === 'Critical' ? "bg-status-critical/10 text-status-critical border border-status-critical/20" :
                      alert.severity === 'High' ? "bg-status-high/10 text-status-high border border-status-high/20" :
                      "bg-status-medium/10 text-status-medium border border-status-medium/20"
                    )}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-200">{alert.attackName}</td>
                  <td className="px-6 py-4 text-slate-400">{alert.userDevice}</td>
                  <td className="px-6 py-4 text-slate-400">{alert.detectionTime}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", alert.riskScore > 80 ? "bg-status-critical" : alert.riskScore > 60 ? "bg-status-high" : "bg-status-medium")} 
                          style={{ width: `${alert.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-slate-300">{alert.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                      {alert.status === 'Investigating' && <Activity className="w-3.5 h-3.5 text-cyber-cyan" />}
                      {alert.status === 'Contained' && <ShieldCheck className="w-3.5 h-3.5 text-status-safe" />}
                      {alert.status === 'Monitoring' && <ShieldAlert className="w-3.5 h-3.5 text-status-high" />}
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAlerts.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500">
              <ShieldCheck className="w-12 h-12 mb-4 opacity-50" />
              <p>No alerts found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Alert Details Panel */}
      {selectedAlert && (
        <div className="w-1/3 bg-cyber-card border border-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-cyber-darker">
            <h2 className="text-lg font-bold text-white">Alert Details</h2>
            <button 
              onClick={() => setSelectedAlert(null)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Summary Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <span className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider",
                  selectedAlert.severity === 'Critical' ? "bg-status-critical/10 text-status-critical border border-status-critical/20" :
                  selectedAlert.severity === 'High' ? "bg-status-high/10 text-status-high border border-status-high/20" :
                  "bg-status-medium/10 text-status-medium border border-status-medium/20"
                )}>
                  {selectedAlert.severity}
                </span>
                <span className="text-sm font-medium text-slate-400">{selectedAlert.id}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedAlert.attackName}</h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-cyber-darker rounded-lg border border-slate-800">
                <p className="text-xs text-slate-500 uppercase font-medium mb-1">Affected Asset</p>
                <p className="text-sm font-semibold text-white">{selectedAlert.userDevice}</p>
              </div>
              <div className="p-3 bg-cyber-darker rounded-lg border border-slate-800">
                <p className="text-xs text-slate-500 uppercase font-medium mb-1">IP Address</p>
                <p className="text-sm font-semibold text-white">{selectedAlert.ipAddress}</p>
              </div>
              <div className="p-3 bg-cyber-darker rounded-lg border border-slate-800">
                <p className="text-xs text-slate-500 uppercase font-medium mb-1">Detection Time</p>
                <p className="text-sm font-semibold text-white">{selectedAlert.detectionTime}</p>
              </div>
              <div className="p-3 bg-cyber-darker rounded-lg border border-slate-800">
                <p className="text-xs text-slate-500 uppercase font-medium mb-1">Risk Score</p>
                <p className={cn("text-sm font-bold", selectedAlert.riskScore > 80 ? "text-status-critical" : "text-status-high")}>
                  {selectedAlert.riskScore}/100
                </p>
              </div>
            </div>

            {/* Evidence */}
            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">Detection Evidence</h4>
              <ul className="space-y-2">
                {selectedAlert.evidence.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Explanation */}
            <div className="p-4 bg-cyber-blue/10 border border-cyber-blue/20 rounded-lg">
              <h4 className="text-sm font-bold text-cyber-cyan mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                AI Security Analysis
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedAlert.aiExplanation}
              </p>
            </div>

            {/* Recommended Response */}
            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider">Recommended Response</h4>
              <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <p className="text-sm text-slate-300">
                  {selectedAlert.recommendedResponse}
                </p>
              </div>
            </div>

          </div>
          
          <div className="p-4 border-t border-slate-800 bg-cyber-darker flex gap-3">
            <button className="flex-1 py-2 bg-cyber-blue hover:bg-cyber-blue/80 text-white text-sm font-medium rounded-lg transition-colors">
              Investigate Further
            </button>
            <button className="flex-1 py-2 bg-status-safe/20 hover:bg-status-safe/30 text-status-safe border border-status-safe/30 text-sm font-medium rounded-lg transition-colors">
              Mark as Resolved
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
