'use client';

import { useState, useEffect, memo } from 'react';
import {
  Globe,
  Activity,
  AlertTriangle,
  Shield,
  Target,
  Zap,
  Radio,
  ArrowRight,
} from 'lucide-react';

const THREAT_FEEDS = [
  {
    id: 'tf-001',
    time: '00:00:12',
    origin: 'CN / Guangdong',
    target: 'Enterprise APIs',
    type: 'T1190 Exploit Public-Facing',
    cve: 'CVE-2026-0471',
    severity: 'critical',
    framework: 'MITRE T1190',
    description: 'Mass exploitation sweep targeting Spring Boot deserialization endpoints.',
  },
  {
    id: 'tf-002',
    time: '00:00:47',
    origin: 'RU / Moscow',
    target: 'Authentication Services',
    type: 'T1078 Valid Accounts',
    cve: 'CWE-284',
    severity: 'high',
    framework: 'MITRE T1078',
    description: 'Credential stuffing campaign against OAuth 2.0 endpoints using leaked combolists.',
  },
  {
    id: 'tf-003',
    time: '00:01:23',
    origin: 'KP / Pyongyang',
    target: 'Financial APIs',
    type: 'API1 BOLA/IDOR',
    cve: 'CWE-639',
    severity: 'critical',
    framework: 'OWASP API1:2023',
    description: 'Automated BOLA enumeration across banking API endpoints targeting user financial records.',
  },
  {
    id: 'tf-004',
    time: '00:02:08',
    origin: 'US / Ashburn VA',
    target: 'Web Applications',
    type: 'T1059.007 JavaScript Injection',
    cve: 'CVE-2026-1102',
    severity: 'critical',
    framework: 'MITRE T1059.007',
    description: 'XSS campaign via stored payload injection in user-facing CMS widgets.',
  },
  {
    id: 'tf-005',
    time: '00:03:14',
    origin: 'IR / Tehran',
    target: 'DNS Infrastructure',
    type: 'T1557 Adversary-in-Middle',
    cve: 'CWE-924',
    severity: 'high',
    framework: 'MITRE T1557',
    description: 'BGP hijacking detected affecting CDN infrastructure routing in EU region.',
  },
  {
    id: 'tf-006',
    time: '00:04:02',
    origin: 'BR / São Paulo',
    target: 'REST APIs',
    type: 'SQL Injection via API',
    cve: 'CVE-2025-9834',
    severity: 'high',
    framework: 'OWASP A03:2021',
    description: 'Time-based blind SQLi targeting pagination parameters in e-commerce REST endpoints.',
  },
];

