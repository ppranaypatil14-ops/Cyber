import React from 'react';
import { useLiveData } from '../../hooks/useLiveData';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { IncidentTable } from '../../components/dashboard/IncidentTable';
import { RecentActivityPanel } from '../../components/dashboard/RecentActivityPanel';
import { ChartsPanel } from '../../components/dashboard/ChartsPanel';
import { FilterBar } from '../../components/dashboard/FilterBar';
import { AiInvestigationPanel } from '../../components/dashboard/AiInvestigationPanel';
import { ExportButtons } from '../../components/dashboard/ExportButtons';
import { ShieldAlert, Activity, AlertTriangle, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

export const AttackDashboard: React.FC = () => {
  const { incidents, events, isLoading } = useLiveData();
  const [simulatedContained, setSimulatedContained] = React.useState(false);

  React.useEffect(() => {
    const checkContained = () => setSimulatedContained(localStorage.getItem('simulated_contained') === 'true');
    checkContained();
    window.addEventListener('simulated_contained', checkContained);
    return () => window.removeEventListener('simulated_contained', checkContained);
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading Dashboard...</p>
      </div>
    </div>
  );

  // Inject simulated data
  const displayIncidents = [...incidents];
  if (simulatedContained) {
    const targetIdx = displayIncidents.findIndex(i => i.id === 'INC-2026-0042' || i.title.includes('Account Compromise'));
    if (targetIdx !== -1) {
      displayIncidents[targetIdx] = { ...displayIncidents[targetIdx], status: 'Contained', severity: 'Info' };
    }
  }

  const displayEvents = [...events];
  if (simulatedContained) {
    const now = new Date().toISOString();
    displayEvents.push(
      { timestamp: now, type: 'action', description: 'SOC Team Notified', source: 'AI Response', severity: 'low' },
      { timestamp: now, type: 'action', description: 'Employee Account Locked: Employee-021', source: 'AI Response', severity: 'low' },
      { timestamp: now, type: 'action', description: 'Incident Contained: INC-2026-0042', source: 'System', severity: 'info' }
    );
  }

  // Compute metrics
  const activeIncidents = displayIncidents.filter(i => i.status !== 'Contained').length;
  const totalEvents = displayEvents.length;
  const criticalIncidents = displayIncidents.filter(i => i.severity === 'Critical').length;
  const highIncidents = displayIncidents.filter(i => i.severity === 'High').length;
  const mediumIncidents = displayIncidents.filter(i => i.severity === 'Medium').length;
  const containedIncidents = displayIncidents.filter(i => i.status === 'Contained').length;
  const avgRiskScore = displayIncidents.reduce((a, b) => a + (b.risk_score || 0), 0) / (displayIncidents.length || 1);
  const latestIncidentTime = displayIncidents.reduce((latest, cur) => {
    const curTime = new Date(cur.latest_activity_time);
    return curTime > latest ? curTime : latest;
  }, new Date(0));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-[#05130e]/80 backdrop-blur-xl border border-emerald-500/15 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-emerald-400" />
              Attack Correlation Dashboard
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </h1>
            <p className="text-sm text-slate-400 mt-1">Real-Time Correlated Cyber Incidents & Threat Intelligence</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="px-3 py-1.5 bg-[#030d09] border border-emerald-500/20 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">Live Monitoring</span>
            </div>
            <div className="px-3 py-1.5 bg-[#030d09] border border-emerald-500/20 rounded-xl flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300"><strong className="text-cyan-400">{totalEvents}</strong> Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Active Incidents" value={activeIncidents} icon={<AlertTriangle className="w-5 h-5" />} />
        <MetricCard title="Critical Incidents" value={criticalIncidents} icon={<ShieldAlert className="w-5 h-5" />} />
        <MetricCard title="Contained Incidents" value={containedIncidents} icon={<ShieldCheck className="w-5 h-5" />} />
        <MetricCard title="High Incidents" value={highIncidents} icon={<Activity className="w-5 h-5" />} />
        <MetricCard title="Medium Incidents" value={mediumIncidents} />
        <MetricCard title="Total Security Events" value={totalEvents} />
        <MetricCard title="Avg Risk Score" value={avgRiskScore.toFixed(1)} />
        <MetricCard title="Latest Incident" value={latestIncidentTime.toLocaleTimeString()} />
      </div>

      {/* Filters & Search */}
      <FilterBar />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncidentTable incidents={displayIncidents} />
        </div>
        <div className="space-y-4">
          <RecentActivityPanel events={displayEvents.slice(-10).reverse()} />
          <ChartsPanel incidents={displayIncidents} events={displayEvents} />
          <AiInvestigationPanel />
          <ExportButtons incidents={displayIncidents} />
        </div>
      </div>
    </div>
  );
};
