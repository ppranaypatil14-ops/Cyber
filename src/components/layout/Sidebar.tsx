import { NavLink } from "react-router-dom";
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
  CheckCircle2,
  UserCircle
} from "lucide-react";
import { cn } from "../../utils/cn";

const navItems = [
  { name: "Overview Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Live Alerts", path: "/alerts", icon: Activity },
  { name: "Security Testing Lab", path: "/lab", icon: FlaskConical },
  { name: "Attack Investigation", path: "/investigation", icon: SearchCode },
  { name: "MITRE ATT&CK", path: "/mitre", icon: Network },
  { name: "AI Security Copilot", path: "/copilot", icon: Bot },
  { name: "Incident Reports", path: "/reports", icon: FileText },
  { name: "Settings", path: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-cyber-darker border-r border-cyber-card flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-cyber-blue/20 rounded-lg">
          <ShieldAlert className="w-8 h-8 text-cyber-cyan" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-white tracking-tight">CyberShield <span className="text-cyber-cyan">AI</span></h1>
          <p className="text-xs text-slate-400">Detect. Predict. Defend.</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-cyber-blue/10 text-cyber-cyan border border-cyber-blue/30" 
                : "text-slate-400 hover:text-white hover:bg-cyber-card"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-cyber-card space-y-4">
        {/* System Status */}
        <div className="flex items-center gap-2 px-2 py-1.5 bg-status-safe/10 rounded-md border border-status-safe/20">
          <CheckCircle2 className="w-4 h-4 text-status-safe" />
          <span className="text-xs text-status-safe font-medium">All Systems Operational</span>
        </div>
        
        {/* User Profile */}
        <div className="flex items-center gap-3 px-2">
          <UserCircle className="w-8 h-8 text-slate-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Security Administrator</span>
            <span className="text-xs text-slate-500">SOC Team</span>
          </div>
        </div>
      </div>
    </div>
  );
}
