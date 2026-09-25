'use client';

import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';

export default function BrandLoader() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [statusText, setStatusText] = useState('INITIALIZING SENTINEL CORE...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStatusText('AUTHENTICATING COMPLIANCE SUITE...');
    }, 600);

    const t2 = setTimeout(() => {
      setStatusText('SYSTEM READY');
    }, 1200);

    const t3 = setTimeout(() => {
      setIsSliding(true);
    }, 1800);

    const t4 = setTimeout(() => {
      setIsDismissed(true);
    }, 2600); // 1800ms + 750ms slide duration + 50ms buffer

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center select-none overflow-hidden transition-splash ${
        isSliding ? '-translate-y-full opacity-90' : 'translate-y-0 opacity-100'
      }`}
      style={{
        backgroundColor: '#000000',
      }}
    >
      {/* Subtle Background Grid & Glow overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Centered Brand Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Animated Cyber Shield Icon */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-emerald-500/20 rounded-2xl blur-xl animate-pulse-glow" />
          <div className="relative p-5 bg-black border border-emerald-500/40 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <Shield className="w-16 h-16 text-emerald-400 animate-pulse" />
          </div>
          {/* Radar Scanning Ring */}
          <div className="absolute -inset-2 border border-emerald-500/30 rounded-2xl animate-radar pointer-events-none" />
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wider text-white font-mono flex items-center gap-3">
          SENTINEL
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 uppercase tracking-widest">
            v1.0
          </span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 font-mono tracking-widest uppercase">
          Automated Security & Compliance Engine
        </p>

        {/* Progress Bar & Status Readout */}
        <div className="mt-10 w-64 sm:w-80 flex flex-col items-center space-y-3">
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500 animate-[pulseGlow_1.5s_infinite] transition-all duration-500 w-full" />
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400/90 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{statusText}</span>
          </div>
        </div>
      </div>

      {/* Cyber Corner Decors */}
      <div className="absolute top-6 left-6 text-[10px] font-mono text-slate-600 tracking-widest hidden sm:block">
        [SYS_INIT // SEC_LAYER_0]
      </div>
      <div className="absolute bottom-6 right-6 text-[10px] font-mono text-slate-600 tracking-widest hidden sm:block">
        STATUS: ENFORCING
      </div>
    </div>
  );
}
