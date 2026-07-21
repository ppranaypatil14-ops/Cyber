import { NavLink, Link } from "react-router-dom";
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Activity, 
  FlaskConical, 
  SearchCode, 
  Network, 
  Bot, 
  FileText, 
  Settings,
  Home,
  Sparkles,
  Cpu,
} from "lucide-react";
import { cn } from "../../utils/cn";

const navItems = [
  { name: "Attack Correlation", path: "/dashboard/attack-correlation", icon: LayoutDashboard },
  { name: "Live Alerts", path: "/dashboard/alerts", icon: Activity },
  { name: "Autonomous Detection", path: "/dashboard/lab", icon: Cpu },
  { name: "Attack Investigation", path: "/dashboard/investigation", icon: SearchCode },
  { name: "MITRE ATT&CK", path: "/dashboard/mitre", icon: Network },
  { name: "AI Security Copilot", path: "/dashboard/copilot", icon: Bot },
  { name: "Incident Reports", path: "/dashboard/reports", icon: FileText },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#030d09] border-r border-emerald-500/10 flex flex-col fixed left-0 top-0 shadow-2xl">
      {/* Logo */}
      <Link to="/" className="flex items-center hover:opacity-90 transition-opacity" style={{background:'#000'}}>
        <img src="/raksha-logo.png" alt="Raksha" className="h-14 w-full object-cover" />
      </Link>

      {/* AI Status */}
      <div className="px-4 py-3 border-b border-emerald-500/10">
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-900/20 border border-emerald-500/15 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">AI Engine Active</span>
          <Sparkles className="w-3 h-3 text-emerald-400 ml-auto" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-900/20" 
                : "text-slate-400 hover:text-white hover:bg-emerald-900/10 border border-transparent"
            )}
          >
            <item.icon className="w-4.5 h-4.5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Back to Homepage */}
      <div className="p-3 border-t border-emerald-500/10">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-emerald-400 hover:bg-emerald-900/10 transition-all duration-200"
        >
          <Home className="w-4.5 h-4.5" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
