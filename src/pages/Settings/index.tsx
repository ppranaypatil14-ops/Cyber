import { Settings as SettingsIcon, User, Shield, Bell, Key } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Settings() {
  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Security Preferences', icon: Shield, active: true },
    { name: 'Notifications', icon: Bell },
    { name: 'API Keys', icon: Key },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-cyber-card pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-slate-400" />
          Platform Settings
        </h1>
        <p className="text-slate-400 text-sm">Manage your account and security operations preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map((tab, idx) => (
            <button 
              key={idx}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
                tab.active ? "bg-cyber-card border border-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-cyber-darker"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="flex-1 bg-cyber-card border border-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-6">Security Preferences</h2>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Automated Responses</h3>
              
              <label className="flex items-center justify-between p-4 bg-cyber-darker rounded-lg border border-slate-800 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-white mb-0.5">Auto-isolate critical threats</p>
                  <p className="text-xs text-slate-400">Automatically isolate devices with risk score &gt; 90.</p>
                </div>
                <div className="w-10 h-5 bg-cyber-cyan rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-4 bg-cyber-darker rounded-lg border border-slate-800 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-white mb-0.5">Force password reset on anomaly</p>
                  <p className="text-xs text-slate-400">Require password change after credential access detection.</p>
                </div>
                <div className="w-10 h-5 bg-cyber-cyan rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                </div>
              </label>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <button className="px-4 py-2 bg-cyber-blue hover:bg-cyber-blue/80 text-white text-sm font-medium rounded-lg transition-colors">
                Save Preferences
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
