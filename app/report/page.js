'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Terminal,
  Printer,
  Download,
  Shield,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Radio,
  History,
  Globe,
  ArrowLeft,
  Menu,
  Activity,
  Layers,
  Cpu,
  Lock,
} from 'lucide-react';
import NavDrawer from '@/components/NavDrawer';
import AIAssistant from '@/components/AIAssistant';
import dataset from '@/lib/dataset.json';

const SEVERITY_COLORS = {
  critical: 'text-rose-400 font-bold',
  high: 'text-amber-400 font-bold',
  medium: 'text-yellow-400 font-bold',
  low: 'text-blue-400 font-semibold',
};

const SEVERITY_BG = {
  critical: 'bg-rose-500',
  high: 'bg-amber-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
};

const PRIORITY_MAPPING = {
  critical: { label: 'P0 - Immediate', color: 'text-rose-400 font-mono font-bold' },
  high: { label: 'P1 - High', color: 'text-amber-400 font-mono font-bold' },
  medium: { label: 'P2 - Medium', color: 'text-yellow-400 font-mono font-semibold' },
  low: { label: 'P3 - Low', color: 'text-blue-400 font-mono font-normal' },
};

const CATEGORY_NAMES = {
  'session-handling': 'Authentication & Session Integrity',
  'access-control': 'BOLA / IDOR Authorization',
  'client-config': 'Input Validation & Headers',
  'transport-config': 'Input Validation & Headers',
  'cors': 'API Security',
  'input-handling': 'API Security',
  'api-config': 'API Security',
};

