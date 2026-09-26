'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
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
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col relative bg-cyber-grid selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Navigation Drawer */}
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
              <div className="relative p-1.5 bg-red-500/10 border border-red-500/25 rounded-lg text-red-400 group-hover:border-red-500/50 transition-colors">
                <Globe className="w-5 h-5" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-400 rounded-full animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold tracking-wider text-white font-mono">
                    SENTINEL
                  </h1>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/25 text-red-400 font-semibold tracking-wider">
                    WORLD MONITOR
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono hidden sm:block">
                  Live Global Attack Surface & Threat Intelligence
                </p>
              </div>
            </Link>
          </div>

          {/* Quick tab nav */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
            <Link
              href="/#dashboard"
              className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-all flex items-center gap-1.5"
            >
              <Radio className="w-3 h-3" />
              Dashboard
            </Link>
            <Link
              href="/#vulnerability-matrix"
              className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3 h-3" />
              Vuln Matrix
            </Link>
            <Link
              href="/#history"
              className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-all flex items-center gap-1.5"
            >
              <History className="w-3 h-3" />
              History
            </Link>
            <div className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold bg-red-500/15 border border-red-500/30 text-red-400 flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              World Monitor
            </div>
            <Link
              href="/#export"
              className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3 h-3" />
              Report
            </Link>
          </nav>

          {/* Return to Dashboard */}
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 rounded-xl transition-all"
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
      <footer className="border-t border-slate-800/50 bg-[#050811] py-5 text-center text-[10px] font-mono text-slate-600 relative z-10">
        Sentinel Cyber Assessment Platform · World Monitor Threat Intelligence Module · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