const MITRE_TECHNIQUES = [
  { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access', risk: 92, trend: '+14%' },
  { id: 'T1078', name: 'Valid Accounts', tactic: 'Persistence', risk: 78, trend: '+8%' },
  { id: 'T1059.007', name: 'JavaScript Injection', tactic: 'Execution', risk: 85, trend: '+22%' },
  { id: 'T1557', name: 'Adversary-in-the-Middle', tactic: 'Collection', risk: 63, trend: '+5%' },
  { id: 'T1565', name: 'Data Manipulation', tactic: 'Impact', risk: 71, trend: '+11%' },
];

const OWASP_STATUS = [
  { id: 'A01', name: 'Broken Access Control', active: true, severity: 'critical' },
  { id: 'A02', name: 'Cryptographic Failures', active: true, severity: 'high' },
  { id: 'A03', name: 'Injection', active: true, severity: 'critical' },
  { id: 'A04', name: 'Insecure Design', active: false, severity: 'medium' },
  { id: 'A05', name: 'Security Misconfiguration', active: true, severity: 'high' },
  { id: 'A06', name: 'Vulnerable Components', active: true, severity: 'high' },
  { id: 'A07', name: 'Auth & Session Failures', active: false, severity: 'high' },
  { id: 'A08', name: 'Software Integrity Failures', active: true, severity: 'medium' },
  { id: 'A09', name: 'Security Logging Failures', active: false, severity: 'medium' },
  { id: 'A10', name: 'SSRF', active: false, severity: 'low' },
];

const SEV_COLORS = {
  critical: 'text-rose-300 bg-rose-950/30 border-rose-900/40 font-semibold',
  high: 'text-amber-300 bg-amber-950/30 border-amber-900/40 font-semibold',
  medium: 'text-yellow-300 bg-yellow-950/30 border-yellow-900/40 font-semibold',
  low: 'text-slate-300 bg-slate-800/60 border-slate-700/50 font-semibold',
};

import SiemTerminalStream from './SiemTerminalStream';

const WorldMonitor = memo(function WorldMonitor() {
  const [tick, setTick] = useState(0);
  const [liveFeeds, setLiveFeeds] = useState(THREAT_FEEDS);

  // Simulate live tick for "live" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalThreats = liveFeeds.length;
  const criticalCount = liveFeeds.filter((f) => f.severity === 'critical').length;
  const highCount = liveFeeds.filter((f) => f.severity === 'high').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 border border-red-500/25 rounded-xl">
              <Globe className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-mono font-bold text-white">World Monitor & Threat Intelligence</h2>
              <p className="text-xs font-mono text-slate-400">Live global attack surface · MITRE ATT&CK × OWASP cross-mapping</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-red-400">
            <Radio className="w-3 h-3 animate-pulse" />
            LIVE FEED
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Threat Feeds', value: totalThreats, color: 'text-white' },
          { label: 'Critical Vectors', value: criticalCount, color: 'text-[#F87171]' },
          { label: 'High Severity', value: highCount, color: 'text-[#FB923C]' },
          { label: 'MITRE Techniques', value: MITRE_TECHNIQUES.length, color: 'text-[#60A5FA]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-xl p-4">
            <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">{label}</div>
            <div className={`text-2xl font-extrabold font-mono ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live Threat Intelligence Feed */}
        <div className="xl:col-span-2 glass-panel rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-400" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Live Threat Intelligence Feed
              </h3>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              Streaming
            </span>
          </div>
          <div className="divide-y divide-slate-800/40">
            {liveFeeds.map((feed) => (
              <div key={feed.id} className="px-5 py-3.5 hover:bg-slate-900/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${SEV_COLORS[feed.severity]}`}>
                        {feed.severity}
                      </span>
                      <span className="text-[10px] font-mono text-slate-300 font-semibold">{feed.type}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{feed.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-slate-500">
                      <span>📍 {feed.origin}</span>
                      <span>→ {feed.target}</span>
                      <span className="text-emerald-500 font-medium">{feed.framework}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[9px] font-mono text-red-400 mb-1">{feed.cve}</div>
                    <div className="text-[9px] font-mono text-slate-500">+{feed.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* MITRE ATT&CK Active Techniques */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  MITRE ATT&CK Active
                </h3>
              </div>
            </div>
            <div className="divide-y divide-slate-800/30">
              {MITRE_TECHNIQUES.map((t) => (
                <div key={t.id} className="px-4 py-3 hover:bg-slate-900/20 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-orange-400 font-bold">{t.id}</span>
                    <span className="text-[9px] font-mono text-red-400">{t.trend}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 mb-0.5 truncate">{t.name}</div>
                  <div className="text-[9px] font-mono text-slate-500 mb-1.5">{t.tactic}</div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      style={{ width: `${t.risk}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OWASP Top 10 Status */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  OWASP Top 10 Active
                </h3>
              </div>
            </div>
            <div className="px-4 py-3 space-y-2">
              {OWASP_STATUS.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.active ? 'bg-red-400 animate-pulse' : 'bg-slate-700'}`} />
                  <span className="text-[9px] font-mono text-slate-500 w-6 shrink-0">{item.id}</span>
                  <span className={`text-[10px] font-mono flex-1 truncate ${item.active ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.name}
                  </span>
                  {item.active && (
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${SEV_COLORS[item.severity]}`}>
                      {item.severity.slice(0, 4).toUpperCase()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SIEM Terminal Stream Section */}
      <div className="space-y-2">
        <SiemTerminalStream />
      </div>
    </div>
  );
});

export default WorldMonitor;
