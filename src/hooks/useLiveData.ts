// src/hooks/useLiveData.ts
import { useQuery } from '@tanstack/react-query';

export interface Incident {
  incident_id: string;
  employee_id: string;
  attack_name?: string;
  severity: string;
  risk_score?: number;
  status?: string;
  events_count?: number;
  start_time?: string;
  latest_activity_time?: string;
  current_stage?: string;
  // additional fields from backend enriched in get_incidents
  [key: string]: any;
}

export interface SecurityEvent {
  employee_id: string;
  login_time: string;
  device_status?: number;
  ip_address?: string;
  login_location?: string;
  failed_login_attempts?: number;
  download_size?: number;
  sensitive_file_access?: number;
  antivirus_status?: number;
  ml_classification?: string;
  risk_score?: number;
  severity?: string;
  [key: string]: any;
}

/**
 * Custom hook that fetches incidents and events using react‑query.
 * It automatically refetches every 5 seconds for live updates.
 */
export const useLiveData = () => {
  const {
    data: incidents,
    isLoading: incidentsLoading,
    refetch: refetchIncidents,
  } = useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: async () => {
      const response = await fetch('/incidents');
      if (!response.ok) throw new Error('Failed to fetch incidents');
      return response.json();
    },
    refetchInterval: 5000, // 5 seconds
  });

  const {
    data: events,
    isLoading: eventsLoading,
    refetch: refetchEvents,
  } = useQuery<SecurityEvent[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await fetch('/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    },
    refetchInterval: 5000,
  });

  return {
    incidents: incidents ?? [],
    events: events ?? [],
    isLoading: incidentsLoading || eventsLoading,
    refetchIncidents,
    refetchEvents,
  };
};
