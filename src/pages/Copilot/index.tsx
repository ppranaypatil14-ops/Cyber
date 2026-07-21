import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, Activity, Zap, ShieldAlert, Lock, Ban, Key, Mail, Database, ChartBar, CheckSquare, Square, CheckCircle2, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const suggestions = [
  "Why is Employee-021 considered high risk?",
  "What cyberattacks were detected today?",
  "What is the predicted next attack?",
  "Which device requires immediate action?",
  "What response should the security team take?"
];

const availableActions = [
  { id: 'lock', icon: <Lock className="w-5 h-5" />, title: "Lock Employee Account", desc: "Prevent further account misuse." },
  { id: 'terminate', icon: <Activity className="w-5 h-5" />, title: "Terminate Active Sessions", desc: "Log the attacker out immediately." },
  { id: 'block', icon: <Ban className="w-5 h-5" />, title: "Block Unknown Device", desc: "Prevent future logins from the detected device." },
  { id: 'reset', icon: <Key className="w-5 h-5" />, title: "Force Password Reset", desc: "Require new credentials." },
  { id: 'notify', icon: <Mail className="w-5 h-5" />, title: "Notify Security Team", desc: "Send alert to SOC analysts." },
  { id: 'snapshot', icon: <Database className="w-5 h-5" />, title: "Create Forensic Snapshot", desc: "Preserve logs and evidence." },
  { id: 'monitor', icon: <ChartBar className="w-5 h-5" />, title: "Enable Continuous Monitoring", desc: "Increase monitoring for this employee." }
];

const explanationData = [
  { id: 'lock', icon: <Lock className="w-5 h-5" />, title: "Lock Employee Account", reason: "The account experienced multiple failed login attempts followed by a successful login from an unknown device. Locking the account prevents further unauthorized access.", confidence: "96%", riskReduction: "High" },
  { id: 'block', icon: <Ban className="w-5 h-5" />, title: "Block Unknown Device", reason: "The device fingerprint has never been associated with this employee. Blocking it prevents future unauthorized logins.", confidence: "94%", riskReduction: "High" },
  { id: 'reset', icon: <Key className="w-5 h-5" />, title: "Force Password Reset", reason: "The attacker may know the employee's credentials. Resetting the password invalidates compromised credentials.", confidence: "92%", riskReduction: "High" },
  { id: 'notify', icon: <Mail className="w-5 h-5" />, title: "Notify Security Team", reason: "Human analysts should verify the incident and determine whether additional investigation is required.", confidence: "88%", riskReduction: "Medium" },
  { id: 'snapshot', icon: <Database className="w-5 h-5" />, title: "Create Forensic Snapshot", reason: "Preserving logs and evidence supports future investigation and compliance requirements.", confidence: "95%", riskReduction: "Medium" },
  { id: 'monitor', icon: <ChartBar className="w-5 h-5" />, title: "Enable Continuous Monitoring", reason: "The account should be monitored for additional suspicious behavior after containment.", confidence: "90%", riskReduction: "Medium" }
];

