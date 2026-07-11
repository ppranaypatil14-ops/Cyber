export const detailedAlerts = [
  {
    id: 'ALT-1001',
    severity: 'Critical',
    attackName: 'Possible Account Compromise',
    userDevice: 'Employee-021',
    riskScore: 94,
    detectionTime: '2026-07-10 11:32:04',
    evidenceCount: 5,
    status: 'Investigating',
    ipAddress: '192.168.1.45',
    evidence: [
      'Login occurred outside normal working hours',
      'Unknown device detected',
      'Multiple failed login attempts',
      'Sensitive files accessed',
      'Unusually large data transfer'
    ],
    aiExplanation: 'The AI engine detected anomalous behavior consistent with credential theft followed by initial data gathering. The actor successfully authenticated after multiple failures, which is highly unusual for this user account. Immediate containment is required to prevent data exfiltration.',
    recommendedResponse: 'Lock account Employee-021, isolate device 192.168.1.45, and initiate password reset protocols.'
  },
  {
    id: 'ALT-1002',
    severity: 'Critical',
    attackName: 'Unusual Sensitive Data Download',
    userDevice: 'Server-DB-04',
    riskScore: 91,
    detectionTime: '2026-07-10 11:24:12',
    evidenceCount: 3,
    status: 'Contained',
    ipAddress: '10.0.4.22',
    evidence: [
      'Massive database export initiated',
      'Connection from unauthorized subnet',
      'Encryption of exported files detected'
    ],
    aiExplanation: 'A bulk data extraction event was triggered on the primary database server by an internal IP address that does not typically access this database. The network connection was terminated by automated policy.',
    recommendedResponse: 'Review database access logs for the past 24 hours. Verify the integrity of the downloaded data package.'
  },
  {
    id: 'ALT-1003',
    severity: 'High',
    attackName: 'Multiple Failed Login Attempts',
    userDevice: 'Employee-108',
    riskScore: 78,
    detectionTime: '2026-07-10 11:15:33',
    evidenceCount: 2,
    status: 'Monitoring',
    ipAddress: '192.168.2.112',
    evidence: [
      '15 failed login attempts in 2 minutes',
      'Attempts originated from a known VPN IP'
    ],
    aiExplanation: 'The user is likely experiencing authentication issues or there is a low-and-slow brute force attempt. The risk is elevated because the attempts are continuous.',
    recommendedResponse: 'Contact Employee-108 to verify if they are experiencing login issues. Monitor for successful authentication from this IP.'
  },
  {
    id: 'ALT-1004',
    severity: 'Medium',
    attackName: 'Login From New Device',
    userDevice: 'Employee-056',
    riskScore: 52,
    detectionTime: '2026-07-10 11:05:00',
    evidenceCount: 1,
    status: 'Reviewing',
    ipAddress: '172.16.0.45',
    evidence: [
      'First time login from Windows 11 device (previously macOS)'
    ],
    aiExplanation: 'User authenticated successfully but using a device fingerprint never seen before for this account. This is a moderate risk event requiring basic verification.',
    recommendedResponse: 'Send an automated device verification email to the user.'
  }
];
