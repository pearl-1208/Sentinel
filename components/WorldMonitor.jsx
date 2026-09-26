'use client';

import { Globe, ShieldAlert, Zap, Layers, Activity, Lock, AlertTriangle } from 'lucide-react';

const THREAT_FEEDS = [
  { cve: 'CVE-2026-2140', title: 'HTTP/2 Rapid Reset & Header Injection Attack Vector', severity: 'CRITICAL', vector: 'Network / Headers', mitre: 'T1190' },
  { cve: 'CVE-2026-1092', title: 'BOLA / Improper Authorization on REST Endpoints', severity: 'HIGH', vector: 'API Access Control', mitre: 'T1068' },
  { cve: 'CVE-2025-9981', title: 'Permissive CORS Reflection Credential Theft', severity: 'HIGH', vector: 'Browser Security Policy', mitre: 'T1557' },
  { cve: 'CVE-2025-8834', title: 'Unencrypted Session Cookie Interception over Transit', severity: 'MEDIUM', vector: 'Session Management', mitre: 'T1539' },
];

const MITRE_TACTICS = [
  { code: 'TA0001', name: 'Initial Access', tech: 'Exploit Public-Facing Application (T1190)' },
  { code: 'TA0006', name: 'Credential Access', tech: 'Steal Application Access Tokens (T1539)' },
  { code: 'TA0007', name: 'Discovery', tech: 'Network Service Discovery & Info Leak (T1046)' },
  { code: 'TA0011', name: 'Command & Control', tech: 'Standard Application Layer Protocol (T1071)' },
];

export default function WorldMonitor() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h2 className="text-xl font-mono font-bold text-white uppercase tracking-wider">
                World Threat Intelligence Monitor
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Live global attack surface telemetry, exploited CVE feeds, & MITRE ATT&CK framework mapping.
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              GLOBAL FEED: ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Threat Feeds & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Exploited CVE Feed */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2937] pb-3">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Active Exploited Vulnerabilities (Global Feed)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Real-Time Sync</span>
          </div>

          <div className="space-y-3">
            {THREAT_FEEDS.map((item) => (
              <div key={item.cve} className="p-4 bg-[#111827]/70 border border-[#1f2937] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-bold">
                      {item.cve}
                    </span>
                    <span className="text-white font-bold">{item.title}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">MITRE: {item.mitre}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-[#1f2937]">
                  <span>Vector Surface: <strong className="text-slate-200">{item.vector}</strong></span>
                  <span className="text-red-400 font-bold">{item.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MITRE ATT&CK Matrix Alignment */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1f2937] pb-3">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              MITRE ATT&CK Matrix
            </h3>
          </div>

          <div className="space-y-3">
            {MITRE_TACTICS.map((t) => (
              <div key={t.code} className="p-3.5 bg-[#111827]/70 border border-[#1f2937] rounded-xl space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>{t.code}</span>
                  <span className="text-slate-300">{t.name}</span>
                </div>
                <div className="text-[11px] text-slate-400">{t.tech}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
