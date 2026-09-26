'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Terminal,
  Radio,
  History,
  Key,
  Globe,
  Settings,
  FileText,
  Code2,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    href: '/',
    label: 'Dashboard',
    sublabel: 'Live scanning & telemetry controls',
    icon: Radio,
    accent: 'emerald',
  },
  {
    id: 'world-monitor',
    href: '/world-monitor',
    label: 'World Monitor Feed',
    sublabel: 'Live global attack surface & threat intel',
    icon: Globe,
    accent: 'blue',
  },
  {
    id: 'vulnerability-matrix',
    href: '/vulnerability-matrix',
    label: 'Vulnerability Matrix (Scan Details)',
    sublabel: 'Searchable CVE & CWE registry',
    icon: AlertTriangle,
    accent: 'red',
  },
  {
    id: 'export',
    href: '/report',
    label: 'Executive Report (Audit Export)',
    sublabel: 'CISO-ready audit documentation & PDF export',
    icon: FileText,
    accent: 'purple',
  },
  {
    id: 'history',
    href: '/#history',
    label: 'Scan History & Audit Logs',
    sublabel: 'Historical records with timestamps',
    icon: History,
    accent: 'cyan',
  },
  {
    id: 'credentials',
    href: '/#credentials',
    label: 'Target & Credentials Manager',
    sublabel: 'Dual-context User A / User B for BOLA testing',
    icon: Key,
    accent: 'amber',
  },
  {
    id: 'settings',
    href: '/#settings',
    label: 'Settings & API Config',
    sublabel: 'Scanner depth and sensitivity tuning',
    icon: Settings,
    accent: 'slate',
  },
];

const ACCENT_COLORS = {
  emerald: {
    icon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    active: 'bg-emerald-500/10 border-l-2 border-emerald-500 text-emerald-300',
    hover: 'hover:bg-emerald-500/5',
  },
  red: {
    icon: 'text-red-400 bg-red-500/10 border-red-500/20',
    active: 'bg-red-500/10 border-l-2 border-red-500 text-red-300',
    hover: 'hover:bg-red-500/5',
  },
  cyan: {
    icon: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    active: 'bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-300',
    hover: 'hover:bg-cyan-500/5',
  },
  amber: {
    icon: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    active: 'bg-amber-500/10 border-l-2 border-amber-500 text-amber-300',
    hover: 'hover:bg-amber-500/5',
  },
  blue: {
    icon: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    active: 'bg-blue-500/10 border-l-2 border-blue-500 text-blue-300',
    hover: 'hover:bg-blue-500/5',
  },
  purple: {
    icon: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    active: 'bg-purple-500/10 border-l-2 border-purple-500 text-purple-300',
    hover: 'hover:bg-purple-500/5',
  },
  slate: {
    icon: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    active: 'bg-slate-500/10 border-l-2 border-slate-500 text-slate-300',
    hover: 'hover:bg-slate-500/5',
  },
};

export default function NavDrawer({ isOpen, onClose, activeTab, onNavigate }) {
  const drawerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleItemClick = (item) => {
    onClose();
    if (item.href === '/world-monitor' || item.href === '/vulnerability-matrix' || item.href === '/report') {
      if (typeof window !== 'undefined' && window.location.pathname === item.href) {
        return;
      }
      router.push(item.href);
      return;
    }
    if (item.href === '/') {
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        router.push('/');
        return;
      }
      if (onNavigate) onNavigate('dashboard');
      return;
    }
    if (item.href.startsWith('/#')) {
      const targetHash = item.href.replace('/#', '');
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        router.push(item.href);
        return;
      }
      if (onNavigate) onNavigate(targetHash);
      return;
    }
    if (onNavigate) onNavigate(item.id);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 z-[75] h-full w-[290px] bg-[#080C14] border-r border-slate-800 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0F172A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold font-mono text-white tracking-wider">SENTINEL</h2>
              <p className="text-[10px] font-mono text-slate-400">Security Operations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Banner */}
        <div className="mx-4 mt-4 mb-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
          <span className="text-[10px] font-mono text-emerald-400 font-medium">System Online · All modules active</span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
          <div className="px-3 pb-1 pt-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold">Core Navigation</span>
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const colors = ACCENT_COLORS[item.accent];
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 group ${
                  isActive
                    ? `${colors.active} bg-slate-900 border border-slate-700/60`
                    : `text-slate-400 hover:text-slate-100 hover:bg-[#0F172A]`
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                    isActive ? colors.icon : 'text-slate-500 bg-[#0F172A] border-slate-800 group-hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 text-left">
                  <div className={`text-xs font-mono font-semibold ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-slate-100'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 group-hover:text-slate-400 leading-tight truncate max-w-[170px]">
                    {item.sublabel}
                  </div>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                    isActive ? 'opacity-100 text-slate-300' : 'opacity-0 group-hover:opacity-60 text-slate-500'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-[#0F172A] shrink-0">
          <div className="text-[9px] font-mono text-slate-400 text-center font-medium">
            Sentinel Cyber Assessment Platform
          </div>
          <div className="text-[9px] font-mono text-emerald-400/80 text-center mt-0.5">
            Phase 3 Engine · Corporate SOC Suite
          </div>
        </div>
      </div>
    </>
  );
}
