'use client';

import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-[90] space-y-3 max-w-sm w-full pointer-events-none no-print">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-xl border glass-panel shadow-2xl flex items-start justify-between gap-3 text-xs font-mono animate-in fade-in slide-in-from-right-5 duration-300 ${
            toast.type === 'error'
              ? 'border-red-500/40 bg-red-950/40 text-red-300'
              : toast.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
              : 'border-slate-700 bg-slate-900/90 text-slate-200'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <div className="font-bold uppercase tracking-wider">{toast.title}</div>
              <div className="text-[11px] text-slate-300 mt-0.5">{toast.message}</div>
            </div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
