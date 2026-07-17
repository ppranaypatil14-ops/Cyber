import { Bell, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export function TopNav() {
  return (
    <header className="h-16 border-b border-slate-900/50 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm backdrop-blur-xl" style={{ background: 'rgba(8,15,20,0.75)' }}>
      
      {/* Logo Section (Matches Homepage) */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <ShieldAlert className="w-6 h-6 text-emerald-300" />
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight" style={{ color: '#ffffff', opacity: 1 }}>CyberShield AI</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-6">
        
        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-emerald-300 transition-colors rounded-full hover:bg-emerald-500/10">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-critical rounded-full border-2 border-[#080f14]"></span>
        </button>

        <div className="h-6 w-px bg-slate-800"></div>

        {/* User Profile (Matches Homepage) */}
        <Link to="/dashboard/profile" className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyber-blue to-cyber-cyan p-0.5 shadow-lg shadow-cyber-cyan/20 block hover:scale-105 transition-transform">
          <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-cyber-blue">B</span>
          </div>
        </Link>

      </div>
    </header>
  );
}
