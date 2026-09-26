'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Terminal,
  Play,
  Pause,
  Trash2,
  Download,
  Copy,
  Check,
  Filter,
  Radio,
  FileCode,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { useToast } from './ToastProvider';

const INITIAL_EVENTS = [
  {
    id: 'evt_1001',
    timestamp: new Date(Date.now() - 42000).toISOString(),
    severity: 'CRITICAL',
    facility: 'API_GATEWAY',
    sourceIp: '10.24.110.42',
    targetEndpoint: '/api/user/settings/res_849204_ntro',
    cwe: 'CWE-639',
    message: 'BOLA/IDOR attempt: User B Bearer token submitted against User A resource ID.',
  },
  {
    id: 'evt_1002',
    timestamp: new Date(Date.now() - 36000).toISOString(),
    severity: 'CRITICAL',
    facility: 'QUERY_ENGINE',
    sourceIp: '192.168.10.88',
    targetEndpoint: '/api/search?q=\'%20OR%201=1--',
    cwe: 'CWE-89',
    message: 'SQL Injection detected: Syntax error disclosure in telemetry response stream.',
  },
  {
    id: 'evt_1003',
    timestamp: new Date(Date.now() - 28000).toISOString(),
    severity: 'HIGH',
    facility: 'CORS_FILTER',
    sourceIp: '172.16.0.15',
    targetEndpoint: '/api/v1/auth/session',
    cwe: 'CWE-942',
    message: 'Permissive CORS: Origin header reflection with Access-Control-Allow-Credentials: true.',
  },
  {
    id: 'evt_1004',
    timestamp: new Date(Date.now() - 20000).toISOString(),
    severity: 'HIGH',
    facility: 'AUTH_COOKIE',
    sourceIp: '127.0.0.1',
    targetEndpoint: '/api/auth/login',
    cwe: 'CWE-1004',
    message: 'Session token cookie provisioned without HttpOnly directive; document.cookie access possible.',
  },
  {
    id: 'evt_1005',
    timestamp: new Date(Date.now() - 14000).toISOString(),
    severity: 'MEDIUM',
    facility: 'HTTP_HEADERS',
    sourceIp: '10.0.4.12',
    targetEndpoint: '/',
    cwe: 'CWE-693',
    message: 'Missing Content-Security-Policy (CSP) header and X-Frame-Options ancestor controls.',
  },
  {
    id: 'evt_1006',
    timestamp: new Date(Date.now() - 8000).toISOString(),
    severity: 'LOW',
    facility: 'BANNER_GUARD',
    sourceIp: '10.0.4.12',
    targetEndpoint: '/api/v1/health',
    cwe: 'CWE-200',
    message: 'Information disclosure: Server banner broadcasted Next.js / Express version tags.',
  },
  {
    id: 'evt_1007',
    timestamp: new Date(Date.now() - 2000).toISOString(),
    severity: 'INFO',
    facility: 'AUDIT_DAEMON',
    sourceIp: '127.0.0.1',
    targetEndpoint: '/api/scans',
    cwe: 'N/A',
    message: 'Automated vulnerability assessment cycle initialized against target environment.',
  },
];

const SEVERITY_COLORS = {
  CRITICAL: 'text-rose-300 bg-rose-950/30 border-rose-900/40 font-semibold',
  HIGH: 'text-amber-300 bg-amber-950/30 border-amber-900/40 font-semibold',
  MEDIUM: 'text-yellow-300 bg-yellow-950/30 border-yellow-900/40 font-semibold',
  LOW: 'text-slate-300 bg-slate-800/60 border-slate-700/50 font-semibold',
  INFO: 'text-emerald-400/90 bg-emerald-950/25 border-emerald-900/35 font-semibold',
};

// Formats a SIEM event to RFC 5424 Syslog line
function toSyslog(evt) {
  const pri = evt.severity === 'CRITICAL' ? 131 : evt.severity === 'HIGH' ? 132 : evt.severity === 'MEDIUM' ? 134 : 136;
  return `<${pri}>1 ${evt.timestamp} sentinel.ntro.gov SIEM 12048 ${evt.id} [sentinel@ntro severity="${evt.severity}" facility="${evt.facility}" cwe="${evt.cwe}" src="${evt.sourceIp}" dst="${evt.targetEndpoint}"] ${evt.message}`;
}

