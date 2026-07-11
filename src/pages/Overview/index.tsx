import { Activity, ShieldAlert, Monitor, Clock, ChevronRight, AlertTriangle } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { networkActivityData, threatDetectionData, recentAlerts } from '../../data/mockDashboardData';
import { cn } from '../../utils/cn';

function SummaryCard({ title, value, change, icon: Icon, isCritical = false }: any) {
  return (
    <div className="bg-cyber-card border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
      <div className={cn("absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 rounded-full blur-2xl -mr-8 -mt-8", isCritical ? "from-status-critical to-red-900" : "from-cyber-blue to-cyber-cyan")}></div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={cn("p-2 rounded-lg", isCritical ? "bg-status-critical/20 text-status-critical" : "bg-cyber-blue/20 text-cyber-cyan")}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className={cn("text-sm font-medium", isCritical ? "text-status-critical" : "text-status-safe")}>{change}</p>
    </div>
  );
}

export default function OverviewDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-card pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Security Operations Overview</h1>
          <p className="text-slate-400 text-sm">AI-powered threat monitoring and cyber resilience intelligence.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-status-safe/10 border border-status-safe/20 rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-safe opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-safe"></span>
          </span>
          <span className="text-xs text-status-safe font-semibold tracking-wide uppercase">Live Monitoring Active</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Monitored Assets" value="1,248" change="+24 this month" icon={Monitor} />
        <SummaryCard title="Active Security Alerts" value="18" change="Requires attention" icon={Activity} />
        <SummaryCard title="Critical Threats" value="3" change="Immediate action required" icon={ShieldAlert} isCritical={true} />
        <SummaryCard title="Avg Response Time" value="1.8m" change="32% improvement" icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Security Risk */}
        <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg lg:col-span-1 flex flex-col">
          <h2 className="text-lg font-bold text-white mb-6">Overall Security Risk</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#f97316" strokeWidth="8" strokeDasharray="283" strokeDashoffset="67.9" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-white">76</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Score</span>
              </div>
            </div>

            <div className="w-full bg-status-high/10 border border-status-high/20 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-status-high" />
                <span className="text-sm font-bold text-status-high tracking-wider uppercase">Current Level: High</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-cyber-cyan">AI Analysis:</strong> Multiple unusual authentication attempts and abnormal data-access patterns have increased the organisation's security risk.
              </p>
            </div>
            
            <button className="w-full py-2.5 bg-cyber-blue hover:bg-cyber-blue/80 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
              View Risk Analysis
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Network Activity Graph */}
        <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Network Activity (Last 24h)</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={networkActivityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="normal" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorNormal)" name="Normal Traffic" />
                <Area type="monotone" dataKey="suspicious" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorSuspicious)" name="Suspicious" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Alerts Table */}
        <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Recent Security Alerts</h2>
            <button className="text-sm text-cyber-cyan hover:text-white transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-medium">Severity</th>
                  <th className="pb-3 font-medium">Alert</th>
                  <th className="pb-3 font-medium">Affected Asset</th>
                  <th className="pb-3 font-medium">Time / Risk</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider",
                        alert.severity === 'Critical' ? "bg-status-critical/10 text-status-critical border border-status-critical/20" :
                        alert.severity === 'High' ? "bg-status-high/10 text-status-high border border-status-high/20" :
                        "bg-status-medium/10 text-status-medium border border-status-medium/20"
                      )}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="py-4 font-medium text-slate-200">{alert.alert}</td>
                    <td className="py-4 text-slate-400">{alert.asset}</td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-300">{alert.time}</span>
                        <span className="text-xs text-slate-500">Risk: {alert.riskScore}%</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded transition-colors">Details</button>
                        <button className="px-3 py-1.5 bg-cyber-blue/20 hover:bg-cyber-blue/40 text-cyber-cyan border border-cyber-blue/30 text-xs font-medium rounded transition-colors">Investigate</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live System Status & Trend */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-6">Attack Detection Trend</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={threatDetectionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#1e293b', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                  <Bar dataKey="detected" name="Detected" fill="#f97316" radius={[4, 4, 0, 0]} barSize={8} />
                  <Bar dataKey="prevented" name="Prevented" fill="#10b981" radius={[4, 4, 0, 0]} barSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg flex-1">
            <h2 className="text-lg font-bold text-white mb-4">Live System Status</h2>
            <div className="space-y-4">
              {[
                { name: 'Identity Security', status: 'Operational', color: 'bg-status-safe' },
                { name: 'Network Monitoring', status: 'Operational', color: 'bg-status-safe' },
                { name: 'Endpoint Protection', status: 'Operational', color: 'bg-status-safe' },
                { name: 'AI Detection Engine', status: 'Active', color: 'bg-cyber-cyan' },
                { name: 'Threat Intelligence', status: 'Connected', color: 'bg-cyber-cyan' },
              ].map((sys, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-cyber-darker rounded-lg border border-slate-800/50">
                  <span className="text-sm text-slate-300 font-medium">{sys.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", sys.color, `shadow-${sys.color.replace('bg-', '')}`)}></span>
                    <span className="text-xs text-slate-400">{sys.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
