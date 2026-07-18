import { User, Mail, Briefcase, MapPin, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initial = displayName[0].toUpperCase();
  const memberYear = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">User Profile</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
      
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyber-blue to-cyber-cyan p-1 shadow-lg shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-cyber-cyan">{initial}</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white">{displayName}</h2>
            <p className="text-slate-400 font-medium mt-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyber-cyan" /> 
              Security Commander
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-700/50">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <span>{user?.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Briefcase className="w-5 h-5 text-slate-500" />
                  <span>Cyber Security Division</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-slate-500" />
                  <span>HQ, Operations Center</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <User className="w-5 h-5 text-slate-500" />
                  <span>Member since {memberYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

