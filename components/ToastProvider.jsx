'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, Zap } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
  warning: Zap,
};

const COLORS = {
  success: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400',
  error: 'border-red-500/40 bg-red-950/40 text-red-400',
  info: 'border-blue-500/40 bg-blue-950/40 text-blue-400',
  warning: 'border-amber-500/40 bg-amber-950/40 text-amber-400',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[95] flex flex-col gap-2 items-center pointer-events-none w-full max-w-sm px-4">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || Info;
          const colors = COLORS[toast.type] || COLORS.info;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto w-full flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg animate-in slide-in-from-bottom-2 duration-200 ${colors}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-mono text-slate-200 flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

// Convenience helpers
export function toast(options) {
  // This is a bare singleton fallback — use useToast() hook inside components
  console.warn('Use useToast() hook for toast notifications inside React components');
}
