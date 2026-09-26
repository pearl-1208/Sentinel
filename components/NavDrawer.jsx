'use client';

import { 
  Shield, 
  Radio, 
  Code2, 
  History, 
  Key, 
  Globe, 
  Settings, 
  X,
  ChevronRight,
  Activity
} from 'lucide-react';

export default function NavDrawer({ isOpen, onClose, activeTab, onSelectTab, onOpenCredentials, onOpenSettings }) {
  if (!isOpen) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Home', desc: 'Real-time telemetry & active probe console', icon: Radio },
    { id: 'matrix', label: 'Vulnerability Matrix', desc: 'Searchable & filterable issue catalog', icon: Code2 },
    { id: 'history', label: 'Scan History & Logs', desc: 'Historical assessment records & risk index', icon: History },
    { id: 'world-monitor', label: 'World Monitor & Intel', desc: 'Live global attack surface & MITRE ATT&CK', icon: Globe },
    { id: 'export', label: 'Executive Report Briefing', desc: 'Formal CISO compliance report & PDF export', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex select-none no-print">
      {/* Dark Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-full bg-[#0b0f17] border-r border-[#1f2937] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#1f2937] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-mono font-bold text-white tracking-wider">SENTINEL SEC-OPS</div>
              <div className="text-[10px] font-mono text-slate-400">Threat Monitoring Platform</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#1f2937] text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-3 mb-2">
            PLATFORM NAVIGATION
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-sm'
                    : 'bg-[#111827]/60 border-[#1f2937] text-slate-300 hover:border-slate-700 hover:bg-[#111827]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <div>
                    <div className="text-xs font-mono font-bold">{item.label}</div>
                    <div className="text-[10px] font-mono text-slate-500 truncate max-w-[180px]">{item.desc}</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors" />
              </button>
            );
          })}
        </div>

        {/* Management Actions & System Status */}
        <div className="p-4 border-t border-[#1f2937] space-y-2 bg-[#080c14]">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1 mb-1">
            SECURITY MANAGERS
          </div>

          <button
            onClick={() => {
              onOpenCredentials();
              onClose();
            }}
            className="w-full px-3 py-2.5 rounded-xl border border-[#1f2937] bg-[#111827] text-xs font-mono text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors flex items-center gap-2"
          >
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target & Credentials Manager</span>
          </button>

          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full px-3 py-2.5 rounded-xl border border-[#1f2937] bg-[#111827] text-xs font-mono text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors flex items-center gap-2"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Settings & API Config</span>
          </button>

          <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-400" />
              ENGINE: v2.0-ENTERPRISE
            </span>
            <span>SCOPED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
