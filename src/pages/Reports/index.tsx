import { FileText, Download, FileJson, File, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

const mockReports = [
  { id: 'INC-2026-0042', attack: 'Possible Account Compromise', asset: 'Employee-021', risk: 94, date: '2026-07-10', status: 'Active' },
  { id: 'INC-2026-0041', attack: 'Ransomware Activity Detected', asset: 'Server-FS-01', risk: 99, date: '2026-07-09', status: 'Resolved' },
  { id: 'INC-2026-0040', attack: 'Phishing Campaign', asset: 'Multiple Users', risk: 65, date: '2026-07-08', status: 'Resolved' },
  { id: 'INC-2026-0039', attack: 'Unauth. Network Scan', asset: 'VLAN-Servers', risk: 45, date: '2026-07-05', status: 'Resolved' },
  { id: 'INC-2026-0038', attack: 'Suspicious Powershell Exec', asset: 'Employee-088', risk: 82, date: '2026-07-02', status: 'Active' },
];

function StatCard({ title, value, icon: Icon, colorClass }: any) {
  return (
    <div className="bg-cyber-card border border-slate-800 rounded-xl p-5 flex items-center gap-4">
      <div className={cn("p-3 rounded-lg", colorClass)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

export default function Reports() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-cyber-card pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Incident Reports</h1>
          <p className="text-slate-400 text-sm">Comprehensive security incident history and reporting.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700">
            <FileJson className="w-4 h-4" /> Export CSV
          </button>
          <button className="px-4 py-2 flex items-center gap-2 bg-cyber-blue hover:bg-cyber-blue/80 text-white text-sm font-medium rounded-lg transition-colors">
            <Download className="w-4 h-4" /> Download All (PDF)
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Incidents" value="142" icon={FileText} colorClass="bg-cyber-blue/20 text-cyber-cyan border border-cyber-blue/30" />
        <StatCard title="Critical Incidents" value="12" icon={ShieldAlert} colorClass="bg-status-critical/20 text-status-critical border border-status-critical/30" />
        <StatCard title="Resolved" value="128" icon={CheckCircle2} colorClass="bg-status-safe/20 text-status-safe border border-status-safe/30" />
        <StatCard title="Avg Resolution Time" value="2.4 hrs" icon={Clock} colorClass="bg-slate-800 text-slate-300 border border-slate-700" />
      </div>

      {/* Reports Table */}
      <div className="bg-cyber-card border border-slate-800 rounded-xl shadow-lg overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-800 bg-cyber-darker flex justify-between items-center">
          <h2 className="font-bold text-white">Recent Security Reports</h2>
          <div className="text-sm text-slate-400">Showing last 30 days</div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-cyber-darker/50">
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="px-6 py-4 font-medium">Incident ID</th>
                <th className="px-6 py-4 font-medium">Attack Type</th>
                <th className="px-6 py-4 font-medium">Affected Asset</th>
                <th className="px-6 py-4 font-medium">Risk Score</th>
                <th className="px-6 py-4 font-medium">Detected Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {mockReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{report.id}</td>
                  <td className="px-6 py-4 text-slate-300">{report.attack}</td>
                  <td className="px-6 py-4 text-slate-400">{report.asset}</td>
                  <td className="px-6 py-4">
                    <span className={cn("font-bold", report.risk > 80 ? "text-status-critical" : report.risk > 60 ? "text-status-high" : "text-status-medium")}>
                      {report.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{report.date}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider",
                      report.status === 'Resolved' ? "bg-status-safe/10 text-status-safe border border-status-safe/20" : "bg-status-high/10 text-status-high border border-status-high/20"
                    )}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="View Report">
                        <File className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-cyber-cyan hover:text-white hover:bg-cyber-blue/20 rounded transition-colors" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
