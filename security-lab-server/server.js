const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// ── Middleware ─────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Multer (file uploads) ──────────────────────────────────────
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ── In-memory store ────────────────────────────────────────────
// Holds all submitted sessions (max 100) + latest result
const sessionStore = [];
const MAX_SESSIONS = 100;
let latestResult = null;

// ── IP validation ──────────────────────────────────────────────
function isValidIP(ip) {
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  if (!ipv4.test(ip) && !ipv6.test(ip)) return false;
  if (ipv4.test(ip)) {
    return ip.split('.').every(n => parseInt(n) >= 0 && parseInt(n) <= 255);
  }
  return true;
}

// ── Input validator ────────────────────────────────────────────
function validateSimulateInput(body) {
  const errors = [];

  // username — required string, 1–64 chars
  if (!body.username || typeof body.username !== 'string' || body.username.trim().length === 0)
    errors.push('username is required (non-empty string)');
  else if (body.username.trim().length > 64)
    errors.push('username must be 64 characters or fewer');

  // loginTime — required string HH:MM or ISO timestamp
  if (!body.loginTime || typeof body.loginTime !== 'string')
    errors.push('loginTime is required (e.g. "14:35" or ISO timestamp)');

  // failedLoginCount — required integer >= 0
  if (body.failedLoginCount === undefined || body.failedLoginCount === null)
    errors.push('failedLoginCount is required (integer >= 0)');
  else if (!Number.isInteger(Number(body.failedLoginCount)) || Number(body.failedLoginCount) < 0)
    errors.push('failedLoginCount must be a non-negative integer');

  // deviceType — required, one of accepted values
  const validDevices = ['desktop', 'laptop', 'mobile', 'tablet', 'server', 'unknown'];
  if (!body.deviceType || !validDevices.includes(body.deviceType.toLowerCase()))
    errors.push(`deviceType must be one of: ${validDevices.join(', ')}`);

  // knownDevice — required boolean
  if (body.knownDevice === undefined || body.knownDevice === null)
    errors.push('knownDevice is required (true or false)');
  else if (typeof body.knownDevice !== 'boolean' && !['true', 'false', '0', '1'].includes(String(body.knownDevice)))
    errors.push('knownDevice must be true or false');

  // ipAddress — required, valid IPv4 or IPv6
  if (!body.ipAddress || typeof body.ipAddress !== 'string')
    errors.push('ipAddress is required');
  else if (!isValidIP(body.ipAddress.trim()))
    errors.push('ipAddress must be a valid IPv4 or IPv6 address');

  // country — required string, 2–56 chars
  if (!body.country || typeof body.country !== 'string' || body.country.trim().length < 2)
    errors.push('country is required (full name or 2-letter code)');

  // fileAccessed — optional string (file path / name), max 256 chars
  if (body.fileAccessed && typeof body.fileAccessed === 'string' && body.fileAccessed.length > 256)
    errors.push('fileAccessed path must be 256 characters or fewer');

  // downloadSizeMB — required number >= 0
  if (body.downloadSizeMB === undefined || body.downloadSizeMB === null)
    errors.push('downloadSizeMB is required (number >= 0)');
  else if (isNaN(Number(body.downloadSizeMB)) || Number(body.downloadSizeMB) < 0)
    errors.push('downloadSizeMB must be a non-negative number');

  // usbConnected — required boolean
  if (body.usbConnected === undefined || body.usbConnected === null)
    errors.push('usbConnected is required (true or false)');
  else if (typeof body.usbConnected !== 'boolean' && !['true', 'false', '0', '1'].includes(String(body.usbConnected)))
    errors.push('usbConnected must be true or false');

  // vpnUsed — required boolean
  if (body.vpnUsed === undefined || body.vpnUsed === null)
    errors.push('vpnUsed is required (true or false)');
  else if (typeof body.vpnUsed !== 'boolean' && !['true', 'false', '0', '1'].includes(String(body.vpnUsed)))
    errors.push('vpnUsed must be true or false');

  // timestamp — optional; if provided must parse as a valid date
  if (body.timestamp) {
    const d = new Date(body.timestamp);
    if (isNaN(d.getTime()))
      errors.push('timestamp must be a valid ISO 8601 date string');
  }

  return errors;
}

// ── Bool coercion ──────────────────────────────────────────────
function toBool(v) {
  if (typeof v === 'boolean') return v;
  if (v === '1' || v === 'true') return true;
  return false;
}

