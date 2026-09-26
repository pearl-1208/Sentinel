'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Terminal,
  Menu,
  ArrowLeft,
  Radio,
  AlertTriangle,
  History,
  Globe,
  FileText,
} from 'lucide-react';
import WorldMonitorView from '@/components/WorldMonitor';
import NavDrawer from '@/components/NavDrawer';
import AIAssistant from '@/components/AIAssistant';

export default function WorldMonitor() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (tab) => {
    const clean = tab.replace(/^\//, '');
    if (clean === 'world-monitor') {
      return;
    }
    router.push(`/#${clean}`);
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col relative bg-cyber-grid selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Sliding Navigation Drawer */}
      <NavDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab="world-monitor"
        onNavigate={handleNavigate}
      />

      {/* Embedded AI Assistant */}
      <AIAssistant onNavigate={handleNavigate} />

      {/* Header */}
      <header className="glass-header sticky top-0 z-50">
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
                  Live Global Attack Surface & Threat Intelligence
                </p>
              </div>
            </Link>
          </div>

          {/* Clean text navigation tabs */}
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
            <div className="text-[12px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5 py-1">
              <Globe className="w-3.5 h-3.5" />
              World Monitor
            </div>
            <Link
              href="/report"
              className="text-[12px] font-mono text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 py-1"
            >
              <FileText className="w-3.5 h-3.5" />
              Report
            </Link>
          </nav>

          {/* Return to Dashboard */}
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 rounded-xl transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6 relative z-10">
        <WorldMonitorView />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0F172A] py-5 text-center text-[10px] font-mono text-slate-400 relative z-10">
        Sentinel Cyber Assessment Platform · World Monitor Threat Intelligence Module · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
