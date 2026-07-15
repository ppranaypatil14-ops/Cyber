import { User, Mail, Briefcase, MapPin, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyber-blue to-cyber-cyan p-1 shadow-lg shrink-0">
            <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-cyber-blue">B</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900">Bhavika</h2>
            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyber-cyan" /> 
              Security Commander
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-100">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span>bhavika@cyber.dev</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Briefcase className="w-5 h-5 text-slate-400" />
                  <span>Cyber Security Division</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <span>HQ, Operations Center</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <User className="w-5 h-5 text-slate-400" />
                  <span>Member since 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