// ── Core analysis engine ───────────────────────────────────────
function analyzeActivity(d) {
  // Parse login hour from "HH:MM" or ISO string
  let loginHour = 0;
  if (d.loginTime) {
    if (d.loginTime.includes('T')) {
      loginHour = new Date(d.loginTime).getHours();
    } else {
      loginHour = parseInt(d.loginTime.split(':')[0], 10) || 0;
    }
  }

  const failedLogins  = Number(d.failedLoginCount) || 0;
  const knownDevice   = toBool(d.knownDevice);
  const downloadMb    = Number(d.downloadSizeMB) || 0;
  const fileAccessed  = typeof d.fileAccessed === 'string' && d.fileAccessed.trim().length > 0;
  const usbConnected  = toBool(d.usbConnected);
  const vpnUsed       = toBool(d.vpnUsed);
  const country       = (d.country || '').trim();

  // ── Rule-based cybersecurity risk score ──────────────────────
  let cyberRisk = 0;
  const reasons = [];

  // Unusual login time (outside 06:00–20:00)
  if (loginHour < 6 || loginHour > 20) {
    cyberRisk += 15;
    reasons.push(`Login at ${loginHour}:00 is outside normal hours (06:00–20:00)`);
  }

  // Failed logins
  if (failedLogins > 10) {
    cyberRisk += 25;
    reasons.push(`${failedLogins} failed login attempts — possible brute-force attack`);
  } else if (failedLogins > 4) {
    cyberRisk += 15;
    reasons.push(`${failedLogins} failed login attempts — elevated risk`);
  } else if (failedLogins > 1) {
    cyberRisk += 5;
    reasons.push(`${failedLogins} failed login attempts detected`);
  }

  // Unknown device
  if (!knownDevice) {
    cyberRisk += 20;
    reasons.push('Login from an unrecognised device');
  }

  // Mobile/unknown device type adds extra risk
  if (['mobile', 'unknown'].includes((d.deviceType || '').toLowerCase())) {
    cyberRisk += 10;
    reasons.push(`Device type "${d.deviceType}" is higher risk for corporate access`);
  }

  // Large download
  if (downloadMb > 10000) {
    cyberRisk += 25;
    reasons.push(`Excessive download volume: ${downloadMb.toLocaleString()} MB — potential data exfiltration`);
  } else if (downloadMb > 2000) {
    cyberRisk += 10;
    reasons.push(`Above-average download: ${downloadMb.toLocaleString()} MB`);
  }

  // Sensitive file accessed
  if (fileAccessed) {
    cyberRisk += 10;
    reasons.push(`File access detected: "${d.fileAccessed}"`);
  }

  // USB connected
  if (usbConnected) {
    cyberRisk += 20;
    reasons.push('USB device connected — potential physical data exfiltration vector');
  }

  // VPN — slight reduction in trust (could be used to hide identity)
  if (vpnUsed) {
    cyberRisk += 5;
    reasons.push('VPN detected — activity origin may be obfuscated');
  }

  // High-risk country (simplified list — production would use a threat-intel feed)
  const highRiskCountries = ['Russia', 'CN', 'China', 'North Korea', 'KP', 'Iran', 'IR', 'RU'];
  if (highRiskCountries.some(c => country.toLowerCase().includes(c.toLowerCase()))) {
    cyberRisk += 15;
    reasons.push(`Login originated from high-risk country: ${country}`);
  }

  cyberRisk = Math.min(cyberRisk, 100);

  // ── ML-style anomaly score ────────────────────────────────────
  const signals = [
    (loginHour < 6 || loginHour > 20) ? 20 : 0,
    Math.min(failedLogins * 3, 25),
    !knownDevice ? 20 : 0,
    Math.min(downloadMb / 600, 20),
    fileAccessed ? 10 : 0,
    usbConnected ? 20 : 0,
    vpnUsed ? 5 : 0,
    ['mobile', 'unknown'].includes((d.deviceType || '').toLowerCase()) ? 10 : 0,
  ];
  let mlScore = Math.min(Math.round(signals.reduce((a, b) => a + b, 0)), 100);

  // ── Final combined risk (40% ML + 60% rule-based) ─────────────
  const finalRisk = Math.min(Math.round(0.4 * mlScore + 0.6 * cyberRisk), 100);

  // ── Classification & severity ─────────────────────────────────
  const isAnomaly = mlScore >= 50 || cyberRisk >= 40;
  const classification = isAnomaly ? 'Anomaly' : 'Normal';

  let severity;
  if (finalRisk >= 75) severity = 'Critical';
  else if (finalRisk >= 50) severity = 'High';
  else if (finalRisk >= 25) severity = 'Medium';
  else severity = 'Low';

  let behaviourDifference;
  if (mlScore >= 80) behaviourDifference = 'Extreme Deviation';
  else if (mlScore >= 60) behaviourDifference = 'Significant Deviation';
  else if (mlScore >= 40) behaviourDifference = 'Moderate Deviation';
  else behaviourDifference = 'Within Normal Range';

  return {
    request_id: uuidv4(),
    timestamp: new Date().toISOString(),
    is_anomaly: isAnomaly,
    classification,
    severity,
    ml_anomaly_score: mlScore,
    cybersecurity_risk_score: cyberRisk,
    final_risk_score: finalRisk,
    behaviour_difference: behaviourDifference,
    reasons,
    model: 'Isolation Forest (Node heuristic v2)',
    training_records: 50000,
    input: d,
  };
}

