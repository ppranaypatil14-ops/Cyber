export const networkActivityData = [
  { time: '00:00', normal: 4000, suspicious: 240, blocked: 100 },
  { time: '04:00', normal: 3000, suspicious: 139, blocked: 80 },
  { time: '08:00', normal: 8000, suspicious: 980, blocked: 400 },
  { time: '12:00', normal: 12000, suspicious: 1200, blocked: 800 },
  { time: '16:00', normal: 9000, suspicious: 800, blocked: 350 },
  { time: '20:00', normal: 6000, suspicious: 400, blocked: 200 },
  { time: '24:00', normal: 4500, suspicious: 300, blocked: 150 },
];

export const threatDetectionData = [
  { day: 'Mon', detected: 45, prevented: 43 },
  { day: 'Tue', detected: 52, prevented: 51 },
  { day: 'Wed', detected: 38, prevented: 38 },
  { day: 'Thu', detected: 65, prevented: 63 },
  { day: 'Fri', detected: 48, prevented: 47 },
  { day: 'Sat', detected: 30, prevented: 30 },
  { day: 'Sun', detected: 25, prevented: 25 },
];

export const recentAlerts = [
  {
    id: 'ALT-1001',
    severity: 'Critical',
    alert: 'Possible Account Compromise',
    asset: 'Employee-021',
    time: '2 minutes ago',
    riskScore: 94,
    status: 'Investigating',
  },
  {
    id: 'ALT-1002',
    severity: 'Critical',
    alert: 'Unusual Sensitive Data Download',
    asset: 'Server-DB-04',
    time: '8 minutes ago',
    riskScore: 91,
    status: 'Contained',
  },
  {
    id: 'ALT-1003',
    severity: 'High',
    alert: 'Multiple Failed Login Attempts',
    asset: 'Employee-108',
    time: '15 minutes ago',
    riskScore: 78,
    status: 'Monitoring',
  },
  {
    id: 'ALT-1004',
    severity: 'Medium',
    alert: 'Login From New Device',
    asset: 'Employee-056',
    time: '25 minutes ago',
    riskScore: 52,
    status: 'Reviewing',
  },
];