const ExplanationCard = ({ data }: { data: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="bg-[#030d09] border border-emerald-500/20 rounded-xl overflow-hidden transition-all duration-300">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-emerald-900/10 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#05130e] border border-emerald-500/10 rounded-lg text-emerald-400">
            {data.icon}
          </div>
          <span className="font-bold text-slate-200">{data.title}</span>
        </div>
        <div className={cn("text-emerald-400 transition-transform duration-300", isExpanded ? "rotate-180" : "rotate-0")}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
      <div 
        className={cn("overflow-hidden transition-all duration-300", isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}
      >
        <div className="p-4 pt-0 border-t border-emerald-500/10 bg-emerald-900/5">
          <div className="mt-4 mb-4">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reason:</h5>
            <p className="text-sm text-slate-300 leading-relaxed">{data.reason}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Confidence:</span>
              <span className="px-2 py-1 bg-cyber-cyan/10 text-cyber-cyan text-xs font-bold rounded">{data.confidence}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Risk Reduction:</span>
              <span className={cn("px-2 py-1 text-xs font-bold rounded", data.riskReduction === 'High' ? "bg-status-critical/10 text-status-critical" : "bg-amber-400/10 text-amber-400")}>{data.riskReduction}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Message {
  role: string;
  content: string;
  isIncident?: boolean;
  incidentData?: any;
  isResponseComplete?: boolean;
  isExplanation?: boolean;
  isAnalysis?: boolean;
}

export default function Copilot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm Raksha, your AI-powered security assistant. I'm actively monitoring your environment. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Modal state
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState<string[]>([]);
  const [executionComplete, setExecutionComplete] = useState(false);
  const [activeIncident, setActiveIncident] = useState<any>(null);

  // Execute All state
  const [showExecuteAllModal, setShowExecuteAllModal] = useState(false);
  const [executeAllProgress, setExecuteAllProgress] = useState<number>(0);
  const [executeAllComplete, setExecuteAllComplete] = useState(false);
  const [currentExecutingAction, setCurrentExecutingAction] = useState<string>('');
  const [completedExecuteAllActions, setCompletedExecuteAllActions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const initialPrompt = localStorage.getItem('copilot_initial_prompt');
    if (initialPrompt) {
      localStorage.removeItem('copilot_initial_prompt');
      setTimeout(() => {
        try {
          const parsed = JSON.parse(initialPrompt);
          if (parsed.type === 'incident_handoff') {
            handleIncidentHandoff(parsed.incident);
          } else {
            handleSend(initialPrompt);
          }
        } catch {
          handleSend(initialPrompt);
        }
      }, 300);
    }
  }, []);

  const handleIncidentHandoff = async (incident: any) => {
    const rawText = `Analyze this incident: ID: ${incident.id} Employee: ${incident.employeeId} Severity: ${incident.severity} Risk: ${incident.riskScore}% Attack: ${incident.attackName}`;
    const newMsg = {
      role: 'user',
      content: rawText,
      isIncident: true,
      incidentData: incident
    };
    
    const newMessages = [...messages, newMsg];
    setMessages(newMessages as any);
    setIsTyping(true);
    setIsAnalyzing(true);

    try {
      const response = await fetch('http://localhost:8000/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, isAnalysis: true }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Waiting for AI backend connection...", isAnalysis: true }]);
    } finally {
      setIsTyping(false);
      setIsAnalyzing(false);
    }
  };

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
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Waiting for AI backend connection..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOpenResponseModal = (incident: any) => {
    setActiveIncident(incident);
    setSelectedActions(availableActions.map(a => a.id));
    setShowResponseModal(true);
    setIsExecuting(false);
    setExecutionProgress([]);
    setExecutionComplete(false);
  };

  const toggleAction = (id: string) => {
    setSelectedActions(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const executeSelectedActions = () => {
    setIsExecuting(true);
    let delay = 0;
    selectedActions.forEach((id) => {
      delay += 800;
      setTimeout(() => {
        setExecutionProgress(prev => [...prev, id]);
      }, delay);
    });

    setTimeout(() => {
      setExecutionComplete(true);
      setMessages(prev => [...prev, { role: 'assistant', content: "Selected response actions completed successfully." }]);
    }, delay + 500);
  };

  const handleExecuteAll = () => {
    setShowExecuteAllModal(true);
    setExecuteAllProgress(0);
    setExecuteAllComplete(false);
    setCompletedExecuteAllActions([]);
    setCurrentExecutingAction(availableActions[0].title);

    let progress = 0;
    let actionIndex = 0;
    const totalActions = availableActions.length;
    const intervalTime = 600;

    const executeNext = () => {
      if (actionIndex < totalActions) {
        const action = availableActions[actionIndex];
        setCurrentExecutingAction(action.title);
        
        setTimeout(() => {
          setCompletedExecuteAllActions(prev => [...prev, action.id]);
          actionIndex++;
          progress = (actionIndex / totalActions) * 100;
          setExecuteAllProgress(progress);
          executeNext();
        }, intervalTime);
      } else {
        setTimeout(() => {
          setExecuteAllComplete(true);
          localStorage.setItem('simulated_contained', 'true');
          window.dispatchEvent(new Event('simulated_contained'));
          
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `**AI Response Completed**\nContainment Time: 11 Seconds\nActions Executed: ${totalActions}\nIncident Status: Contained`,
            isResponseComplete: true
          }]);
        }, 800);
      }
    };

    executeNext();
  };

  const handleExplainWhy = () => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: '', isExplanation: true }]);
      setIsTyping(false);
      scrollToBottom();
    }, 1000);
  };

  const latestIncident = messages.slice().reverse().find(m => m.isIncident)?.incidentData;

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
                {msg.isResponseComplete ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4 p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      <div>
                        <h3 className="text-lg font-bold text-white">Incident Successfully Contained</h3>
                        <p className="text-sm text-emerald-100/70">The automated incident response workflow was executed.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-[#030d09] border border-emerald-500/20 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">Containment Time</p>
                        <p className="text-lg font-bold text-white">11 Seconds</p>
                      </div>
                      <div className="p-4 bg-[#030d09] border border-emerald-500/20 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">Actions Executed</p>
                        <p className="text-lg font-bold text-emerald-400">6</p>
                      </div>
                      <div className="p-4 bg-[#030d09] border border-emerald-500/20 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">Incident Status</p>
                        <p className="text-lg font-bold text-cyber-cyan">Contained</p>
                      </div>
                    </div>
                  </div>
                ) : msg.isExplanation ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-emerald-400" /> AI Decision Reasoning
                    </h3>
                    <div className="space-y-3">
                      {explanationData.map((data, i) => (
                        <ExplanationCard key={i} data={data} />
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-emerald-500/10 text-center">
                      <p className="text-xs text-slate-400 italic">This explanation is generated based on the detected incident and current security evidence.</p>
                    </div>
                  </div>
                ) : msg.isIncident && msg.incidentData ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldAlert className="w-5 h-5 text-status-critical" />
                      <h3 className="font-bold text-lg text-white">Incident Handoff: {msg.incidentData.id}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                      <div><span className="text-slate-400">Employee ID:</span> <span className="font-medium">{msg.incidentData.employeeId}</span></div>
                      <div><span className="text-slate-400">Severity:</span> <span className="font-medium text-status-critical">{msg.incidentData.severity}</span></div>
                      <div><span className="text-slate-400">Risk Score:</span> <span className="font-medium text-status-critical">{msg.incidentData.riskScore}%</span></div>
                      <div><span className="text-slate-400">Status:</span> <span className="font-medium text-cyber-cyan">{msg.incidentData.status}</span></div>
                      <div className="col-span-2"><span className="text-slate-400">Attack Name:</span> <span className="font-medium">{msg.incidentData.attackName}</span></div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-slate-300">Timeline Summary</h4>
                      <div className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg max-h-24 overflow-y-auto">
                        {msg.incidentData.timeline.map((t: any, i: number) => (
                          <div key={i}>{t.time} - {t.desc}</div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-slate-300">Evidence Summary</h4>
                      <ul className="list-disc pl-4 text-xs text-slate-400">
                        {msg.incidentData.evidence.map((e: string, i: number) => <li key={i}>{e}</li>)}
                      </ul>
                    </div>
                  </div>
                ) : msg.isAnalysis ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
                        <Activity className="w-5 h-5" /> AI Incident Analysis
                      </h3>
                      <div className="text-emerald-50/90 leading-relaxed">
                        {msg.content.split('**').map((part: string, i: number) => i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part)}
                      </div>
                    </div>
                    
                    <div className="border-t border-emerald-500/20 pt-5 mt-5">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-emerald-400" /> AI Response Plan
                      </h3>

                      {/* Top Metrics */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-[#030d09] border border-emerald-500/20 rounded-xl p-4">
                          <p className="text-xs text-slate-400 mb-1">Response Priority</p>
                          <p className="text-lg font-black text-status-critical">Critical</p>
                        </div>
                        <div className="bg-[#030d09] border border-emerald-500/20 rounded-xl p-4">
                          <p className="text-xs text-slate-400 mb-1">Estimated Containment</p>
                          <p className="text-lg font-black text-white">12 Seconds</p>
                        </div>
                        <div className="bg-[#030d09] border border-emerald-500/20 rounded-xl p-4">
                          <p className="text-xs text-slate-400 mb-1">Risk Reduction</p>
                          <p className="text-lg font-black text-emerald-400">85%</p>
                        </div>
                        <div className="bg-[#030d09] border border-emerald-500/20 rounded-xl p-4">
                          <p className="text-xs text-slate-400 mb-1">Confidence Score</p>
                          <p className="text-lg font-black text-cyber-cyan">94%</p>
                        </div>
                      </div>
                      
                      <h4 className="text-base font-semibold text-white mb-4">Recommended Actions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {[
                          { icon: <Lock className="w-5 h-5 text-emerald-400" />, title: "Lock Employee Account", desc: "Terminate all active sessions." },
                          { icon: <Ban className="w-5 h-5 text-status-critical" />, title: "Block Unknown Device", desc: "Prevent future logins from this device." },
                          { icon: <Key className="w-5 h-5 text-amber-400" />, title: "Force Password Reset", desc: "Require the employee to reset credentials." },
                          { icon: <Mail className="w-5 h-5 text-blue-400" />, title: "Notify Security Team", desc: "Generate an incident notification." },
                          { icon: <Database className="w-5 h-5 text-purple-400" />, title: "Create Forensic Snapshot", desc: "Save logs for investigation." },
                          { icon: <ChartBar className="w-5 h-5 text-cyber-cyan" />, title: "Enable Continuous Monitoring", desc: "Increase monitoring for this employee." }
                        ].map((action, i) => (
                          <div key={i} className="group p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-900/20 hover:border-emerald-500/40 transition-all duration-300 flex items-start gap-4 shadow-sm hover:shadow-emerald-900/20">
                            <div className="mt-1 p-2 bg-[#05130e] rounded-lg border border-emerald-500/10 group-hover:scale-110 transition-transform">
                              {action.icon}
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-slate-200 mb-1">{action.title}</h5>
                              <p className="text-xs text-slate-400 leading-relaxed">{action.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 border-t border-emerald-500/10 pt-6">
                        <button 
                          onClick={handleExecuteAll}
                          className="px-6 py-3 flex-1 md:flex-none bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5 hover:shadow-emerald-500/20"
                        >
                          Execute All
                        </button>
                        <button 
                          onClick={() => latestIncident && handleOpenResponseModal(latestIncident)}
                          className="px-6 py-3 flex-1 md:flex-none bg-[#05130e] hover:bg-slate-800 text-white font-bold rounded-xl border border-slate-700 transition-all hover:-translate-y-0.5"
                        >
                          Choose Actions
                        </button>
                        <button 
                          onClick={handleExplainWhy}
                          className="px-6 py-3 flex-1 md:flex-none bg-emerald-900/30 hover:bg-emerald-800/40 text-emerald-100 font-bold rounded-xl border border-emerald-500/30 transition-all hover:-translate-y-0.5"
                        >
                          Explain Why
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  msg.content.split('**').map((part: string, i: number) => i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part)
                )}
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
              <div className="p-5 rounded-2xl bg-emerald-900/10 border-2 border-emerald-500/20 rounded-tl-sm flex gap-3 items-center">
                {isAnalyzing && (
                  <span className="text-emerald-400 text-sm font-medium italic mr-2 animate-pulse">Analyzing incident...</span>
                )}
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
              placeholder="Ask Raksha about your security environment..."
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

      {/* Response Center Modal */}
      {showResponseModal && activeIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030d09]/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#05130e] border border-emerald-500/20 rounded-2xl shadow-2xl shadow-emerald-900/20 w-full max-w-3xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-emerald-500/10 bg-emerald-900/5 shrink-0">
              <h2 className="text-xl font-bold text-white mb-3">Response Center</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <span className="text-slate-400">Incident ID: <span className="text-white font-medium">{activeIncident.id}</span></span>
                <span className="text-slate-400">Attack: <span className="text-white font-medium">{activeIncident.attackName}</span></span>
                <span className="text-slate-400">Severity: <span className="text-status-critical font-medium">{activeIncident.severity}</span></span>
                <span className="text-slate-400">Risk Score: <span className="text-status-critical font-medium">{activeIncident.riskScore}%</span></span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {!isExecuting && !executionComplete ? (
                availableActions.map(action => {
                  const isSelected = selectedActions.includes(action.id);
                  return (
                    <div 
                      key={action.id} 
                      onClick={() => toggleAction(action.id)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4",
                        isSelected ? "bg-emerald-900/20 border-emerald-500/40 shadow-sm shadow-emerald-900/10" : "bg-[#030d09] border-slate-800 hover:border-slate-700 hover:bg-slate-900/30"
                      )}
                    >
                      <div className={cn("shrink-0", isSelected ? "text-emerald-400" : "text-slate-600")}>
                        {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </div>
                      <div className={cn("p-2 rounded-lg border", isSelected ? "bg-[#05130e] border-emerald-500/20 text-emerald-400" : "bg-slate-900/50 border-slate-800 text-slate-500")}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className={cn("text-sm font-bold mb-1", isSelected ? "text-slate-200" : "text-slate-400")}>{action.title}</h5>
                        <p className="text-xs text-slate-500">{action.desc}</p>
                      </div>
                      <div className="text-xs font-medium uppercase tracking-wider shrink-0">
                        {isSelected ? <span className="text-emerald-500/80">Pending</span> : <span className="text-slate-600">Skipped</span>}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 flex flex-col items-center justify-center">
                  {!executionComplete ? (
                    <>
                      <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                      <h3 className="text-lg font-bold text-emerald-400 animate-pulse">Executing Selected Actions...</h3>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4" />
                      <h3 className="text-lg font-bold text-emerald-400">Execution Complete</h3>
                    </>
                  )}
                  
                  <div className="w-full max-w-md space-y-4 mt-8">
                    {selectedActions.map(id => {
                      const action = availableActions.find(a => a.id === id);
                      const isDone = executionProgress.includes(id);
                      return (
                        <div key={id} className="flex items-center gap-3 text-sm bg-[#030d09] p-3 rounded-lg border border-emerald-500/10">
                          {isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <Loader2 className="w-5 h-5 text-emerald-500/50 animate-spin shrink-0" />}
                          <span className={isDone ? "text-slate-200 font-medium" : "text-slate-400"}>{action?.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {!isExecuting && !executionComplete && (
              <div className="p-6 border-t border-emerald-500/10 bg-[#030d09] flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex gap-6 text-sm">
                  <span className="text-slate-400">Selected Actions: <span className="text-white font-bold">{selectedActions.length}</span></span>
                  <span className="text-slate-400">Estimated Containment: <span className="text-emerald-400 font-bold">~12s</span></span>
                  <span className="text-slate-400">Risk Reduction: <span className="text-emerald-400 font-bold">~85%</span></span>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => setShowResponseModal(false)}
                    className="px-6 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors flex-1 sm:flex-none font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={executeSelectedActions}
                    disabled={selectedActions.length === 0}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50 flex-1 sm:flex-none"
                  >
                    Execute Selected
                  </button>
                </div>
              </div>
            )}
            
            {executionComplete && (
              <div className="p-6 border-t border-emerald-500/10 bg-[#030d09] flex justify-end shrink-0">
                 <button 
                    onClick={() => setShowResponseModal(false)}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700"
                  >
                    Close
                  </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Execute All Simulated Progress Modal */}
      {showExecuteAllModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#030d09]/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#05130e] border border-emerald-500/30 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.15)] w-full max-w-lg p-8 flex flex-col items-center">
            
            {!executeAllComplete ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <Activity className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Executing AI Response...</h2>
                <p className="text-sm text-emerald-100/70 mb-8">{currentExecutingAction}</p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 mb-8 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${executeAllProgress}%` }}
                  ></div>
                </div>

                <div className="w-full space-y-3">
                  {availableActions.map((action, i) => {
                    const isDone = completedExecuteAllActions.includes(action.id);
                    const isCurrent = currentExecutingAction === action.title;
                    if (!isDone && !isCurrent && i > completedExecuteAllActions.length + 1) return null; // Show only relevant items to keep it clean
                    
                    return (
                      <div key={action.id} className={cn("flex items-center gap-3 transition-all duration-500", isDone ? "opacity-100" : isCurrent ? "opacity-100 scale-105" : "opacity-30")}>
                        {isDone ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 flex items-center justify-center shrink-0">
                            <Loader2 className="w-4 h-4 text-emerald-500/50 animate-spin" />
                          </div>
                        )}
                        <span className={cn("text-sm font-medium", isDone ? "text-emerald-400" : "text-slate-300")}>
                          {action.title}...
                        </span>
                        {isDone && <span className="text-xs text-emerald-500 font-bold ml-auto animate-in fade-in slide-in-from-right-2">✓ Success</span>}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-6 text-center animate-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-10 h-10 text-[#030d09]" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">AI Response Completed</h2>
                <p className="text-emerald-400 font-medium mb-8">All selected actions executed successfully.</p>
                <button 
                  onClick={() => setShowExecuteAllModal(false)}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#030d09] font-bold rounded-xl transition-all"
                >
                  Return to Chat
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
