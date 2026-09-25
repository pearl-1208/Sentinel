'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Loader2, 
  Search, 
  Terminal, 
  Key, 
  User, 
  Layers, 
  Clock,
  Activity,
  Cpu,
  Radio,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import BrandLoader from '../components/BrandLoader';

const SEVERITY_ORDER = {
  critical: 1,
  high: 2,
  medium: 3,
  low: 4,
};

const SEVERITY_COLORS = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.2)]',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.2)]',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
  low: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]',
};

export default function Home() {
  const [targetUrl, setTargetUrl] = useState('http://localhost:3000');
  const [showAuth, setShowAuth] = useState(false);
  const [userA, setUserA] = useState({ username: '', password: '' });
  const [userB, setUserB] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartScan = async (e) => {
    e.preventDefault();
    if (!targetUrl) return;

    setLoading(true);
    setScanStatus('initializing');
    setScanData(null);
    setScanError(null);
    setExpandedRows({});

    try {
      const payload = {
        targetUrl,
        credentials: {
          userA: userA.username ? userA : undefined,
          userB: userB.username ? userB : undefined,
        },
      };

      const res = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Safely extract raw response text first to handle non-JSON / empty response bodies
      const rawText = await res.text();
      let resData = null;
      if (rawText) {
        try {
          resData = JSON.parse(rawText);
        } catch (jsonErr) {
          console.warn('Non-JSON response received:', rawText);
        }
      }

      if (!res.ok) {
        const errorMsg = 
          resData?.error || 
          resData?.details || 
          (rawText ? rawText.slice(0, 300) : `Server returned HTTP status ${res.status}`);
        throw new Error(errorMsg);
      }

      if (!resData || !resData.scanId) {
        throw new Error('Invalid response payload received from assessment engine');
      }

      const { scanId } = resData;
      setScanStatus('running');

      // Poll scan status safely
      const pollInterval = setInterval(async () => {
        try {
          const checkRes = await fetch(`/api/scans/${scanId}`);
          if (checkRes.ok) {
            const checkText = await checkRes.text();
            let pollData = null;
            if (checkText) {
              try {
                pollData = JSON.parse(checkText);
              } catch (parseErr) {
                console.error('Polling JSON parse error:', parseErr);
              }
            }
            if (pollData?.scan && (pollData.scan.status === 'done' || pollData.scan.status === 'failed')) {
              clearInterval(pollInterval);
              setScanData(pollData);
              setScanStatus(pollData.scan.status);
              setLoading(false);
            }
          }
        } catch (pollErr) {
          console.error('Polling error:', pollErr);
        }
      }, 1000);
    } catch (err) {
      console.error('Scan start error:', err);
      setScanError(err.message || 'An unexpected error occurred while initiating the scan');
      setLoading(false);
      setScanStatus('error');
    }
  };

  // Group and sort findings
  const findings = scanData?.findings || [];
  const filteredFindings = findings.filter((f) => {
    if (filterSeverity === 'all') return true;
    return f.severity === filterSeverity;
  });

  const sortedFindings = [...filteredFindings].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] || 99) - (SEVERITY_ORDER[b.severity] || 99)
  );

  const stats = {
    total: findings.length,
    critical: findings.filter((f) => f.severity === 'critical').length,
    high: findings.filter((f) => f.severity === 'high').length,
    medium: findings.filter((f) => f.severity === 'medium').length,
    low: findings.filter((f) => f.severity === 'low').length,
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col relative bg-cyber-grid selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Brand Intro Loader (Black Screen Overlay) */}
      <BrandLoader />

      {/* Header */}
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Shield className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-wider text-white font-mono">
                  SENTINEL
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold tracking-wider">
                  PHASE 1 CORE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono tracking-tight">
                Security Assessment & Compliance Engine
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Scoped: Localhost Engine</span>
            </div>

            <div className="flex items-center space-x-1.5 text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Status: <span className="text-emerald-400 font-bold">ONLINE</span></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8 relative z-10">
        
        {/* Target & Config Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
          {/* Subtle Cyber Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          <form onSubmit={handleStartScan} className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-end">
              <div className="flex-1 w-full space-y-2">
                <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Target URL (Assessment Endpoint)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    required
                    placeholder="http://localhost:3000"
                    className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/80 font-mono text-sm shadow-inner transition-all"
                  />
                  <div className="absolute right-3 top-3 text-xs text-slate-500 font-mono pointer-events-none hidden sm:block">
                    HTTP/HTTPS
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => setShowAuth(!showAuth)}
                  className={`px-5 py-3 rounded-xl border text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    showAuth 
                      ? 'bg-slate-800 border-slate-700 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Key className="w-4 h-4 text-emerald-400" />
                  Credentials {showAuth ? '▲' : '▼'}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 lg:flex-none px-8 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-950/60 disabled:text-slate-600 disabled:border-emerald-900/50 disabled:cursor-not-allowed text-slate-950 font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      Probing Target...
                    </>
                  ) : (
                    <>
                      <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
                      Execute Assessment
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Optional Credentials Panel */}
            {showAuth && (
              <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold font-mono text-emerald-400 uppercase tracking-wider">
                      <User className="w-3.5 h-3.5" />
                      User A Credentials (Primary Scope)
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">ROLE: USER_A</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Username / Identifier"
                      value={userA.username}
                      onChange={(e) => setUserA({ ...userA, username: e.target.value })}
                      className="px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="password"
                      placeholder="Password / Token"
                      value={userA.password}
                      onChange={(e) => setUserA({ ...userA, password: e.target.value })}
                      className="px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold font-mono text-cyan-400 uppercase tracking-wider">
                      <User className="w-3.5 h-3.5" />
                      User B Credentials (BOLA / Scoping)
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">ROLE: USER_B</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Username / Identifier"
                      value={userB.username}
                      onChange={(e) => setUserB({ ...userB, username: e.target.value })}
                      className="px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                    <input
                      type="password"
                      placeholder="Password / Token"
                      value={userB.password}
                      onChange={(e) => setUserB({ ...userB, password: e.target.value })}
                      className="px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Scan Execution Error Banner */}
        {scanError && (
          <div className="glass-panel border-red-500/40 bg-red-950/30 rounded-2xl p-5 shadow-[0_0_35px_rgba(239,68,68,0.25)] flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex-shrink-0 mt-0.5 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                  <span>Assessment Initiation Failed</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">ERROR</span>
                </h4>
                <p className="text-xs font-mono text-slate-200 leading-relaxed font-semibold">
                  {scanError}
                </p>
                <p className="text-[11px] font-mono text-slate-400">
                  Verify target host reachability, backend scanner service status, or check target URL formatting.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setScanError(null)}
              className="px-3.5 py-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 text-xs font-mono font-semibold rounded-xl transition-all flex-shrink-0 shadow-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active Scanning HUD Loader */}
        {loading && (
          <div className="glass-panel border-emerald-500/30 rounded-2xl p-8 text-center space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.15)] animate-in fade-in duration-300">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Shield className="w-8 h-8 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-mono font-bold text-white tracking-wider">
                SECURITY ASSESSMENT IN PROGRESS
              </h3>
              <p className="text-xs font-mono text-emerald-400/90">
                Executing automated check suites against target endpoint...
              </p>
            </div>
            <div className="max-w-md mx-auto h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500 animate-[pulseGlow_1.5s_infinite] w-full" />
            </div>
          </div>
        )}

        {/* Scan Status & Filter Stats Bar */}
        {scanData && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div 
                onClick={() => setFilterSeverity('all')}
                className={`cursor-pointer p-5 rounded-2xl transition-all duration-300 ${
                  filterSeverity === 'all' 
                    ? 'bg-slate-800/90 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)] border' 
                    : 'glass-card border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Total</span>
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-white mt-2">{stats.total}</div>
              </div>

              <div 
                onClick={() => setFilterSeverity('critical')}
                className={`cursor-pointer p-5 rounded-2xl transition-all duration-300 ${
                  filterSeverity === 'critical' 
                    ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] border' 
                    : 'glass-card border-slate-800 hover:border-red-900/50 hover:bg-slate-900/60'
                }`}
              >
                <div className="text-[11px] font-mono text-red-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Critical</span>
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-red-400 mt-2">{stats.critical}</div>
              </div>

              <div 
                onClick={() => setFilterSeverity('high')}
                className={`cursor-pointer p-5 rounded-2xl transition-all duration-300 ${
                  filterSeverity === 'high' 
                    ? 'bg-orange-950/40 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] border' 
                    : 'glass-card border-slate-800 hover:border-orange-900/50 hover:bg-slate-900/60'
                }`}
              >
                <div className="text-[11px] font-mono text-orange-400 uppercase tracking-widest flex items-center justify-between">
                  <span>High</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-orange-400 mt-2">{stats.high}</div>
              </div>

              <div 
                onClick={() => setFilterSeverity('medium')}
                className={`cursor-pointer p-5 rounded-2xl transition-all duration-300 ${
                  filterSeverity === 'medium' 
                    ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] border' 
                    : 'glass-card border-slate-800 hover:border-amber-900/50 hover:bg-slate-900/60'
                }`}
              >
                <div className="text-[11px] font-mono text-amber-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Medium</span>
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-amber-400 mt-2">{stats.medium}</div>
              </div>

              <div 
                onClick={() => setFilterSeverity('low')}
                className={`cursor-pointer p-5 rounded-2xl transition-all duration-300 ${
                  filterSeverity === 'low' 
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] border' 
                    : 'glass-card border-slate-800 hover:border-cyan-900/50 hover:bg-slate-900/60'
                }`}
              >
                <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest flex items-center justify-between">
                  <span>Low</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-2">{stats.low}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-400 px-1 gap-2 border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Duration: <strong className="text-emerald-400">{scanData.scan.finishedAt ? Math.round((new Date(scanData.scan.finishedAt) - new Date(scanData.scan.startedAt)) / 1000) : 0}s</strong></span>
                </div>
                <span className="text-slate-700">•</span>
                <span>Scan ID: <code className="text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{scanData.scan.id}</code></span>
              </div>
              <div>
                Showing: <span className="font-bold text-white uppercase tracking-wider">{filterSeverity}</span> ({sortedFindings.length} items)
              </div>
            </div>
          </div>
        )}

        {/* Findings List with Responsive Micro-Interactions */}
        {scanData && (
          <div className="space-y-4 group/findings">
            {sortedFindings.length === 0 ? (
              <div className="p-16 text-center glass-panel rounded-2xl border-slate-800">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-4 opacity-90 shadow-sm" />
                <h3 className="text-lg font-mono font-bold text-white">NO VULNERABILITIES DETECTED IN THIS SCOPE</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">All evaluated compliance checks for the selected filter returned positive responses.</p>
              </div>
            ) : (
              sortedFindings.map((finding) => {
                const isExpanded = !!expandedRows[finding.id];
                return (
                  <div
                    key={finding.id}
                    className="glass-card rounded-2xl border-slate-800/80 overflow-hidden transition-all duration-300 group-hover/findings:opacity-40 group-hover/findings:blur-[1px] hover:!opacity-100 hover:!blur-none hover:scale-[1.01] hover:border-slate-700 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]"
                  >
                    {/* Row Header */}
                    <div
                      onClick={() => toggleRow(finding.id)}
                      className="p-5 cursor-pointer flex items-center justify-between gap-4 select-none hover:bg-slate-900/60 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        )}

                        <span
                          className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-md border tracking-wider flex-shrink-0 ${
                            SEVERITY_COLORS[finding.severity] || 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {finding.severity}
                        </span>

                        <div className="truncate">
                          <span className="font-semibold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                            {finding.title}
                          </span>
                          <span className="ml-2.5 text-xs text-slate-500 font-mono hidden sm:inline">
                            [{finding.category}]
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-slate-400 hidden md:inline">
                          CONF: <strong className="text-slate-200">{finding.confidence}</strong>
                        </span>
                        <span className="text-xs text-slate-500 font-mono hidden lg:inline">
                          {finding.checkId}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Detail Drawer */}
                    {isExpanded && (
                      <div className="p-6 border-t border-slate-800/80 bg-slate-950/90 space-y-6 text-sm animate-in fade-in duration-200">
                        {/* Meta Banner */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs font-mono">
                          <div>
                            <span className="text-slate-500 block mb-1">AFFECTED COMPONENT:</span>
                            <span className="text-emerald-400 break-all font-semibold">{finding.affectedComponent}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-1">REFERENCE SCORE:</span>
                            <span className="text-slate-200">{finding.referenceScore || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-1">CATEGORY:</span>
                            <span className="text-slate-200 capitalize font-medium">{finding.category}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                            Vulnerability Analysis
                          </h4>
                          <p className="text-slate-300 leading-relaxed text-sm">{finding.description}</p>
                        </div>

                        {/* Steps to Reproduce */}
                        {finding.stepsToReproduce && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                              Steps to Reproduce
                            </h4>
                            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                              {finding.stepsToReproduce}
                            </pre>
                          </div>
                        )}

                        {/* Evidence View */}
                        {finding.evidence && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                                HTTP Telemetry & Evidence Log
                              </h4>
                              <button
                                onClick={() => copyToClipboard(
                                  typeof finding.evidence === 'object' 
                                    ? JSON.stringify(finding.evidence, null, 2) 
                                    : finding.evidence,
                                  finding.id
                                )}
                                className="text-xs font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded border border-slate-800 transition-colors"
                              >
                                {copiedId === finding.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Raw</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-4 bg-[#03060d] border border-slate-800/80 rounded-xl text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-80 overflow-y-auto leading-relaxed shadow-inner">
                              {typeof finding.evidence === 'object'
                                ? JSON.stringify(finding.evidence, null, 2)
                                : finding.evidence}
                            </pre>
                          </div>
                        )}

                        {/* Impact & Remediation Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                          <div className="p-5 bg-red-950/20 border border-red-900/30 rounded-xl space-y-2">
                            <h5 className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4 text-red-400" />
                              Operational & Business Impact
                            </h5>
                            <p className="text-xs text-slate-300 leading-relaxed">{finding.businessImpact}</p>
                          </div>

                          <div className="p-5 bg-emerald-950/20 border border-emerald-900/30 rounded-xl space-y-2">
                            <h5 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              Remediation Guidance
                            </h5>
                            <p className="text-xs text-slate-300 leading-relaxed">{finding.remediation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-[#03050b] py-6 text-center text-xs font-mono text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Sentinel Cyber Assessment Platform &bull; Phase 1 Infrastructure
          </div>
          <div className="flex items-center space-x-3 text-slate-600">
            <span>SEC_SUITE_V1.0</span>
            <span>&bull;</span>
            <span>ENFORCED_LOCAL_SCOPE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
