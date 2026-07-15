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
} from "lucide-react";
import { cn } from "../../utils/cn";

const navItems = [
  { name: "Overview Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Live Alerts", path: "/dashboard/alerts", icon: Activity },
  { name: "Security Testing Lab", path: "/dashboard/lab", icon: FlaskConical },
  { name: "Attack Investigation", path: "/dashboard/investigation", icon: SearchCode },
  { name: "MITRE ATT&CK", path: "/dashboard/mitre", icon: Network },
  { name: "AI Security Copilot", path: "/dashboard/copilot", icon: Bot },
  { name: "Incident Reports", path: "/dashboard/reports", icon: FileText },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 shadow-sm">
      {/* Logo — click to go Home */}
      <Link to="/" className="p-6 flex items-center gap-3 hover:bg-slate-50 transition-colors group">
        <div className="p-2 bg-cyber-blue/10 rounded-lg group-hover:bg-cyber-blue/20 transition-colors">
          <ShieldAlert className="w-8 h-8 text-cyber-blue" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-slate-900 tracking-tight">CyberShield <span className="text-cyber-blue">AI</span></h1>
          <p className="text-xs text-slate-500">Detect. Predict. Defend.</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30" 
                : "text-slate-600 hover:text-slate-900 hover:bg-cyber-card"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      {/* Back to Homepage */}
      <div className="p-4 border-t border-slate-200">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
        >
          <Home className="w-5 h-5" />
          Back to Homepage
        </Link>
      </div>

    </div>
  );
}