// Formats a SIEM event to ArcSight Common Event Format (CEF)
function toCEF(evt) {
  const sevScore = evt.severity === 'CRITICAL' ? 10 : evt.severity === 'HIGH' ? 8 : evt.severity === 'MEDIUM' ? 5 : 2;
  return `CEF:0|Sentinel|CyberAssessmentEngine|3.0|${evt.cwe || 'SEC-001'}|${evt.message.slice(0, 48)}|${sevScore}|src=${evt.sourceIp} request=${evt.targetEndpoint} msg=${evt.message} cn1=${sevScore} cn1Label=RiskScore`;
}

export default function SiemTerminalStream({ className = '' }) {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [isLive, setIsLive] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedFormat, setCopiedFormat] = useState(null);
  const terminalEndRef = useRef(null);
  const { addToast } = useToast();

  // Periodic synthetic SOC event streaming when live
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const templates = [
        {
          severity: 'HIGH',
          facility: 'AUTH_GATEWAY',
          sourceIp: `10.${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250)}`,
          targetEndpoint: '/api/v1/auth/refresh',
          cwe: 'CWE-287',
          message: 'OAuth refresh token replay detection: Token hash reused across multiple sessions.',
        },
        {
          severity: 'CRITICAL',
          facility: 'BOLA_ENGINE',
          sourceIp: `192.168.10.${Math.floor(Math.random() * 200)}`,
          targetEndpoint: `/api/user/settings/res_${Math.floor(100000 + Math.random() * 900000)}`,
          cwe: 'CWE-639',
          message: 'Cross-user object access verified: Unauthorized resource identifier resolved.',
        },
        {
          severity: 'MEDIUM',
          facility: 'TRANSPORT_TLS',
          sourceIp: '127.0.0.1',
          targetEndpoint: '/',
          cwe: 'CWE-319',
          message: 'Strict-Transport-Security (HSTS) missing; downgrade to unencrypted HTTP potential.',
        },
        {
          severity: 'INFO',
          facility: 'HEURISTIC_SCAN',
          sourceIp: '127.0.0.1',
          targetEndpoint: '/api/health',
          cwe: 'N/A',
          message: 'Passive endpoint fingerprinting completed; all response headers recorded.',
        },
      ];

      const pick = templates[Math.floor(Math.random() * templates.length)];
      const newEvt = {
        id: `evt_${Date.now().toString().slice(-5)}`,
        timestamp: new Date().toISOString(),
        ...pick,
      };

      setEvents((prev) => [...prev.slice(-99), newEvt]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (severityFilter !== 'ALL' && e.severity !== severityFilter) return false;
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        return (
          e.message.toLowerCase().includes(q) ||
          e.targetEndpoint.toLowerCase().includes(q) ||
          e.facility.toLowerCase().includes(q) ||
          e.cwe.toLowerCase().includes(q) ||
          e.sourceIp.includes(q)
        );
      }
      return true;
    });
  }, [events, severityFilter, searchFilter]);

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ message: `Exported ${filename}`, type: 'success' });
  };

  const exportSyslog = () => {
    const lines = filteredEvents.map(toSyslog).join('\n');
    downloadFile(lines, `sentinel-siem-syslog-${Date.now()}.log`, 'text/plain');
  };

  const exportCEF = () => {
    const lines = filteredEvents.map(toCEF).join('\n');
    downloadFile(lines, `sentinel-siem-cef-${Date.now()}.cef`, 'text/plain');
  };

  const exportJSON = () => {
    const jsonStr = JSON.stringify(filteredEvents, null, 2);
    downloadFile(jsonStr, `sentinel-siem-events-${Date.now()}.json`, 'application/json');
  };

  const copyRecentToClipboard = (format) => {
    let text = '';
    if (format === 'syslog') text = filteredEvents.map(toSyslog).join('\n');
    else if (format === 'cef') text = filteredEvents.map(toCEF).join('\n');
    else text = JSON.stringify(filteredEvents, null, 2);

    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
    addToast({ message: `Copied ${format.toUpperCase()} log stream to clipboard`, type: 'info' });
  };

  return (
    <div className={`glass-panel rounded-2xl overflow-hidden flex flex-col border border-slate-800 ${className}`}>
      {/* Top HUD Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3.5 bg-[#0F172A] border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                SIEM Event Stream
              </h3>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-semibold flex items-center gap-1.5 ${
                isLive ? 'bg-emerald-950/40 border-emerald-800/50 text-[#34D399]' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                {isLive ? 'LIVE CAPTURE' : 'PAUSED'}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              Enterprise SOC Telemetry Stream · Multi-Format Security Pipeline
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-semibold border flex items-center gap-1.5 transition-all ${
              isLive
                ? 'bg-amber-950/30 border-amber-800/40 text-[#FACC15] hover:bg-amber-900/40'
                : 'bg-emerald-950/30 border-emerald-800/40 text-[#34D399] hover:bg-emerald-900/40'
            }`}
          >
            {isLive ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Resume</>}
          </button>

          <button
            onClick={() => setEvents([])}
            className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 bg-slate-900 flex items-center gap-1.5 transition-all"
            title="Clear buffer"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>

          {/* Format Export Dropdown Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={exportSyslog}
              className="px-2 py-1 rounded text-[10px] font-mono font-bold text-slate-300 hover:text-emerald-400 hover:bg-slate-900 transition-colors flex items-center gap-1"
              title="Export RFC 5424 Syslog"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              Syslog
            </button>
            <button
              onClick={exportCEF}
              className="px-2 py-1 rounded text-[10px] font-mono font-bold text-slate-300 hover:text-blue-400 hover:bg-slate-900 transition-colors flex items-center gap-1"
              title="Export ArcSight CEF Format"
            >
              <Download className="w-3 h-3 text-blue-400" />
              CEF
            </button>
            <button
              onClick={exportJSON}
              className="px-2 py-1 rounded text-[10px] font-mono font-bold text-slate-300 hover:text-purple-400 hover:bg-slate-900 transition-colors flex items-center gap-1"
              title="Export Raw JSON"
            >
              <Download className="w-3 h-3 text-purple-400" />
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="px-5 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex flex-col sm:flex-row gap-2.5 items-start sm:items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mr-1">Filter:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                severityFilter === sev
                  ? 'bg-slate-800 text-white border border-slate-600'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/60'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search facility, IP, CWE..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-7 pr-3 py-1 bg-slate-900/80 border border-slate-800 focus:border-slate-700 rounded-md text-[10px] font-mono text-slate-200 placeholder-slate-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Terminal Stream Console */}
      <div className="p-4 bg-[#080C14] h-72 overflow-y-auto space-y-1 font-mono text-[11px] selection:bg-emerald-500/30 selection:text-white">
        {filteredEvents.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 text-xs">
            No SIEM log events matching filter criteria
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const timeStr = new Date(evt.timestamp).toLocaleTimeString();
            return (
              <div
                key={evt.id}
                className="flex items-start gap-2.5 py-1 px-2 rounded hover:bg-slate-900/40 transition-colors border-l-2 border-transparent hover:border-slate-700 leading-relaxed"
              >
                <span className="text-slate-500 shrink-0 text-[10px]">{timeStr}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                    SEVERITY_COLORS[evt.severity] || 'text-slate-400'
                  }`}
                >
                  {evt.severity}
                </span>
                <span className="text-slate-400 font-semibold shrink-0 text-[10px]">
                  [{evt.facility}]
                </span>
                <span className="text-slate-500 shrink-0 text-[10px]">
                  {evt.sourceIp}
                </span>
                <span className="text-slate-300 flex-1 truncate">
                  {evt.message}
                </span>
                {evt.cwe && evt.cwe !== 'N/A' && (
                  <span className="text-[9px] font-bold text-emerald-400/90 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    {evt.cwe}
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Footer with Quick Copy Shortcuts */}
      <div className="px-5 py-2 bg-[#0F172A] border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>
          Buffered Events: <strong className="text-white">{filteredEvents.length}</strong> / {events.length}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => copyRecentToClipboard('syslog')}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            {copiedFormat === 'syslog' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            Copy Syslog
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => copyRecentToClipboard('cef')}
            className="hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            {copiedFormat === 'cef' ? <Check className="w-3 h-3 text-blue-400" /> : <Copy className="w-3 h-3" />}
            Copy CEF
          </button>
        </div>
      </div>
    </div>
  );
}
