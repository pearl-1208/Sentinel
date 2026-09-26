'use client';

import React from 'react';
import { Layers } from 'lucide-react';

const CWE_MAP = [
  { cweId: 'CWE-639', name: 'Broken Object Level Auth (BOLA)', category: 'Access Control' },
  { cweId: 'CWE-89', name: 'SQL Injection Vulnerability', category: 'Input Handling' },
  { cweId: 'CWE-1004', name: 'Cookie Missing HttpOnly', category: 'Session Handling' },
  { cweId: 'CWE-614', name: 'Cookie Missing Secure Flag', category: 'Session Handling' },
  { cweId: 'CWE-942', name: 'Permissive CORS Origin Policy', category: 'API Security' },
  { cweId: 'CWE-693', name: 'Missing Content-Security-Policy', category: 'Client Security' },
  { cweId: 'CWE-319', name: 'Missing HSTS Transport Security', category: 'Transport Layer' },
  { cweId: 'CWE-1021', name: 'Missing X-Frame-Options', category: 'Client Security' },
  { cweId: 'CWE-200', name: 'Technology Banner Disclosure', category: 'Information Disclosure' },
];

const CategoryDistribution = React.memo(function CategoryDistribution({ findings = [] }) {
  const total = Math.max(1, findings.length);

  const distribution = CWE_MAP.map((item) => {
    const count = findings.filter(
      (f) => f.cweId === item.cweId || f.title?.toLowerCase().includes(item.name.toLowerCase().slice(0, 10))
    ).length;
    const percentage = Math.round((count / total) * 100);
    return { ...item, count, percentage };
  });

  return (
    <div className="bg-[#0F172A] border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Severity & CWE Classification Matrix
          </h3>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          OWASP Top 10 Mapping
        </span>
      </div>

      {/* Distribution items */}
      <div className="flex flex-col gap-2.5">
        {distribution.map((item) => (
          <div
            key={item.cweId}
            className="p-3 bg-slate-900/60 border border-slate-800/60 rounded-xl flex flex-col gap-2"
          >
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2.5">
                {/* Clean, plain muted green text without background container */}
                <span className="text-emerald-400/90 font-medium">
                  {item.cweId}
                </span>
                <span className="text-slate-300 font-medium">{item.name}</span>
              </div>
              {/* Clean, soft slate gray text */}
              <span className="text-slate-400 text-[11px]">
                {item.count} finding{item.count !== 1 ? 's' : ''} ({item.percentage}%)
              </span>
            </div>

            {/* Thin, subtle accent bar in desaturated tone */}
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.count > 0 ? 'bg-amber-500/50' : 'bg-slate-800/50'
                }`}
                style={{ width: `${Math.max(item.count > 0 ? 4 : 0, item.percentage)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default CategoryDistribution;
