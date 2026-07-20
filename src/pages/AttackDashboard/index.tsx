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

  if (isLoading) return <div className="p-8 text-white">Loading dashboard...</div>;

  // Compute metrics
  const activeIncidents = incidents.length;
  const totalEvents = events.length;
  const criticalIncidents = incidents.filter(i => i.severity === 'Critical').length;
  const highIncidents = incidents.filter(i => i.severity === 'High').length;
  const mediumIncidents = incidents.filter(i => i.severity === 'Medium').length;
  const lowIncidents = incidents.filter(i => i.severity === 'Low').length;
  const avgRiskScore = incidents.reduce((a, b) => a + (b.risk_score || 0), 0) / (incidents.length || 1);
  const latestIncidentTime = incidents.reduce((latest, cur) => {
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
        <MetricCard title="High Incidents" value={highIncidents} />
        <MetricCard title="Medium Incidents" value={mediumIncidents} />
        <MetricCard title="Low Incidents" value={lowIncidents} />
        <MetricCard title="Avg Risk Score" value={avgRiskScore.toFixed(1)} />
        <MetricCard title="Latest Incident" value={latestIncidentTime.toLocaleString()} />
      </div>

      {/* Filters & Search */}
      <FilterBar />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncidentTable incidents={incidents} />
        </div>
        <div className="space-y-4">
          <RecentActivityPanel events={events.slice(-10).reverse()} />
          <ChartsPanel incidents={incidents} events={events} />
          <AiInvestigationPanel />
          <ExportButtons incidents={incidents} />
        </div>
      </div>
    </div>
  );
};