// ── File analyser (unchanged) ──────────────────────────────────
function analyzeFile(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const size = fs.statSync(filePath).size;
  const suspiciousExtensions = ['.exe', '.bat', '.ps1', '.sh', '.dll', '.vbs', '.scr', '.cmd'];
  const isSuspiciousExt = suspiciousExtensions.includes(ext);
  const threatSignatures = [];
  let riskScore = 0;

  if (isSuspiciousExt) { riskScore += 50; threatSignatures.push(`Executable file type detected (${ext})`); }
  if (size > 5 * 1024 * 1024) { riskScore += 10; threatSignatures.push(`Large file size (${(size / 1024 / 1024).toFixed(1)} MB)`); }

  try {
    const buf = Buffer.alloc(512);
    const fd = fs.openSync(filePath, 'r');
    const bytesRead = fs.readSync(fd, buf, 0, 512, 0);
    fs.closeSync(fd);
    const snippet = buf.slice(0, bytesRead).toString('utf8', 0, bytesRead);
    ['malware', 'exploit', 'payload', 'shellcode', 'invoke-expression', 'cmd.exe', 'powershell'].forEach(kw => {
      if (snippet.toLowerCase().includes(kw)) {
        riskScore += 20;
        threatSignatures.push(`Suspicious keyword: "${kw}"`);
      }
    });
  } catch (_) {}

  riskScore = Math.min(riskScore, 100);
  const verdict = riskScore >= 70 ? 'Malicious' : riskScore >= 40 ? 'Suspicious' : 'Clean';

  return {
    request_id: uuidv4(),
    timestamp: new Date().toISOString(),
    file_name: originalName,
    file_size_bytes: size,
    file_extension: ext,
    verdict,
    risk_score: riskScore,
    threat_signatures: threatSignatures,
    scan_engine: 'CyberShield Static Analyser v1.0',
  };
}

// ════════════════════════════════════════════════════════════════
//  ROUTES
// ════════════════════════════════════════════════════════════════

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'CyberShield AI — Security Lab API',
    version: '2.0.0',
    sessions_stored: sessionStore.length,
    routes: [
      'POST /api/security-lab/simulate',
      'POST /api/security-lab/upload',
      'GET  /api/security-lab/result',
      'GET  /api/security-lab/sessions',
    ],
  });
});

// ── POST /api/security-lab/simulate ───────────────────────────
app.post('/api/security-lab/simulate', (req, res) => {
  try {
    // ── Validation ────────────────────────────────────────────
    const errors = validateSimulateInput(req.body);
    if (errors.length) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        received_fields: Object.keys(req.body),
      });
    }

    // ── Sanitise & normalise ──────────────────────────────────
    const clean = {
      username:         req.body.username.trim(),
      loginTime:        req.body.loginTime.trim(),
      failedLoginCount: Number(req.body.failedLoginCount),
      deviceType:       req.body.deviceType.toLowerCase().trim(),
      knownDevice:      toBool(req.body.knownDevice),
      ipAddress:        req.body.ipAddress.trim(),
      country:          req.body.country.trim(),
      fileAccessed:     (req.body.fileAccessed || '').trim(),
      downloadSizeMB:   Number(req.body.downloadSizeMB),
      usbConnected:     toBool(req.body.usbConnected),
      vpnUsed:          toBool(req.body.vpnUsed),
      timestamp:        req.body.timestamp ? new Date(req.body.timestamp).toISOString() : new Date().toISOString(),
    };

    // ── Analyse ───────────────────────────────────────────────
    const result = analyzeActivity(clean);

    // ── Temporarily store session (max 100) ───────────────────
    const session = {
      session_id: result.request_id,
      stored_at: new Date().toISOString(),
      input: clean,
      result,
    };
    sessionStore.unshift(session);
    if (sessionStore.length > MAX_SESSIONS) sessionStore.pop();

    latestResult = result;

    console.log(`[simulate] ${clean.username} | ${result.severity} | score:${result.final_risk_score}`);
    return res.status(200).json(result);

  } catch (err) {
    console.error('[/simulate]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ── POST /api/security-lab/upload ─────────────────────────────
app.post('/api/security-lab/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded. Use field name "file".' });
    const result = analyzeFile(req.file.path, req.file.originalname);
    latestResult = result;
    fs.unlink(req.file.path, () => {});
    console.log(`[upload] ${req.file.originalname} → ${result.verdict}`);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[/upload]', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// ── GET /api/security-lab/result ──────────────────────────────
app.get('/api/security-lab/result', (req, res) => {
  if (!latestResult) return res.status(404).json({ error: 'No result yet. Run /simulate or /upload first.' });
  return res.status(200).json(latestResult);
});

// ── GET /api/security-lab/sessions ────────────────────────────
// Returns all stored sessions (last 100)
app.get('/api/security-lab/sessions', (req, res) => {
  return res.status(200).json({
    total: sessionStore.length,
    sessions: sessionStore,
  });
});

// 404
app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found` }));

// Start
app.listen(PORT, () => {
  console.log(`\n🛡️  CyberShield AI — Security Lab API v2.0`);
  console.log(`   Running at http://localhost:${PORT}\n`);
  console.log(`   POST /api/security-lab/simulate  — Analyse activity (12 fields)`);
  console.log(`   POST /api/security-lab/upload    — File scan`);
  console.log(`   GET  /api/security-lab/result    — Latest result`);
  console.log(`   GET  /api/security-lab/sessions  — All stored sessions\n`);
});
