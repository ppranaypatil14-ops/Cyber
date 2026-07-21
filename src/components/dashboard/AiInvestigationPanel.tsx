import React from 'react';
import { Sparkles, Bot, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AiInvestigationPanel: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <h2 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
        <Bot className="w-4 h-4" />
        Raksha AI Agent
      </h2>
      <p className="text-xs text-slate-300 leading-relaxed mb-4">
        Deep AI analysis indicates lateral movement prediction on database clusters. Execute immediate quarantine procedures.
      </p>
      <button 
        onClick={() => navigate('/dashboard/copilot')}
        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-1.5 group"
      >
        Consult Copilot
        <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
        <Bot className="w-3.5 h-3.5" />
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
