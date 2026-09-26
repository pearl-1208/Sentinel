'use client';

import { useState, useEffect } from 'react';
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
  Printer
} from 'lucide-react';
import BrandLoader from '../components/BrandLoader';
import SecurityRadarChart from '../components/SecurityRadarChart';
import RiskTrendChart from '../components/RiskTrendChart';
import CategoryDistribution from '../components/CategoryDistribution';

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
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | detail | history | export
  const [targetUrl, setTargetUrl] = useState('http://localhost:3000');
  const [showAuth, setShowAuth] = useState(false);
  const [userA, setUserA] = useState({ username: '', password: '' });
  const [userB, setUserB] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);
  
  // History state
  const [historyScans, setHistoryScans] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/scans/history');
      const text = await res.text();
      let data = null;
      if (text) data = JSON.parse(text);
      if (res.ok && data?.success) {
        setHistoryScans(data.data.scans || []);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openFindingDetail = (finding) => {
    setSelectedFinding(finding);
    setActiveTab('detail');
  };

  const handleStartScan = async (e) => {
    e.preventDefault();
    if (!targetUrl) return;

    setLoading(true);
    setScanStatus('initializing');
    setScanData(null);
    setScanError(null);

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

      const rawText = await res.text();
      let resData = null;
      if (rawText) {
        try {
          resData = JSON.parse(rawText);
        } catch (jsonErr) {}
      }

      if (!res.ok || !resData?.scanId) {
        const errorMsg = 
          resData?.error?.message || 
          (rawText ? rawText.slice(0, 300) : `Server returned HTTP status ${res.status}`);
        throw new Error(errorMsg);
      }

      const { scanId } = resData;
      setScanStatus('running');

      const pollInterval = setInterval(async () => {
        try {
          const checkRes = await fetch(`/api/scans/${scanId}`);
          if (checkRes.ok) {
            const checkText = await checkRes.text();
            let pollData = null;
            if (checkText) {
              try {
                pollData = JSON.parse(checkText);
              } catch (parseErr) {}
            }
            if (pollData?.scan && (pollData.scan.status === 'done' || pollData.scan.status === 'failed')) {
              clearInterval(pollInterval);
              setScanData(pollData);
              setScanStatus(pollData.scan.status);
              setLoading(false);
              fetchHistory();
            }
          }
        } catch (pollErr) {
          console.error('Polling error:', pollErr);
        }
      }, 1000);
    } catch (err) {
      console.error('Scan start error:', err);
      setScanError(err.message || 'An unexpected error occurred while initiating scan');
      setLoading(false);
      setScanStatus('error');
    }
  };

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

  const exportJSON = () => {
    if (!scanData?.scan?.id) return;
    window.open(`/api/export?scanId=${scanData.scan.id}&format=json`, '_blank');
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col relative bg-cyber-grid selection:bg-emerald-500/30 selection:text-emerald-300">
      <BrandLoader />

      {/* Navigation Header */}
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
                  PHASE 2 ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono tracking-tight">
                Cyber Assessment & Intelligence Engine
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Live Dashboard
            </button>

            <button
              onClick={() => setActiveTab('detail')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'detail'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Vulnerability Detail
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Scan History
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'export'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Executive Report
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8 relative z-10">

        {/* TAB 1: LIVE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Target & Config Console */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
              
              <form onSubmit={handleStartScan} className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-end">
                  <div className="flex-1 w-full space-y-2">
                    <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      Target Endpoint (URL / Scope)
                    </label>
                    <input
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      required
                      placeholder="http://localhost:3000"
                      className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/80 font-mono text-sm shadow-inner transition-all"
                    />
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
                          Auditing...
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

                {showAuth && (
                  <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                      <span className="text-xs font-mono text-emerald-400 font-bold uppercase">User A (Primary Context)</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Username"
                          value={userA.username}
                          onChange={(e) => setUserA({ ...userA, username: e.target.value })}
                          className="px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={userA.password}
                          onChange={(e) => setUserA({ ...userA, password: e.target.value })}
                          className="px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                      <span className="text-xs font-mono text-cyan-400 font-bold uppercase">User B (Scope Verification)</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Username"
                          value={userB.username}
                          onChange={(e) => setUserB({ ...userB, username: e.target.value })}
                          className="px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={userB.password}
                          onChange={(e) => setUserB({ ...userB, password: e.target.value })}
                          className="px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {scanError && (
              <div className="glass-panel border-red-500/40 bg-red-950/30 rounded-2xl p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-mono font-bold text-red-400 uppercase">Assessment Error</h4>
                    <p className="text-xs font-mono text-slate-200 mt-1">{scanError}</p>
                  </div>
                </div>
                <button
                  onClick={() => setScanError(null)}
                  className="px-3 py-1 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono rounded-xl"
                >
                  Dismiss
                </button>
              </div>
            )}

            {loading && (
              <div className="glass-panel border-emerald-500/30 rounded-2xl p-8 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                  <Shield className="w-8 h-8 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <h3 className="text-base font-mono font-bold text-white">PHASE 2 AUDIT IN PROGRESS</h3>
              </div>
            )}

            {/* Scan Summary Cards */}
            {scanData && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div onClick={() => setFilterSeverity('all')} className="glass-card p-5 rounded-2xl cursor-pointer hover:border-emerald-500/50">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Total</div>
                    <div className="text-3xl font-extrabold font-mono text-white mt-2">{stats.total}</div>
                  </div>
                  <div onClick={() => setFilterSeverity('critical')} className="glass-card p-5 rounded-2xl cursor-pointer hover:border-red-500/50">
                    <div className="text-[11px] font-mono text-red-400 uppercase">Critical</div>
                    <div className="text-3xl font-extrabold font-mono text-red-400 mt-2">{stats.critical}</div>
                  </div>
                  <div onClick={() => setFilterSeverity('high')} className="glass-card p-5 rounded-2xl cursor-pointer hover:border-orange-500/50">
                    <div className="text-[11px] font-mono text-orange-400 uppercase">High</div>
                    <div className="text-3xl font-extrabold font-mono text-orange-400 mt-2">{stats.high}</div>
                  </div>
                  <div onClick={() => setFilterSeverity('medium')} className="glass-card p-5 rounded-2xl cursor-pointer hover:border-amber-500/50">
                    <div className="text-[11px] font-mono text-amber-400 uppercase">Medium</div>
                    <div className="text-3xl font-extrabold font-mono text-amber-400 mt-2">{stats.medium}</div>
                  </div>
                  <div onClick={() => setFilterSeverity('low')} className="glass-card p-5 rounded-2xl cursor-pointer hover:border-cyan-500/50">
                    <div className="text-[11px] font-mono text-cyan-400 uppercase">Low</div>
                    <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-2">{stats.low}</div>
                  </div>
                </div>

                <div className="space-y-4 group/findings">
                  {sortedFindings.map((finding) => (
                    <div
                      key={finding.id}
                      className="glass-card rounded-2xl border-slate-800/80 p-5 cursor-pointer hover:border-slate-700 transition-all duration-300 group-hover/findings:opacity-40 group-hover/findings:blur-[1px] hover:!opacity-100 hover:!blur-none hover:scale-[1.01]"
                      onClick={() => openFindingDetail(finding)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-md border ${SEVERITY_COLORS[finding.severity]}`}>
                            {finding.severity}
                          </span>
                          <div>
                            <span className="font-semibold text-sm text-slate-100">{finding.title}</span>
                            {finding.cweId && (
                              <span className="ml-2 text-xs font-mono text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                {finding.cweId}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DYNAMIC INTERACTIVE ANALYTICS SECTION */}
            <div className="space-y-6 pt-6 border-t border-slate-800/80">
              <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Interactive Security Telemetry & Analytics
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SecurityRadarChart findings={findings} />
                <RiskTrendChart historyScans={historyScans} />
              </div>

              <CategoryDistribution findings={findings} />
            </div>
          </div>
        )}

        {/* TAB 2: VULNERABILITY DETAIL VIEW */}
        {activeTab === 'detail' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {selectedFinding ? (
              <div className="glass-panel rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded border ${SEVERITY_COLORS[selectedFinding.severity]}`}>
                      {selectedFinding.severity}
                    </span>
                    <h2 className="text-xl font-mono font-bold text-white">{selectedFinding.title}</h2>
                  </div>
                  {selectedFinding.cweId && (
                    <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                      {selectedFinding.cweId}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block mb-1">AFFECTED COMPONENT:</span>
                    <span className="text-emerald-400 font-semibold">{selectedFinding.affectedComponent}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">REFERENCE SCORE:</span>
                    <span className="text-slate-200">{selectedFinding.referenceScore}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">CATEGORY:</span>
                    <span className="text-slate-200 font-medium capitalize">{selectedFinding.category}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">Description</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{selectedFinding.description}</p>
                </div>

                {selectedFinding.stepsToReproduce && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">Steps to Reproduce</h4>
                    <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap">
                      {selectedFinding.stepsToReproduce}
                    </pre>
                  </div>
                )}

                {selectedFinding.evidence && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase">Observed HTTP Telemetry</h4>
                    <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto">
                      {typeof selectedFinding.evidence === 'object'
                        ? JSON.stringify(selectedFinding.evidence, null, 2)
                        : selectedFinding.evidence}
                    </pre>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl space-y-1">
                    <h5 className="text-xs font-mono font-bold text-red-400 uppercase">Business Impact</h5>
                    <p className="text-xs text-slate-300">{selectedFinding.businessImpact}</p>
                  </div>
                  <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl space-y-1">
                    <h5 className="text-xs font-mono font-bold text-emerald-400 uppercase">Remediation Snippet</h5>
                    <p className="text-xs text-slate-300">{selectedFinding.remediation}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-16 text-center rounded-2xl">
                <Code2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-mono font-bold text-slate-300">NO FINDING SELECTED</h3>
                <p className="text-xs text-slate-500 font-mono mt-1">Select any vulnerability card from the Live Dashboard to inspect in-depth evidence.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SCAN HISTORY & ANALYTICS */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="glass-panel rounded-2xl p-6 overflow-x-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  Historical Assessment Executions
                </h3>
                <button
                  onClick={fetchHistory}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 rounded-lg hover:border-emerald-500/50"
                >
                  Refresh History
                </button>
              </div>

              {loadingHistory ? (
                <div className="py-12 text-center text-xs font-mono text-slate-500">Loading audit history...</div>
              ) : historyScans.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-slate-500">No historical scans recorded yet.</div>
              ) : (
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">SCAN ID</th>
                      <th className="pb-3">TARGET URL</th>
                      <th className="pb-3">STATUS</th>
                      <th className="pb-3">STARTED</th>
                      <th className="pb-3">FINDINGS</th>
                      <th className="pb-3">RISK SCORE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {historyScans.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-900/40">
                        <td className="py-3 text-slate-300">{s.id.slice(0, 12)}...</td>
                        <td className="py-3 text-emerald-400 font-semibold">{s.targetUrl}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase text-[10px]">
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400">{new Date(s.startedAt).toLocaleString()}</td>
                        <td className="py-3 text-slate-200">{s.totalFindings}</td>
                        <td className="py-3">
                          <span className={`font-bold px-2 py-0.5 rounded ${s.riskScore > 50 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {s.riskScore}/100
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

        {/* TAB 4: EXECUTIVE REPORT & EXPORT (WITH PRINT STYLING) */}
        {activeTab === 'export' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="glass-panel rounded-2xl p-8 space-y-8">
              {/* Header & Export Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <h2 className="text-2xl font-mono font-bold text-white">Executive Security Audit & Compliance Report</h2>
                  <p className="text-xs text-slate-400 font-mono mt-1">Full vulnerability telemetry deep-dive, CWE mapping, and remediation guidance.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={exportJSON}
                    disabled={!scanData?.scan?.id}
                    className="px-4 py-2 bg-slate-900 border border-slate-700 disabled:opacity-50 text-xs font-mono font-semibold text-emerald-400 rounded-xl hover:border-emerald-500 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export JSON
                  </button>

                  <button
                    onClick={exportPDF}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print / Save PDF
                  </button>
                </div>
              </div>

              {scanData ? (
                <div className="space-y-8">
                  {/* Executive Header Metadata Table */}
                  <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      Assessment Target & Audit Scope
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
                      <div>
                        <span className="text-slate-500 block mb-1">TARGET URL (UNTRUNCATED):</span>
                        <span className="text-white font-bold break-all">{scanData.scan.targetUrl}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">SCAN TIMESTAMP:</span>
                        <span className="text-slate-200">{new Date(scanData.scan.startedAt).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">SCAN ID:</span>
                        <span className="text-slate-300">{scanData.scan.id}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-1">TOTAL VULNERABILITIES:</span>
                        <span className="text-emerald-400 font-bold">{scanData.findings.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive Vulnerability Deep-Dive */}
                  <div className="space-y-6">
                    <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
                      Full Vulnerability Findings Deep-Dive
                    </h3>

                    {scanData.findings.map((f, idx) => (
                      <div key={f.id} className="p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-slate-500 font-bold">#{idx + 1}</span>
                            <span className={`text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${SEVERITY_COLORS[f.severity]}`}>
                              {f.severity}
                            </span>
                            <h4 className="text-sm font-mono font-bold text-white">{f.title}</h4>
                          </div>
                          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                            {f.cweId || 'CWE-693'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-900/60 rounded-xl text-xs font-mono text-slate-400">
                          <div>Component: <span className="text-slate-200 font-semibold">{f.affectedComponent}</span></div>
                          <div>Category: <span className="text-slate-200 font-semibold">{f.category}</span></div>
                          <div>Confidence: <span className="text-slate-200 font-semibold">{f.confidence}</span></div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Description</span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{f.description}</p>
                        </div>

                        {f.evidence && (
                          <div className="space-y-1">
                            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Observed HTTP Telemetry Evidence</span>
                            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto">
                              {typeof f.evidence === 'object' ? JSON.stringify(f.evidence, null, 2) : f.evidence}
                            </pre>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="p-3.5 bg-red-950/20 border border-red-900/30 rounded-xl space-y-1">
                            <span className="text-xs font-mono font-bold text-red-400 uppercase">Business Impact</span>
                            <p className="text-xs text-slate-300 font-sans">{f.businessImpact}</p>
                          </div>
                          <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/30 rounded-xl space-y-1">
                            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Remediation Snippet</span>
                            <p className="text-xs text-slate-300 font-sans">{f.remediation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs font-mono text-slate-500">
                  Execute an assessment scan from the Live Dashboard to populate full executive report details.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800/60 bg-[#03050b] py-6 text-center text-xs font-mono text-slate-500 relative z-10">
        Sentinel Cyber Assessment Platform &bull; Phase 2 Advanced Engine Architecture
      </footer>
    </div>
  );
}



