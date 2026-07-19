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
    { role: 'assistant', content: "Hello! I'm CyberShield AI Copilot. I'm actively monitoring your environment. How can I assist you with your security operations today?" }
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

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ **Connection Error:** Could not connect to the Python AI backend. Please ensure the server is running on port 8000 and the Gemini API key is configured." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-500">

      {/* Left Sidebar - Context & Actions */}
      <div className="hidden lg:flex w-80 flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-700 border border-emerald-400/20 flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              AI Copilot
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </h1>
            <p className="text-xs text-emerald-100/50">Intelligent Security Ops</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/10 rounded-2xl p-5 shadow-xl flex-shrink-0">
          <h3 className="text-white text-sm font-semibold flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-emerald-400" />
            System Context
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-emerald-500/10">
              <span className="text-xs text-slate-400">Active Threats</span>
              <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> 3 High
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-emerald-500/10">
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
        <div className="bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/10 rounded-2xl p-5 shadow-xl flex-1">
          <h3 className="text-white text-sm font-semibold flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-emerald-400" />
            Quick Actions
          </h3>
          <div className="flex flex-col gap-2">
            <button onClick={() => handleSend("Generate a threat report for the past 24 hours.")} className="text-left px-4 py-2.5 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl text-xs text-slate-300 hover:text-white transition-all border border-emerald-500/10 hover:border-emerald-500/30">Generate 24h Threat Report</button>
            <button onClick={() => handleSend("Isolate Employee-021's device.")} className="text-left px-4 py-2.5 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl text-xs text-slate-300 hover:text-white transition-all border border-emerald-500/10 hover:border-emerald-500/30">Isolate Compromised Node</button>
            <button onClick={() => handleSend("Review firewall logs for anomalies.")} className="text-left px-4 py-2.5 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl text-xs text-slate-300 hover:text-white transition-all border border-emerald-500/10 hover:border-emerald-500/30">Review Firewall Logs</button>
          </div>
        </div>
      </div>

      {/* Right Column - Chat Container */}
      <div className="flex-1 bg-[#05130e]/60 backdrop-blur-xl border border-emerald-500/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-4 w-full", msg.role === 'user' ? "flex-row-reverse" : "")}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg border",
                msg.role === 'user'
                  ? "bg-slate-800 border-slate-700"
                  : "bg-emerald-500/20 border-emerald-400/30"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-slate-300" /> : <Bot className="w-5 h-5 text-emerald-400" />}
              </div>

              {/* Box width increased to full width to stop it feeling 'cramped' */}
              <div className={cn(
                "p-5 rounded-2xl shadow-sm text-base leading-relaxed whitespace-pre-wrap border-2",
                msg.role === 'user'
                  ? "bg-slate-800/60 border-slate-700/80 text-slate-200 rounded-tr-sm w-fit max-w-[85%]"
                  : "bg-emerald-900/10 border-emerald-500/20 text-emerald-50/90 rounded-tl-sm w-full"
              )}>
                {/* Handle basic markdown bold mapping if backend returns it */}
                {msg.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part)}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 w-full">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-900/10 border-2 border-emerald-500/20 rounded-tl-sm flex gap-2 items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400/50 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400/50 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400/50 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length < 3 && (
          <div className="px-6 py-4 border-t border-emerald-500/10 bg-[#030d09] overflow-x-auto whitespace-nowrap">
            <div className="flex gap-2">
              {suggestions.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(text)}
                  className="px-4 py-2 bg-emerald-900/20 hover:bg-emerald-800/40 text-emerald-100/70 hover:text-white text-xs font-medium rounded-full transition-all flex items-center gap-1 border border-emerald-500/20 hover:border-emerald-400/50 shadow-sm"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-[#030d09] border-t border-emerald-500/10">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="relative flex items-center group"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CyberShield AI about your security environment..."
              className="w-full bg-[#05130e] border border-emerald-500/20 rounded-xl pl-5 pr-14 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">AI responses may be inaccurate. Verify critical actions.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
