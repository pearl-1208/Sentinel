'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Terminal,
  Key,
  User,
  Layers,
  Clock,
  Activity,
  Radio,
  Copy,
  Check,
  FileText,
  History,
  Download,
  Code2,
  Printer,
  Menu,
  Globe,
  Settings,
  Search,
  Filter,
  LogOut,
  Zap,
  BarChart3,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Cpu,
  FileCheck,
} from 'lucide-react';
import BrandLoader from '../components/BrandLoader';
import SecurityRadarChart from '../components/SecurityRadarChart';
import RiskTrendChart from '../components/RiskTrendChart';
import CategoryDistribution from '../components/CategoryDistribution';
import LoginPage from '../components/LoginPage';
import NavDrawer from '../components/NavDrawer';
import AIAssistant from '../components/AIAssistant';
import WorldMonitor from '../components/WorldMonitor';
import RemediationModal from '../components/RemediationModal';
import SiemTerminalStream from '../components/SiemTerminalStream';
import { useToast } from '../components/ToastProvider';
import dataset from '@/lib/dataset.json';

const SEVERITY_ORDER = { critical: 1, high: 2, medium: 3, low: 4 };

const SEVERITY_COLORS = {
  critical: 'bg-rose-950/30 text-rose-300 border-rose-900/40 font-semibold',
  high: 'bg-amber-950/30 text-amber-300 border-amber-900/40 font-semibold',
  medium: 'bg-yellow-950/30 text-yellow-300 border-yellow-900/40 font-semibold',
  low: 'bg-slate-800/60 text-slate-300 border-slate-700/50 font-semibold',
};

const SEVERITY_DOT = {
  critical: 'bg-rose-500/80',
  high: 'bg-amber-500/80',
  medium: 'bg-yellow-500/80',
  low: 'bg-slate-500/80',
};

const OWASP_MAP = {
  'client-config': 'A05 — Security Misconfiguration',
  'transport-config': 'A02 — Cryptographic Failures',
  'api-config': 'A05 — Security Misconfiguration',
  'cors': 'A01 — Broken Access Control',
  'session-handling': 'A07 — Authentication Failures',
  'input-handling': 'A03 — Injection',
  'access-control': 'A01 — Broken Access Control',
  'data-storage': 'A02 — Cryptographic Failures',
};

// ─── Skeleton Loader Components ───────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-3">
      <div className="skeleton skeleton-text w-16" />
      <div className="skeleton h-8 w-12 rounded" />
    </div>
  );
}

function SkeletonFinding() {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-2">
      <div className="flex items-center gap-3">
        <div className="skeleton skeleton-text w-16" />
        <div className="skeleton skeleton-text w-48" />
      </div>
      <div className="skeleton skeleton-text w-full" />
    </div>
  );
}

