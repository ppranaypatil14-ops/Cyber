import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyber-blue to-cyber-cyan p-[2px] shadow-lg shadow-cyber-cyan/20">
          <div className="w-full h-full bg-cyber-darker rounded-[10px] flex items-center justify-center">
            <Bot className="w-6 h-6 text-cyber-cyan" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            CyberShield AI Copilot
            <Sparkles className="w-5 h-5 text-cyber-cyan animate-pulse" />
          </h1>
          <p className="text-sm text-slate-400">Your intelligent security operations assistant.</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-cyber-card border border-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden relative">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              
              <div className="shrink-0 mt-1">
                {msg.role === 'ai' ? (
                  <div className="w-8 h-8 rounded-lg bg-cyber-blue/20 border border-cyber-blue/30 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-cyber-cyan" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-300" />
                  </div>
                )}
              </div>
              
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-cyber-blue text-white rounded-tr-sm" 
                  : "bg-cyber-darker border border-slate-800 text-slate-200 rounded-tl-sm shadow-sm"
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
              <div className="p-4 rounded-2xl bg-cyber-darker border border-slate-800 rounded-tl-sm flex gap-1.5 items-center">
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
          <div className="px-6 py-4 border-t border-slate-800/50 bg-cyber-darker/50 overflow-x-auto whitespace-nowrap">
            <div className="flex gap-2">
              {suggestions.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(text)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-full transition-colors flex items-center gap-1 border border-slate-700/50"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-cyber-darker border-t border-slate-800">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="relative flex items-center"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CyberShield AI about your security environment..." 
              className="w-full bg-cyber-card border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-1.5 bg-cyber-blue hover:bg-cyber-blue/80 disabled:opacity-50 disabled:hover:bg-cyber-blue text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">AI responses may be inaccurate. Verify critical actions.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
