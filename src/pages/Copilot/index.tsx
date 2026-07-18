import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, Activity, Zap, ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

const suggestions = [
  "Why is Employee-021 considered high risk?",
  "What cyberattacks were detected today?",
  "What is the predicted next attack?",
  "Which device requires immediate action?",
  "What response should the security team take?"
];

export default function Copilot() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm CyberShield AI Copilot. I'm actively monitoring your environment. How can I assist you with your security operations today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      let aiResponse = "I'm currently operating in mock data mode. In a live environment, I would analyze the threat telemetry and provide a detailed security assessment for this query.";
      
      if (text.includes('Employee-021')) {
        aiResponse = "Employee-021 is considered high risk (Score: 94) due to a sequence of anomalous events: multiple failed logins outside working hours, successful authentication from an unknown Windows 11 device, and subsequent access to sensitive databases. This matches the pattern of a credential compromise.";
      } else if (text.includes('predicted')) {
        aiResponse = "Based on the current attack graph for INC-2026-0042, the predicted next attack stage is **Data Exfiltration** with an 87% confidence level. The adversary has already secured credential access and pivoted to the database server.";
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-500">
      
      {/* Left Sidebar - Context & Actions */}
      <div className="hidden lg:flex w-80 flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyber-blue to-cyber-cyan p-[2px] shadow-lg shadow-cyber-cyan/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-cyber-cyan" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              AI Copilot
              <Sparkles className="w-4 h-4 text-cyber-cyan animate-pulse" />
            </h1>
            <p className="text-xs text-slate-400">Intelligent Security Ops</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-lg flex-shrink-0">
          <h3 className="text-white text-sm font-semibold flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-cyber-cyan" />
            System Context
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
              <span className="text-xs text-slate-400">Active Threats</span>
              <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> 3 High
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
              <span className="text-xs text-slate-400">Nodes Monitored</span>
              <span className="text-xs font-medium text-slate-200">1,248</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">AI Confidence</span>
              <span className="text-xs font-medium text-emerald-400">94.2%</span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-lg flex-1">
          <h3 className="text-white text-sm font-semibold flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-cyber-blue" />
            Quick Actions
          </h3>
          <div className="flex flex-col gap-2">
            <button onClick={() => handleSend("Generate a threat report for the past 24 hours.")} className="text-left px-4 py-2.5 bg-slate-700/30 hover:bg-slate-700/60 rounded-xl text-xs text-slate-300 hover:text-white transition-all border border-slate-600/30 hover:border-cyber-cyan/50">Generate 24h Threat Report</button>
            <button onClick={() => handleSend("Isolate Employee-021's device.")} className="text-left px-4 py-2.5 bg-slate-700/30 hover:bg-slate-700/60 rounded-xl text-xs text-slate-300 hover:text-white transition-all border border-slate-600/30 hover:border-cyber-cyan/50">Isolate Compromised Node</button>
            <button onClick={() => handleSend("Review firewall logs for anomalies.")} className="text-left px-4 py-2.5 bg-slate-700/30 hover:bg-slate-700/60 rounded-xl text-xs text-slate-300 hover:text-white transition-all border border-slate-600/30 hover:border-cyber-cyan/50">Review Firewall Logs</button>
          </div>
        </div>
      </div>

      {/* Right Column - Chat Container */}
      <div className="flex-1 bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-xl flex flex-col overflow-hidden relative">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              
              <div className="shrink-0 mt-1">
                {msg.role === 'ai' ? (
                  <div className="w-8 h-8 rounded-lg bg-cyber-blue/20 border border-cyber-blue/30 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                    <Bot className="w-5 h-5 text-cyber-cyan" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-300" />
                  </div>
                )}
              </div>
              
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-md backdrop-blur-md border",
                msg.role === 'user' 
                  ? "bg-cyber-blue/90 border-cyber-blue text-white rounded-tr-sm shadow-cyber-blue/20" 
                  : "bg-slate-700/50 border-slate-600/50 text-slate-100 rounded-tl-sm"
              )}>
                {msg.content}
              </div>

            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="shrink-0 mt-1">
                <div className="w-8 h-8 rounded-lg bg-cyber-blue/20 border border-cyber-blue/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyber-cyan" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-700/50 border border-slate-600/50 rounded-tl-sm flex gap-1.5 items-center backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length < 3 && (
          <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/40 overflow-x-auto whitespace-nowrap">
            <div className="flex gap-2">
              {suggestions.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(text)}
                  className="px-4 py-2 bg-slate-700/60 hover:bg-slate-600/80 text-slate-200 hover:text-white text-xs font-medium rounded-full transition-all flex items-center gap-1 border border-slate-600/50 hover:border-cyber-cyan/50 backdrop-blur-md shadow-sm"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-slate-800/60 backdrop-blur-xl border-t border-slate-700/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="relative flex items-center group"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CyberShield AI about your security environment..." 
              className="w-full bg-slate-700/50 border border-slate-600/80 rounded-xl pl-5 pr-14 py-3.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-cyber-blue hover:bg-cyber-blue/80 disabled:opacity-50 disabled:hover:bg-cyber-blue text-white rounded-lg transition-colors shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">AI responses may be inaccurate. Verify critical actions.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
