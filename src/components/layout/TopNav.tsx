import { Bell, Search, AlertTriangle, ShieldCheck } from "lucide-react";

export function TopNav() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search IP, Hash, Asset, or Threat..." 
            className="w-full bg-slate-100 border border-slate-200 rounded-md pl-10 pr-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-cyber-blue transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6">
        
        {/* Live Monitoring Indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-safe opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-status-safe"></span>
          </span>
          <span className="text-xs text-slate-600 font-medium">Live Monitoring Active</span>
        </div>

        {/* Current Threat Level */}
        <div className="flex items-center gap-2 bg-status-high/10 border border-status-high/20 px-3 py-1.5 rounded-md">
          <AlertTriangle className="w-4 h-4 text-status-high" />
          <span className="text-xs font-bold text-status-high tracking-wider">THREAT LEVEL: HIGH</span>
        </div>

        <div className="h-6 w-px bg-cyber-card"></div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-status-critical rounded-full border border-white"></span>
        </button>

        {/* Admin Profile */}
        <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyber-blue to-cyber-cyan p-0.5 shadow-lg shadow-cyber-cyan/20">
          <div className="w-full h-full bg-cyber-darker rounded-full flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-cyber-cyan" />
          </div>
        </button>

      </div>
    </header>
  );
}
