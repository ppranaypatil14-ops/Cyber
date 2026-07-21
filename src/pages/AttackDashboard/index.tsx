import React from 'react';
import { useLiveData } from '../../hooks/useLiveData';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { IncidentTable } from '../../components/dashboard/IncidentTable';
import { RecentActivityPanel } from '../../components/dashboard/RecentActivityPanel';
import { ChartsPanel } from '../../components/dashboard/ChartsPanel';
import { FilterBar } from '../../components/dashboard/FilterBar';
import { AiInvestigationPanel } from '../../components/dashboard/AiInvestigationPanel';
import { ExportButtons } from '../../components/dashboard/ExportButtons';

export const AttackDashboard: React.FC = () => {
  const { incidents, events, isLoading } = useLiveData();
  const [simulatedContained, setSimulatedContained] = React.useState(false);

  React.useEffect(() => {
    const checkContained = () => setSimulatedContained(localStorage.getItem('simulated_contained') === 'true');
    checkContained();
    window.addEventListener('simulated_contained', checkContained);
    return () => window.removeEventListener('simulated_contained', checkContained);
  }, []);

  if (isLoading) return <div className="p-8 text-white">Loading dashboard...</div>;

  // Inject simulated data
  const displayIncidents = [...incidents];
  if (simulatedContained) {
    const targetIdx = displayIncidents.findIndex(i => i.id === 'INC-2026-0042' || i.title.includes('Account Compromise'));
    if (targetIdx !== -1) {
      displayIncidents[targetIdx] = { ...displayIncidents[targetIdx], status: 'Contained', severity: 'Info' }; // 'Info' or just keep as is, but we want it out of Critical
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
    <div className="p-6 space-y-6 bg-dark-bg min-h-screen text-white">
      <h1 className="text-3xl font-bold">Attack Correlation Dashboard</h1>
      <p className="text-lg opacity-80">Real-Time Correlated Cyber Incidents</p>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <MetricCard title="Active Incidents" value={activeIncidents} />
        <MetricCard title="Total Security Events" value={totalEvents} />
        <MetricCard title="Critical Incidents" value={criticalIncidents} />
        <MetricCard title="Contained Incidents" value={containedIncidents} />
        <MetricCard title="High Incidents" value={highIncidents} />
        <MetricCard title="Medium Incidents" value={mediumIncidents} />
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