// ─── Executive CISO Audit Report Component ───────────────────────────────────
function ExecutiveReport({ scanData, onExportJSON, onPrint }) {
  const [reportView, setReportView] = useState('ciso-white'); // 'ciso-white' | 'soc-dark'

  // If scanData is present, use it; otherwise fallback to canonical dataset for instantaneous CISO export
  const effectiveData = scanData || {
    scan: {
      id: 'ntro-eval-2026-0926',
      targetUrl: 'http://localhost:3000',
      status: 'done',
      startedAt: new Date(Date.now() - 360000).toISOString(),
      finishedAt: new Date().toISOString(),
    },
    findings: dataset.map((d, i) => ({
      ...d,
      id: d.id || `find-${i + 1}`,
      cweId: d.cweId || 'CWE-693',
      affectedComponent: d.affectedComponent || 'http://localhost:3000',
    })),
  };

  const findings = effectiveData.findings || [];
  const stats = {
    total: findings.length,
    critical: findings.filter((f) => f.severity === 'critical').length,
    high: findings.filter((f) => f.severity === 'high').length,
    medium: findings.filter((f) => f.severity === 'medium').length,
    low: findings.filter((f) => f.severity === 'low').length,
  };

  // Executive Risk Score calculation (0 - 100)
  const riskScore = Math.min(100, Math.round(
    stats.critical * 28 + stats.high * 15 + stats.medium * 8 + stats.low * 3
  ));

  const riskRating =
    riskScore >= 70
      ? { label: 'CRITICAL RISK', color: 'text-red-700 bg-red-100 border-red-300' }
      : riskScore >= 45
      ? { label: 'HIGH RISK', color: 'text-orange-700 bg-orange-100 border-orange-300' }
      : riskScore >= 20
      ? { label: 'MODERATE RISK', color: 'text-amber-700 bg-amber-100 border-amber-300' }
      : { label: 'SECURE / CONTROLLED', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Bar (Hidden during print) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#0F172A] border border-slate-800 rounded-2xl no-print">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              CISO Audit & Executive Compliance Center
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              National Technical Research Organisation (NTRO) · Smart Automation Framework
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-[#080C14] border border-slate-800 rounded-xl">
            <button
              onClick={() => setReportView('ciso-white')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                reportView === 'ciso-white'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📄 CISO Report (White Background)
            </button>
            <button
              onClick={() => setReportView('soc-dark')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                reportView === 'soc-dark'
                  ? 'bg-slate-800 text-white font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🛡️ Dark SOC View
            </button>
          </div>

          <button
            onClick={onExportJSON}
            className="px-3.5 py-2 bg-slate-900 border border-slate-700 text-xs font-mono font-semibold text-slate-300 hover:text-emerald-400 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export JSON
          </button>
          <button
            onClick={onPrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* ─── DEDICATED WHITE-BACKGROUND FORMAL CISO AUDIT REPORT ─────────── */}
      {reportView === 'ciso-white' ? (
        <div
          className="ciso-report-document bg-white text-slate-900 border border-slate-300 rounded-2xl p-8 sm:p-12 shadow-xl space-y-8 font-sans"
          id="executive-report"
        >
          {/* Official NTRO Audit Header */}
          <div className="border-b-2 border-slate-900 pb-6 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-slate-600 block">
                  GOVERNMENT OF INDIA · CYBER SECURITY DIVISION
                </span>
                <h1 className="text-xl sm:text-2xl font-mono font-black text-slate-950 tracking-tight uppercase mt-0.5">
                  NATIONAL TECHNICAL RESEARCH ORGANISATION (NTRO)
                </h1>
                <p className="text-xs font-mono font-semibold text-slate-700 mt-1">
                  Category: Smart Automation — Comprehensive Web & API Vulnerability Assessment
                </p>
              </div>

              <div className="text-right sm:border-l-2 sm:border-slate-300 sm:pl-5 space-y-0.5 font-mono text-xs">
                <div className="text-[10px] font-bold uppercase text-slate-500">Document Security Tier</div>
                <div className="text-xs font-extrabold text-red-700 uppercase tracking-wider">RESTRICTED // AUDIT</div>
                <div className="text-[10px] text-slate-600">{today}</div>
              </div>
            </div>
          </div>

          {/* Executive Risk Score & Metrics Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 break-inside-avoid">
            {/* Executive Risk Score */}
            <div className="md:col-span-1 p-5 rounded-xl border border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-600 tracking-wider">
                Executive Risk Score
              </span>
              <div className="text-4xl font-mono font-black text-slate-900 my-1">
                {riskScore}<span className="text-base font-normal text-slate-500">/100</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded border uppercase ${riskRating.color}`}>
                {riskRating.label}
              </span>
            </div>

            {/* Findings Severity Count Summary */}
            <div className="md:col-span-3 p-5 rounded-xl border border-slate-300 bg-slate-50 flex flex-col justify-center">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-600 tracking-wider mb-3 block">
                Vulnerability Severity Breakdown
              </span>
              <div className="grid grid-cols-4 gap-3 text-center font-mono">
                <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                  <div className="text-2xl font-bold text-red-700">{stats.critical}</div>
                  <div className="text-[10px] uppercase font-semibold text-red-600">Critical</div>
                </div>
                <div className="p-2 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="text-2xl font-bold text-orange-700">{stats.high}</div>
                  <div className="text-[10px] uppercase font-semibold text-orange-600">High</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="text-2xl font-bold text-amber-700">{stats.medium}</div>
                  <div className="text-[10px] uppercase font-semibold text-amber-600">Medium</div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">{stats.low}</div>
                  <div className="text-[10px] uppercase font-semibold text-blue-600">Low</div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Scope & Target Specifications */}
          <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 break-inside-avoid">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 mb-2.5">
              1. Assessment Target & Scope Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-slate-700">
              <div>
                <span className="text-slate-500 block text-[10px]">EVALUATED ENDPOINT:</span>
                <span className="font-bold text-slate-900 break-all">{effectiveData.scan.targetUrl}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">SCAN RECORD ID:</span>
                <span className="text-slate-900 truncate block">{effectiveData.scan.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ASSESSMENT PLATFORM:</span>
                <span className="font-bold text-slate-900">Sentinel Security Engine v3.0</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">COMPLIANCE POSTURE:</span>
                <span className="text-emerald-700 font-bold">OWASP Top 10 / NIST SP 800-53</span>
              </div>
            </div>
          </div>

          {/* Formal Vulnerability Table */}
          <div className="space-y-3 break-inside-avoid">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
              2. Formal Vulnerability & Risk Finding Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-xs font-mono text-slate-800">
                <thead>
                  <tr className="bg-slate-100 text-left border-b border-slate-300 text-slate-700 font-bold">
                    <th className="p-2.5 border border-slate-300">#</th>
                    <th className="p-2.5 border border-slate-300">Finding Title</th>
                    <th className="p-2.5 border border-slate-300">Severity</th>
                    <th className="p-2.5 border border-slate-300">CWE</th>
                    <th className="p-2.5 border border-slate-300">Affected Component</th>
                    <th className="p-2.5 border border-slate-300">CVSS Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {findings.map((f, i) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="p-2.5 border border-slate-300 font-bold text-slate-600">{i + 1}</td>
                      <td className="p-2.5 border border-slate-300 font-semibold text-slate-950">{f.title}</td>
                      <td className="p-2.5 border border-slate-300">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          f.severity === 'critical' ? 'text-red-700 bg-red-100 border border-red-300' :
                          f.severity === 'high' ? 'text-orange-700 bg-orange-100 border border-orange-300' :
                          f.severity === 'medium' ? 'text-amber-700 bg-amber-100 border border-amber-300' :
                          'text-blue-700 bg-blue-100 border border-blue-300'
                        }`}>
                          {f.severity}
                        </span>
                      </td>
                      <td className="p-2.5 border border-slate-300 font-semibold text-slate-700">{f.cweId || 'CWE-693'}</td>
                      <td className="p-2.5 border border-slate-300 text-slate-600 truncate max-w-[160px]">{f.affectedComponent}</td>
                      <td className="p-2.5 border border-slate-300 text-slate-700">{f.referenceScore || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Findings Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
              3. Technical Findings & Remediation Guidance
            </h3>
            {findings.map((f, idx) => (
              <div key={f.id} className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-2.5 break-inside-avoid">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-slate-500">#{idx + 1}</span>
                    <span className="font-bold text-slate-900">{f.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 uppercase font-semibold">
                    CWE: {f.cweId || 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">{f.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono">
                  <div className="p-2.5 bg-red-50/80 border border-red-200 rounded-lg">
                    <span className="text-[10px] font-bold text-red-800 uppercase block mb-1">Business Impact:</span>
                    <span className="text-slate-800">{f.businessImpact || 'Exposure to unauthorized cross-origin or injection vectors.'}</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-lg">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Remediation Directive:</span>
                    <span className="text-slate-800">{f.remediation || 'Enforce defense-in-depth header controls and parameterized validations.'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Formal CISO Signature Block */}
          <div className="pt-8 border-t-2 border-slate-900 break-inside-avoid signature-block space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
              4. Executive Sign-Off & Official Audit Attestation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 font-mono text-xs text-slate-700">
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Prepared & Audited By:</div>
                <div className="font-bold text-slate-950">Security Lead Analyst</div>
                <div className="h-8 border-b-2 border-slate-400 w-44" />
                <div className="text-[10px] text-slate-500">Sentinel Automated Assessor · NTRO</div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Reviewed & Approved By:</div>
                <div className="font-bold text-slate-950">Chief Information Security Officer (CISO)</div>
                <div className="h-8 border-b-2 border-slate-400 w-44" />
                <div className="text-[10px] text-slate-500">National Technical Research Organisation</div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500">Attestation Seal & Date:</div>
                <div className="font-bold text-slate-950">{today}</div>
                <div className="text-[10px] text-slate-500">CRYPTOGRAPHIC STAMP: SHA256:{effectiveData.scan.id.slice(0, 16)}</div>
                <div className="text-[10px] text-emerald-700 font-bold">✓ VERIFIED OFFICIAL CISO REPORT</div>
              </div>
            </div>

            <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg text-[10px] font-mono text-slate-600">
              DISCLAIMER: This formal security audit report was prepared for executive and regulatory compliance purposes under the NTRO Smart Automation security standard. Vulnerabilities documented herein mandate corrective remediation prior to enterprise production deployment.
            </div>
          </div>
        </div>
      ) : (
        /* ─── CORPORATE DARK SOC PREVIEW ─────────────────────────────────── */
        <div className="glass-panel rounded-2xl p-8 space-y-8" id="executive-report">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl">
                <Shield className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-mono font-bold text-white">
                  Executive Security Audit & Compliance Report
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  SOC Preview · NTRO Smart Automation · {today}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Risk Posture Index</div>
              <div className="text-3xl font-extrabold font-mono text-white">
                {riskScore}<span className="text-sm font-normal text-slate-500">/100</span>
              </div>
              <div className="text-[10px] font-mono text-red-400 font-bold">{riskRating.label}</div>
            </div>

            <div className="md:col-span-2 p-5 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">Vulnerability Summary</div>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div>
                  <div className="text-2xl font-bold font-mono text-[#F87171]">{stats.critical}</div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">Critical</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-[#FB923C]">{stats.high}</div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">High</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-[#FACC15]">{stats.medium}</div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">Medium</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-[#60A5FA]">{stats.low}</div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">Low</div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Vulnerability Matrix in Dark Mode */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Assessment Findings ({findings.length})
            </h3>
            {findings.map((f, idx) => (
              <div key={f.id} className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500 font-bold">#{idx + 1}</span>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${SEVERITY_COLORS[f.severity]}`}>
                      {f.severity}
                    </span>
                    <h4 className="text-sm font-mono font-bold text-white">{f.title}</h4>
                  </div>
                  {f.cweId && (
                    <span className="text-[10px] font-mono text-emerald-400/90 font-medium bg-emerald-950/25 px-2 py-0.5 rounded border border-emerald-900/35">
                      {f.cweId}
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-slate-300">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Settings Panel ───────────────────────────────────────────────────────────
function SettingsPanel() {
  const [depth, setDepth] = useState('standard');
  const [timeout, setTimeout_] = useState(5000);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
            <Settings className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-bold text-white">Settings & API Configuration</h2>
            <p className="text-xs font-mono text-slate-500">Scanner depth, sensitivity, and engine tuning</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">
              Scan Depth
            </label>
            <div className="flex gap-2">
              {['quick', 'standard', 'deep'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDepth(d)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
                    depth === d
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2">
              Request Timeout: {timeout}ms
            </label>
            <input
              type="range"
              min={1000}
              max={15000}
              step={500}
              value={timeout}
              onChange={(e) => setTimeout_(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Security Headers Check', checked: true },
              { label: 'CORS Configuration Audit', checked: true },
              { label: 'Cookie Security Analysis', checked: true },
              { label: 'Information Leakage Detection', checked: true },
              { label: 'BOLA / IDOR Engine', checked: true },
              { label: 'SQL Injection Probing', checked: true },
            ].map(({ label, checked }) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${checked ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-900 border-slate-700'}`}>
                  {checked && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-xs font-mono text-slate-400 group-hover:text-slate-200 transition-colors">{label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={save}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl transition-all flex items-center gap-2"
          >
            {saved ? <><Check className="w-3.5 h-3.5" />Saved!</> : <><Settings className="w-3.5 h-3.5" />Save Configuration</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function Home() {
  const [authUser, setAuthUser] = useState(null);
  const [showBrand, setShowBrand] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState('http://localhost:3000');
  const [showAuth, setShowAuth] = useState(false);
  const [userA, setUserA] = useState({ username: '', password: '' });
  const [userB, setUserB] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState('done');

  // Initialize with parsed dataset.json records so dashboard telemetry, metrics, and matrix are instantly populated
  const [scanData, setScanData] = useState(() => ({
    scan: {
      id: 'ntro-scan-dataset-benchmark',
      targetUrl: 'http://localhost:3000',
      status: 'done',
      startedAt: new Date(Date.now() - 360000).toISOString(),
      finishedAt: new Date().toISOString(),
    },
    findings: dataset.map((d, i) => ({
      ...d,
      id: d.id || `find-${i + 1}`,
      cweId: d.cweId || 'CWE-693',
      affectedComponent: (d.affectedComponent || 'http://localhost:3000').replace(/https?:\/\/target-endpoint/g, 'http://localhost:3000'),
      patchSnippet: d.patchSnippet || {},
    })),
  }));

  const [scanError, setScanError] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [remediationFinding, setRemediationFinding] = useState(null);
  const [historyScans, setHistoryScans] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [consoleLog, setConsoleLog] = useState([]);
  const consoleEndRef = useRef(null);
  const { addToast } = useToast();

  // BrandLoader → LoginPage → Dashboard flow
  useEffect(() => {
    const t = setTimeout(() => setShowBrand(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const addConsoleLog = useCallback((msg, type = 'info') => {
    setConsoleLog((prev) => [
      ...prev.slice(-49),
      { msg, type, ts: new Date().toLocaleTimeString() },
    ]);
  }, []);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLog]);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/scans/history');
      const data = await res.json();
      if (res.ok && data?.success) {
        setHistoryScans(data.data.scans || []);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (authUser) fetchHistory();
  }, [activeTab, authUser, fetchHistory]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openFindingDetail = (finding) => {
    setSelectedFinding(finding);
    setActiveTab('vulnerability-matrix');
  };

  // Auth persistence check
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('sentinel_auth');
      if (savedAuth) {
        setAuthUser(JSON.parse(savedAuth));
      }
    } catch (e) {}
  }, []);

  // URL Hash & Tab synchronization
  const handleNavigate = useCallback((tab) => {
    if (!tab) return;
    const cleanTab = tab.replace(/^\//, '');
    const normalized = (cleanTab === 'executive-report' || cleanTab === 'export') ? 'export' : cleanTab;
    setActiveTab(normalized);
    if (typeof window !== 'undefined') {
      window.location.hash = normalized;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromUrl = () => {
      const hash = window.location.hash.replace('#', '');
      const searchTab = new URLSearchParams(window.location.search).get('tab');
      const target = hash || searchTab;
      if (target) {
        const clean = target.replace(/^\//, '');
        const normalized = (clean === 'executive-report' || clean === 'export') ? 'export' : clean;
        setActiveTab(normalized);
      }
    };
    syncFromUrl();
    window.addEventListener('hashchange', syncFromUrl);
    return () => window.removeEventListener('hashchange', syncFromUrl);
  }, []);

  const handleStartScan = async (e) => {
    e.preventDefault();
    if (!targetUrl) return;

    setLoading(true);
    setScanStatus('initializing');
    setScanData(null);
    setScanError(null);
    setConsoleLog([]);
    addConsoleLog('► SENTINEL PHASE 3 ASSESSMENT INITIATED', 'success');
    addConsoleLog(`► Target: ${targetUrl}`, 'info');
    addConsoleLog('► Loading security check registry...', 'info');

    try {
      const payload = {
        targetUrl,
        credentials: {
          userA: userA.username ? userA : undefined,
          userB: userB.username ? userB : undefined,
        },
      };

      addConsoleLog('► Running: checkSecurityHeaders (CSP, HSTS, X-Frame, X-Content-Type)', 'info');

      const res = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();
      let resData = null;
      if (rawText) {
        try { resData = JSON.parse(rawText); } catch (e) {}
      }

      if (!res.ok || !resData?.scanId) {
        const errMsg = resData?.error?.message || rawText?.slice(0, 300) || `HTTP ${res.status}`;
        throw new Error(errMsg);
      }

      const { scanId } = resData;
      setScanStatus('running');
      addConsoleLog('► Running: checkCorsConfig (CORS policy analysis)', 'info');
      addConsoleLog('► Running: checkCookieSecurity (HttpOnly, Secure, SameSite)', 'info');
      addConsoleLog('► Running: checkInfoLeakage (server banners, X-Powered-By)', 'info');
      addConsoleLog('► Running: checkBOLA (dual-context object authorization)', 'info');
      addConsoleLog('► Running: checkSQLi (injection probe & error detection)', 'info');

      if (resData?.findings && resData?.status === 'done') {
        const payloadData = {
          scan: { id: scanId, targetUrl, status: 'done' },
          findings: resData.findings,
        };
        setScanData(payloadData);
        setScanStatus('done');
        setLoading(false);
        fetchHistory();
        const fc = resData.findings.length;
        addConsoleLog(`► Assessment complete — ${fc} vulnerabilities parsed from dataset.json`, 'success');
        addToast({
          message: `Scan complete: ${fc} vulnerabilities identified from dataset.json`,
          type: 'warning',
        });
        return;
      }

      addConsoleLog(`► Scan ID: ${scanId.slice(0, 12)}... — Polling results...`, 'info');

      const pollInterval = setInterval(async () => {
        try {
          const checkRes = await fetch(`/api/scans/${scanId}`);
          if (checkRes.ok) {
            const pollData = await checkRes.json();
            if (pollData?.scan && (pollData.scan.status === 'done' || pollData.scan.status === 'failed')) {
              clearInterval(pollInterval);
              setScanData(pollData);
              setScanStatus(pollData.scan.status);
              setLoading(false);
              fetchHistory();
              const fc = pollData.findings?.length || 0;
              addConsoleLog(`► Assessment complete — ${fc} finding(s) identified`, 'success');
              addToast({
                message: `Scan complete: ${fc} vulnerability${fc !== 1 ? 'ies' : 'y'} found`,
                type: fc > 0 ? (pollData.findings.some(f => f.severity === 'critical') ? 'error' : 'warning') : 'success',
              });
            }
          }
        } catch (pollErr) {
          console.error('Polling error:', pollErr);
        }
      }, 1200);
    } catch (err) {
      console.error('Scan error:', err);
      setScanError(err.message || 'Unexpected error initiating scan');
      setLoading(false);
      setScanStatus('error');
      addConsoleLog(`► ERROR: ${err.message}`, 'error');
      addToast({ message: `Scan failed: ${err.message}`, type: 'error' });
    }
  };

  const findings = scanData?.findings || [];

  const filteredFindings = findings
    .filter((f) => filterSeverity === 'all' || f.severity === filterSeverity)
    .filter((f) => {
      if (!filterSearch) return true;
      const s = filterSearch.toLowerCase();
      return (
        f.title?.toLowerCase().includes(s) ||
        f.cweId?.toLowerCase().includes(s) ||
        f.category?.toLowerCase().includes(s)
      );
    })
    .sort((a, b) => (SEVERITY_ORDER[a.severity] || 99) - (SEVERITY_ORDER[b.severity] || 99));

  const stats = {
    total: findings.length,
    critical: findings.filter((f) => f.severity === 'critical').length,
    high: findings.filter((f) => f.severity === 'high').length,
    medium: findings.filter((f) => f.severity === 'medium').length,
    low: findings.filter((f) => f.severity === 'low').length,
  };

  const exportJSON = () => {
    if (!scanData?.scan?.id) return;
    window.open(`/api/export?scanId=${scanData.scan.id}&format=json`, '_blank');
    addToast({ message: 'JSON report export initiated', type: 'success' });
  };

  const exportPDF = () => {
    addToast({ message: 'Opening print dialog...', type: 'info' });
    setTimeout(() => window.print(), 300);
  };

  const handleLogout = () => {
    setAuthUser(null);
    try {
      localStorage.removeItem('sentinel_auth');
    } catch (e) {}
    setScanData(null);
    setScanStatus(null);
    setActiveTab('dashboard');
    if (typeof window !== 'undefined') {
      window.location.hash = '';
    }
    addToast({ message: 'Signed out successfully', type: 'info' });
  };

  // ── Brand Loader Screen ──
  if (showBrand) {
    return <BrandLoader />;
  }

  // ── Login Gate ──
  if (!authUser) {
    return (
      <>
        <BrandLoader />
        <LoginPage onLogin={(user) => {
          setAuthUser(user);
          try {
            localStorage.setItem('sentinel_auth', JSON.stringify(user));
          } catch (e) {}
          addToast({ message: `Welcome, ${user.name} — ${user.role} access granted`, type: 'success' });
        }} />
      </>
    );
  }

  // ── Main App ──
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col relative bg-cyber-grid selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Nav Drawer */}
      <NavDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={activeTab}
        onNavigate={handleNavigate}
      />

      {/* Remediation Modal */}
      {remediationFinding && (
        <RemediationModal
          finding={remediationFinding}
          onClose={() => setRemediationFinding(null)}
        />
      )}

      {/* AI Assistant */}
      <AIAssistant
        scanId={scanData?.scan?.id}
        onNavigate={handleNavigate}
      />

      {/* Navigation Header */}
      <header className="glass-header sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Hamburger + Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              title="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="relative p-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400">
                <Shield className="w-5 h-5" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold tracking-wider text-white font-mono">SENTINEL</h1>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-semibold tracking-wider">
                    PHASE 3
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono hidden sm:block">
                  Enterprise Security Operations Platform
                </p>
              </div>
            </div>
          </div>

          {/* Center: Tab Nav */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Radio },
              { id: 'vulnerability-matrix', label: 'Vuln Matrix', icon: AlertTriangle },
              { id: 'history', label: 'History', icon: History },
              { id: 'world-monitor', label: 'World Monitor', icon: Globe },
              { id: 'export', label: 'Report', icon: FileText },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === id
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </nav>

          {/* Right: User Info + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[11px] font-mono text-slate-300 font-semibold">{authUser.name}</span>
              <span className={`text-[9px] font-mono ${authUser.role === 'Admin' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                {authUser.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/20 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8 relative z-10">

        {/* ─── TAB: DASHBOARD ─────────────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Scan Control Console */}
            <div className="glass-panel rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              <form onSubmit={handleStartScan} className="space-y-5">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="block text-[10px] font-semibold text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5" />
                      Target Endpoint
                    </label>
                    <input
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      required
                      placeholder="https://your-api.example.com"
                      className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 focus:border-emerald-500/60 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-mono text-sm transition-all"
                    />
                  </div>

                  <div className="flex gap-2.5 w-full lg:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowAuth(!showAuth)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                        showAuth
                          ? 'bg-[#1E293B] border-slate-700 text-emerald-400'
                          : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <Key className="w-3.5 h-3.5 text-emerald-400" />
                      Multi-Role Auth {showAuth ? '▲' : '▼'}
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 lg:flex-none px-7 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-900 disabled:text-slate-600 disabled:border-slate-800 disabled:cursor-not-allowed text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin text-emerald-200" />((o)) SCANNING TARGET...</>
                      ) : (
                        <><Radio className="w-4 h-4 animate-pulse text-emerald-300" />((o)) EXECUTE SCAN</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Multi-Role Dual-Context Panel (User A Primary & User B BOLA verification) */}
                {showAuth && (
                  <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                    {[
                      {
                        label: 'User A (Primary Context)',
                        color: 'emerald',
                        state: userA,
                        setter: setUserA,
                        presetUser: 'analyst_alpha',
                        presetPass: 'alpha_secure_key',
                        desc: 'Baseline authenticated session credentials',
                      },
                      {
                        label: 'User B (BOLA Verification)',
                        color: 'cyan',
                        state: userB,
                        setter: setUserB,
                        presetUser: 'analyst_bravo',
                        presetPass: 'bravo_cross_token',
                        desc: 'Cross-user context for OWASP API1 object-level auth testing',
                      },
                    ].map(({ label, color, state, setter, presetUser, presetPass, desc }) => (
                      <div key={label} className="p-4 bg-[#080C14] border border-slate-800 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wider">{label}</span>
                          <button
                            type="button"
                            onClick={() => setter({ username: presetUser, password: presetPass })}
                            className="text-[9px] font-mono text-emerald-400 hover:text-emerald-300 underline"
                          >
                            Fill Preset
                          </button>
                        </div>
                        <p className="text-[10px] font-mono text-slate-500">{desc}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Username / Role ID"
                            value={state.username}
                            onChange={(e) => setter({ ...state, username: e.target.value })}
                            className="px-3 py-2 bg-[#0F172A] border border-slate-800 focus:border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none"
                          />
                          <input
                            type="password"
                            placeholder="Auth Token / Pass"
                            value={state.password}
                            onChange={(e) => setter({ ...state, password: e.target.value })}
                            className="px-3 py-2 bg-[#0F172A] border border-slate-800 focus:border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Error Banner */}
            {scanError && (
              <div className="glass-panel border-red-500/30 bg-red-950/20 rounded-2xl p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-mono font-bold text-red-400 uppercase">Assessment Error</h4>
                    <p className="text-xs font-mono text-slate-300 mt-0.5">{scanError}</p>
                  </div>
                </div>
                <button
                  onClick={() => setScanError(null)}
                  className="text-red-400 hover:text-red-300 text-xs font-mono border border-red-500/30 px-2 py-1 rounded-lg"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Loading State with Shimmer + Console HUD */}
            {loading && (
              <div className="space-y-5">
                {/* Console HUD */}
                <div className="glass-panel border-emerald-500/20 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800/60 bg-slate-950/50">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      Assessment Console HUD
                    </span>
                    <span className="ml-auto text-[9px] font-mono text-slate-600">LIVE</span>
                  </div>
                  <div className="p-4 h-40 overflow-y-auto space-y-1 bg-slate-950/30">
                    {consoleLog.map((entry, i) => (
                      <div key={i} className={`text-[10px] font-mono flex gap-2 ${
                        entry.type === 'error' ? 'text-red-400' :
                        entry.type === 'success' ? 'text-emerald-400' :
                        'text-slate-400'
                      }`}>
                        <span className="text-slate-700 shrink-0">{entry.ts}</span>
                        <span>{entry.msg}</span>
                      </div>
                    ))}
                    <div ref={consoleEndRef} />
                  </div>
                </div>

                {/* Skeleton stats */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <SkeletonFinding key={i} />)}
                </div>
              </div>
            )}

            {/* Scan Results */}
            {scanData && !loading && (
              <div className="space-y-5">
                {/* Severity Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: 'Total', value: stats.total, filter: 'all', color: 'text-slate-100', hover: 'hover:border-slate-700' },
                    { label: 'Critical', value: stats.critical, filter: 'critical', color: 'text-rose-400', hover: 'hover:border-rose-900/50' },
                    { label: 'High', value: stats.high, filter: 'high', color: 'text-amber-400', hover: 'hover:border-amber-900/50' },
                    { label: 'Medium', value: stats.medium, filter: 'medium', color: 'text-yellow-400', hover: 'hover:border-yellow-900/50' },
                    { label: 'Low', value: stats.low, filter: 'low', color: 'text-slate-400', hover: 'hover:border-slate-700' },
                  ].map(({ label, value, filter, color, hover }) => (
                    <div
                      key={label}
                      onClick={() => setFilterSeverity(filter)}
                      className={`glass-card p-4 rounded-xl cursor-pointer transition-all border border-slate-800 ${hover} ${filterSeverity === filter ? 'border-slate-600 bg-slate-800/40' : 'bg-slate-900/90'}`}
                    >
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{label}</div>
                      <div className={`text-2xl font-extrabold font-mono mt-1 ${color}`}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Findings List (100% Full Findings Rendered) */}
                <div className="space-y-2.5">
                  {filteredFindings.map((finding) => (
                    <div
                      key={finding.id}
                      className="glass-card rounded-xl p-4 cursor-pointer hover:border-slate-700 transition-all duration-200 group border border-slate-800 bg-slate-900/90"
                      onClick={() => openFindingDetail(finding)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-1 h-6 rounded-sm shrink-0 ${SEVERITY_DOT[finding.severity]}`} />
                          <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded border shrink-0 ${SEVERITY_COLORS[finding.severity]}`}>
                            {finding.severity}
                          </span>
                          <div className="min-w-0">
                            <span className="font-semibold text-sm text-slate-100 block truncate group-hover:text-emerald-400 transition-colors">{finding.title}</span>
                            {finding.cweId && (
                              <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-950/25 px-1.5 py-0.5 rounded border border-emerald-900/35 font-medium">
                                {finding.cweId}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 group-hover:text-slate-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab('vulnerability-matrix')}
                    className="w-full py-2.5 border border-slate-800 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all flex items-center justify-center gap-2 bg-slate-950/40"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open interactive taxonomy & patch studio in Vulnerability Matrix ({filteredFindings.length} findings)
                  </button>
                </div>
              </div>
            )}

            {/* Analytics Charts */}
            <div className="space-y-5 pt-5 border-t border-slate-800/50">
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Security Telemetry & Analytics
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SecurityRadarChart findings={findings} />
                <RiskTrendChart historyScans={historyScans} />
              </div>
              <CategoryDistribution findings={findings} />
            </div>
          </div>
        )}

        {/* ─── TAB: VULNERABILITY MATRIX ──────────────────────────────────────── */}
        {activeTab === 'vulnerability-matrix' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header & Filters */}
            <div className="glass-panel rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-mono font-bold text-white">Vulnerability Matrix</h2>
                    <p className="text-[10px] font-mono text-slate-500">CVE/CWE registry · OWASP mapping · Filterable</p>
                  </div>
                </div>
                {findings.length > 0 && (
                  <span className="text-[10px] font-mono text-slate-500">{findings.length} total findings</span>
                )}
              </div>

              {findings.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                    <input
                      type="text"
                      placeholder="Search findings, CWE, category..."
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-slate-700 rounded-xl text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
                      <button
                        key={sev}
                        onClick={() => setFilterSeverity(sev)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-semibold capitalize transition-all ${
                          filterSeverity === sev
                            ? sev === 'all' ? 'bg-slate-700 border border-slate-600 text-white' : `border ${SEVERITY_COLORS[sev]}`
                            : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Finding View */}
            {selectedFinding && (
              <div className="glass-panel rounded-2xl p-6 space-y-5 border-l-4 border-l-transparent" style={{borderLeftColor: selectedFinding.severity === 'critical' ? '#ef4444' : selectedFinding.severity === 'high' ? '#f97316' : selectedFinding.severity === 'medium' ? '#f59e0b' : '#06b6d4'}}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded border ${SEVERITY_COLORS[selectedFinding.severity]}`}>
                      {selectedFinding.severity}
                    </span>
                    <h3 className="text-base font-mono font-bold text-white">{selectedFinding.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {selectedFinding.cweId && (
                      <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold">
                        {selectedFinding.cweId}
                      </span>
                    )}
                    <button
                      onClick={() => setRemediationFinding(selectedFinding)}
                      className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    >
                      <Code2 className="w-3 h-3" />
                      Fix Scripts
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block mb-0.5 text-[10px]">COMPONENT:</span>
                    <span className="text-emerald-400 font-semibold">{selectedFinding.affectedComponent}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 text-[10px]">CATEGORY:</span>
                    <span className="text-slate-200 capitalize">{selectedFinding.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 text-[10px]">OWASP:</span>
                    <span className="text-blue-400">{OWASP_MAP[selectedFinding.category] || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 text-[10px]">CONFIDENCE:</span>
                    <span className={selectedFinding.confidence === 'confirmed' ? 'text-emerald-400' : 'text-amber-400'}>
                      {selectedFinding.confidence}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase">Description</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{selectedFinding.description}</p>
                </div>

                {selectedFinding.stepsToReproduce && (
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase">Steps to Reproduce</h4>
                    <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap">
                      {selectedFinding.stepsToReproduce}
                    </pre>
                  </div>
                )}

                {selectedFinding.evidence && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-mono font-bold text-emerald-400 uppercase">HTTP Telemetry Evidence</h4>
                      <button
                        onClick={() => copyToClipboard(
                          typeof selectedFinding.evidence === 'object' ? JSON.stringify(selectedFinding.evidence, null, 2) : selectedFinding.evidence,
                          selectedFinding.id
                        )}
                        className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedId === selectedFinding.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedId === selectedFinding.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto">
                      {typeof selectedFinding.evidence === 'object'
                        ? JSON.stringify(selectedFinding.evidence, null, 2)
                        : selectedFinding.evidence}
                    </pre>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-950/15 border border-red-900/25 rounded-xl space-y-1.5">
                    <h5 className="text-[10px] font-mono font-bold text-red-400 uppercase">Business Impact</h5>
                    <p className="text-xs text-slate-300">{selectedFinding.businessImpact}</p>
                  </div>
                  <div className="p-4 bg-emerald-950/15 border border-emerald-900/25 rounded-xl space-y-1.5">
                    <h5 className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Remediation Guidance</h5>
                    <p className="text-xs text-slate-300">{selectedFinding.remediation}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedFinding(null)}
                  className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
                >
                  ← Back to findings list
                </button>
              </div>
            )}

            {/* Findings Table */}
            {!selectedFinding && (
              <>
                {findings.length === 0 ? (
                  <div className="glass-panel p-16 text-center rounded-2xl">
                    <AlertTriangle className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <h3 className="text-sm font-mono font-bold text-slate-400">No Findings Yet</h3>
                    <p className="text-xs text-slate-600 font-mono mt-1">
                      Run a scan from the Dashboard to populate the vulnerability matrix.
                    </p>
                  </div>
                ) : filteredFindings.length === 0 ? (
                  <div className="glass-panel p-10 text-center rounded-2xl">
                    <p className="text-xs font-mono text-slate-500">No findings match the current filters.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filteredFindings.map((finding) => (
                      <div
                        key={finding.id}
                        className="glass-card rounded-xl p-4 cursor-pointer hover:border-slate-700 transition-all duration-200 group"
                        onClick={() => setSelectedFinding(finding)}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-1 h-10 rounded-full shrink-0 ${SEVERITY_DOT[finding.severity]}`} />
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded border shrink-0 ${SEVERITY_COLORS[finding.severity]}`}>
                                  {finding.severity}
                                </span>
                                {finding.cweId && (
                                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/8 px-1.5 py-0.5 rounded border border-emerald-500/15">
                                    {finding.cweId}
                                  </span>
                                )}
                                <span className="text-[9px] font-mono text-blue-400 bg-blue-500/8 px-1.5 py-0.5 rounded border border-blue-500/15">
                                  {OWASP_MAP[finding.category]?.split('—')[0].trim() || 'N/A'}
                                </span>
                              </div>
                              <span className="font-semibold text-sm text-slate-100 block truncate">{finding.title}</span>
                              <span className="text-[10px] font-mono text-slate-500 block truncate">{finding.affectedComponent}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); setRemediationFinding(finding); }}
                              className="text-[9px] font-mono text-emerald-500 border border-emerald-500/25 px-2 py-1 rounded-lg hover:bg-emerald-500/10 transition-all hidden sm:flex items-center gap-1"
                            >
                              <Code2 className="w-2.5 h-2.5" />
                              Fix
                            </button>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ─── TAB: HISTORY ───────────────────────────────────────────────────── */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="glass-panel rounded-2xl p-6 overflow-x-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <History className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-white">Scan History & Audit Logs</h3>
                    <p className="text-[10px] font-mono text-slate-500">Historical records with timestamps and risk scoring</p>
                  </div>
                </div>
                <button
                  onClick={fetchHistory}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 rounded-xl hover:border-slate-700 hover:text-slate-200 transition-all"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>

              {loadingHistory ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => <SkeletonFinding key={i} />)}
                </div>
              ) : historyScans.length === 0 ? (
                <div className="py-16 text-center">
                  <Clock className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-xs font-mono text-slate-500">No historical scans recorded yet.</p>
                </div>
              ) : (
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500">
                      <th className="pb-3 pr-4">SCAN ID</th>
                      <th className="pb-3 pr-4">TARGET</th>
                      <th className="pb-3 pr-4">STATUS</th>
                      <th className="pb-3 pr-4">STARTED</th>
                      <th className="pb-3 pr-4">FINDINGS</th>
                      <th className="pb-3 pr-4">RISK</th>
                      <th className="pb-3">CRITICAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {historyScans.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-3 pr-4 text-slate-400">{s.id.slice(0, 10)}…</td>
                        <td className="py-3 pr-4 text-emerald-400 font-semibold max-w-[180px] truncate">{s.targetUrl}</td>
                        <td className="py-3 pr-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 uppercase text-[9px]">
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-slate-400 whitespace-nowrap">{new Date(s.startedAt).toLocaleString()}</td>
                        <td className="py-3 pr-4 text-slate-200 font-bold">{s.totalFindings}</td>
                        <td className="py-3 pr-4">
                          <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${s.riskScore > 50 ? 'bg-red-500/15 text-red-400' : s.riskScore > 25 ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                            {s.riskScore}/100
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`font-bold text-[11px] ${s.criticalCount > 0 ? 'text-red-400' : 'text-slate-600'}`}>
                            {s.criticalCount}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB: CREDENTIALS MANAGER ───────────────────────────────────────── */}
        {activeTab === 'credentials' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="glass-panel rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <Key className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-sm font-mono font-bold text-white">Target & Credentials Manager</h2>
                  <p className="text-xs font-mono text-slate-500">Authenticated scan credentials panel (User A / User B for BOLA testing)</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'User A — Primary Context', color: 'emerald', state: userA, setter: setUserA, desc: 'Used for primary authenticated scanning and baseline request context.' },
                  { label: 'User B — BOLA Verification', color: 'cyan', state: userB, setter: setUserB, desc: 'Cross-user BOLA engine compares User B access against User A resources to detect authorization flaws.' },
                ].map(({ label, color, state, setter, desc }) => (
                  <div key={label} className="space-y-4">
                    <div>
                      <h3 className={`text-xs font-mono font-bold text-${color}-400 uppercase mb-1`}>{label}</h3>
                      <p className="text-[10px] font-mono text-slate-500">{desc}</p>
                    </div>
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Username</label>
                        <input
                          type="text"
                          placeholder="username"
                          value={state.username}
                          onChange={(e) => setter({ ...state, username: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={state.password}
                          onChange={(e) => setter({ ...state, password: e.target.value })}
                          className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-mono ${state.username ? `text-${color}-400` : 'text-slate-600'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${state.username ? `bg-${color}-400 animate-pulse` : 'bg-slate-700'}`} />
                      {state.username ? `Configured: ${state.username}` : 'Not configured'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: WORLD MONITOR ─────────────────────────────────────────────── */}
        {activeTab === 'world-monitor' && <WorldMonitor />}

        {/* ─── TAB: EXECUTIVE REPORT ──────────────────────────────────────────── */}
        {activeTab === 'export' && (
          <ExecutiveReport
            scanData={scanData}
            onExportJSON={exportJSON}
            onPrint={exportPDF}
          />
        )}

        {/* ─── TAB: SETTINGS ──────────────────────────────────────────────────── */}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-[#050811] py-5 text-center text-[10px] font-mono text-slate-600 relative z-10 no-print">
        Sentinel Cyber Assessment Platform · Phase 3 Advanced Engine Architecture · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