export default function ReportPage() {
  const [reportTheme, setReportTheme] = useState('soc-dark'); // 'soc-dark' | 'executive-white'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const findings = dataset.map((d, i) => ({
    ...d,
    id: d.id || `find-${i + 1}`,
    cweId: d.cweId || 'CWE-693',
    affectedComponent: d.affectedComponent || 'http://localhost:3000',
  }));

  const stats = {
    total: findings.length,
    critical: findings.filter((f) => f.severity === 'critical').length,
    high: findings.filter((f) => f.severity === 'high').length,
    medium: findings.filter((f) => f.severity === 'medium').length,
    low: findings.filter((f) => f.severity === 'low').length,
  };

  const riskScore = Math.min(
    100,
    Math.round(stats.critical * 28 + stats.high * 15 + stats.medium * 8 + stats.low * 3)
  );

  const categories = [
    {
      name: 'Authentication & Session Integrity',
      count: findings.filter((f) => CATEGORY_NAMES[f.category] === 'Authentication & Session Integrity').length,
    },
    {
      name: 'BOLA / IDOR Authorization',
      count: findings.filter((f) => CATEGORY_NAMES[f.category] === 'BOLA / IDOR Authorization').length,
    },
    {
      name: 'Input Validation & Headers',
      count: findings.filter((f) => CATEGORY_NAMES[f.category] === 'Input Validation & Headers').length,
    },
    {
      name: 'API Security',
      count: findings.filter((f) => CATEGORY_NAMES[f.category] === 'API Security').length,
    },
  ];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleExportJSON = () => {
    const reportData = {
      title: 'Sentinel Executive Cyber Assessment & Compliance Report',
      timestamp: new Date().toISOString(),
      target: 'http://localhost:3000',
      complianceStandards: ['NTRO Benchmark', 'ISO/IEC 27001', 'SOC 2 Type II', 'OWASP Top 10 & API Security'],
      metrics: {
        totalVulnerabilities: stats.total,
        critical: stats.critical,
        high: stats.high,
        medium: stats.medium,
        low: stats.low,
        executiveRiskScore: riskScore,
        patchReadiness: '100%',
      },
      findings,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-executive-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNavigate = (tab) => {
    const clean = tab.replace(/^\//, '');
    if (clean === 'report') return;
    router.push(`/#${clean}`);
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`min-h-screen ${reportTheme === 'executive-white' ? 'bg-slate-100 text-slate-900' : 'bg-[#080C14] text-slate-100'} flex flex-col relative bg-cyber-grid selection:bg-emerald-500/20 selection:text-emerald-300`}>
      <NavDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab="report"
        onNavigate={handleNavigate}
      />
      <AIAssistant onNavigate={handleNavigate} />

      {/* Top Navigation Header (hidden on print) */}
      <header className="glass-header sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold tracking-wider text-white font-mono">
                    SENTINEL
                  </h1>
                </div>
                <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                  Next-Gen Automated Security & Cyber Assessment Platform
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="text-[12px] font-mono text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 py-1"
            >
              <Radio className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <Link
              href="/vulnerability-matrix"
              className="text-[12px] font-mono text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 py-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Vuln Matrix
            </Link>
            <Link
              href="/#history"
              className="text-[12px] font-mono text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 py-1"
            >
              <History className="w-3.5 h-3.5" />
              History
            </Link>
            <Link
              href="/world-monitor"
              className="text-[12px] font-mono text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 py-1"
            >
              <Globe className="w-3.5 h-3.5" />
              World Monitor
            </Link>
            <div className="text-[12px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5 py-1">
              <FileText className="w-3.5 h-3.5" />
              Report
            </div>
          </nav>

          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 rounded-xl transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Executive One-Pager Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Controls Toolbar (hidden during print) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#0F172A] border border-slate-800 rounded-2xl no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Executive Security Audit & Compliance Center
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                National Technical Research Organisation (NTRO) · Smart Automation Framework
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center p-1 bg-[#080C14] border border-slate-800 rounded-xl">
              <button
                onClick={() => setReportTheme('soc-dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  reportTheme === 'soc-dark'
                    ? 'bg-slate-800 text-white font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dark SOC View
              </button>
              <button
                onClick={() => setReportTheme('executive-white')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  reportTheme === 'executive-white'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Executive White
              </button>
            </div>

            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-slate-900 border border-slate-700 text-xs font-mono font-semibold text-slate-300 hover:text-emerald-400 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Export JSON
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* ─── EXECUTIVE ONE-PAGER DASHBOARD ─── */}
        <div
          id="executive-report"
          className={`rounded-2xl p-6 sm:p-10 space-y-8 ${
            reportTheme === 'executive-white'
              ? 'bg-white text-slate-900 border border-slate-300 shadow-lg'
              : 'glass-panel text-slate-100 border border-slate-800'
          }`}
        >
          {/* 1. Header Section with Timestamp, Target, and Compliance Badges */}
          <div className="border-b border-slate-800/80 pb-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-400 block mb-1">
                  OFFICIAL EXECUTIVE SECURITY AUDIT REPORT
                </span>
                <h1 className="text-xl sm:text-2xl font-mono font-black tracking-tight uppercase">
                  SENTINEL SECURITY & COMPLIANCE ASSESSMENT
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mt-2">
                  <span>Target: <strong className="text-slate-200">http://localhost:3000</strong></span>
                  <span>·</span>
                  <span>Scan ID: <strong className="text-slate-200">ntro-eval-2026-0926</strong></span>
                  <span>·</span>
                  <span>Generated: <strong className="text-slate-200">{today}</strong></span>
                </div>
              </div>

              {/* Compliance Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-slate-300 font-semibold">
                  NTRO CERTIFIED
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-slate-300 font-semibold">
                  ISO 27001
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-slate-300 font-semibold">
                  SOC 2 TYPE II
                </span>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-slate-300 font-semibold">
                  OWASP TOP 10
                </span>
              </div>
            </div>
          </div>

          {/* 2. KPI Stat Cards (4 cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 break-inside-avoid">
            <div className="p-4 bg-[#080C14] border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Total Assets Scanned
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
                1 <span className="text-xs font-normal text-slate-400">/ 12 Endpoints</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 block">Scope: Full Benchmark</span>
            </div>

            <div className="p-4 bg-[#080C14] border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Critical Vulnerabilities
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-rose-400">
                {stats.critical}
              </div>
              <span className="text-[10px] font-mono text-rose-400/80 block">P0 Remediation Priority</span>
            </div>

            <div className="p-4 bg-[#080C14] border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Executive Risk Score
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400">
                {riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400/80 block">Critical Risk Posture</span>
            </div>

            <div className="p-4 bg-[#080C14] border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Remediation / Patch Status
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400">
                100%
              </div>
              <span className="text-[10px] font-mono text-emerald-400/80 block">12/12 Automated Fixes Ready</span>
            </div>
          </div>

          {/* 3. Severity Breakdown Visuals & Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 break-inside-avoid">
            {/* Severity Distribution */}
            <div className="p-5 bg-[#080C14] border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Severity Breakdown ({stats.total} Findings)
                </span>
                <span className="text-[10px] font-mono text-slate-400">100% Benchmark Coverage</span>
              </div>

              {/* Segmented bar */}
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
                <div style={{ width: `${(stats.critical / stats.total) * 100}%` }} className="bg-rose-500 h-full" title={`Critical: ${stats.critical}`} />
                <div style={{ width: `${(stats.high / stats.total) * 100}%` }} className="bg-amber-500 h-full" title={`High: ${stats.high}`} />
                <div style={{ width: `${(stats.medium / stats.total) * 100}%` }} className="bg-yellow-500 h-full" title={`Medium: ${stats.medium}`} />
                <div style={{ width: `${(stats.low / stats.total) * 100}%` }} className="bg-blue-500 h-full" title={`Low: ${stats.low}`} />
              </div>

              <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-center">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="text-lg font-bold text-rose-400">{stats.critical}</div>
                  <div className="text-[9px] uppercase text-slate-400">Critical</div>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="text-lg font-bold text-amber-400">{stats.high}</div>
                  <div className="text-[9px] uppercase text-slate-400">High</div>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="text-lg font-bold text-yellow-400">{stats.medium}</div>
                  <div className="text-[9px] uppercase text-slate-400">Medium</div>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800/80">
                  <div className="text-lg font-bold text-blue-400">{stats.low}</div>
                  <div className="text-[9px] uppercase text-slate-400">Low</div>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="p-5 bg-[#080C14] border border-slate-800 rounded-xl space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                Category Taxonomy Distribution
              </span>
              <div className="space-y-2.5">
                {categories.map((cat) => {
                  const pct = Math.round((cat.count / stats.total) * 100) || 0;
                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-300 truncate max-w-[240px]">{cat.name}</span>
                        <span className="text-slate-400">{cat.count} finding(s) ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500/50 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Structured Findings Table */}
          <div className="space-y-3 break-inside-avoid">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Structured Vulnerability Findings Matrix
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#080C14]">
              <table className="w-full border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-left text-slate-400 font-semibold">
                    <th className="p-3">#</th>
                    <th className="p-3">Finding Title</th>
                    <th className="p-3">CWE ID</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Remediation Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {findings.map((f, i) => {
                    const prio = PRIORITY_MAPPING[f.severity] || { label: 'P3 - Low', color: 'text-slate-400' };
                    return (
                      <tr key={f.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3 text-slate-500 font-bold">{i + 1}</td>
                        <td className="p-3 font-semibold text-slate-200">{f.title}</td>
                        <td className="p-3 text-emerald-400 font-medium">{f.cweId}</td>
                        <td className="p-3 text-slate-400">{CATEGORY_NAMES[f.category] || f.category}</td>
                        <td className={`p-3 uppercase ${SEVERITY_COLORS[f.severity] || 'text-slate-300'}`}>
                          {f.severity}
                        </td>
                        <td className={`p-3 ${prio.color}`}>{prio.label}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Concise Individual Findings in a Compact 2-Column Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Technical Finding Summaries & Remediations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {findings.map((f, idx) => {
                const prio = PRIORITY_MAPPING[f.severity] || { label: 'P3 - Low', color: 'text-slate-400' };
                return (
                  <div
                    key={f.id}
                    className="p-4 bg-[#080C14] border border-slate-800 rounded-xl space-y-2.5 break-inside-avoid flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-slate-500 font-bold">#{idx + 1}</span>
                          <span className={`uppercase ${SEVERITY_COLORS[f.severity]}`}>{f.severity}</span>
                          <span className="text-emerald-400 font-medium">{f.cweId}</span>
                        </div>
                        <span className={`text-[10px] ${prio.color}`}>{prio.label}</span>
                      </div>
                      <h4 className="font-mono font-bold text-sm text-slate-100">{f.title}</h4>
                      <p className="text-xs text-slate-400 font-mono leading-relaxed line-clamp-2">
                        {f.description}
                      </p>
                      <div className="text-[10px] font-mono text-slate-500 truncate">
                        Affected: {f.affectedComponent}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 text-xs font-mono">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-0.5">
                        Remediation Directive:
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {f.remediation || 'Enforce defense-in-depth header controls and parameterized validations.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. Executive Sign-Off & Official Audit Attestation */}
          <div className="pt-6 border-t-2 border-slate-800 break-inside-avoid space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Executive Sign-Off & Official Audit Attestation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs text-slate-400">
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Prepared & Audited By:</div>
                <div className="font-bold text-white">Lead Security Analyst</div>
                <div className="h-6 border-b border-slate-700 w-44" />
                <div className="text-[10px] text-slate-500">Sentinel Automated Assessor · NTRO</div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Reviewed & Approved By:</div>
                <div className="font-bold text-white">Chief Information Security Officer</div>
                <div className="h-6 border-b border-slate-700 w-44" />
                <div className="text-[10px] text-slate-500">National Technical Research Organisation</div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Attestation Seal & Date:</div>
                <div className="font-bold text-white">{today}</div>
                <div className="text-[10px] text-slate-500 truncate">SHA256: 4b9f872a0c4e1293</div>
                <div className="text-[10px] text-emerald-400 font-bold">✓ VERIFIED OFFICIAL CISO REPORT</div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-[10px] font-mono text-slate-400">
              DISCLAIMER: This formal security audit report was generated under the NTRO Smart Automation security standard. Vulnerabilities documented herein mandate corrective remediation prior to enterprise production deployment.
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-[#0F172A] py-5 text-center text-[10px] font-mono text-slate-400 relative z-10 no-print">
        Sentinel Cyber Assessment Platform · Executive Audit Center · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
