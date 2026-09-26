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
    const count = findings.filter((f) => f.cweId === item.cweId || f.title?.includes(item.category)).length;
    const percentage = Math.round((count / total) * 100);
    return { ...item, count, percentage };
  });

  return (
    <div
      style={{
        backgroundColor: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '1rem',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1f2937',
          paddingBottom: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={16} color="#10b981" />
          <h3
            style={{
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              margin: 0,
            }}
          >
            Severity &amp; CWE Classification Matrix
          </h3>
        </div>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.6875rem',
            color: '#94a3b8',
          }}
        >
          OWASP Top 10 Mapping
        </span>
      </div>

      {/* Distribution items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {distribution.map((item) => (
          <div
            key={item.cweId}
            style={{
              padding: '0.875rem',
              backgroundColor: 'rgba(15,23,42,0.6)',
              border: '1px solid #1f2937',
              borderRadius: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    padding: '0.125rem 0.5rem',
                    borderRadius: '0.25rem',
                    backgroundColor: 'rgba(16,185,129,0.1)',
                    color: '#10b981',
                    border: '1px solid rgba(16,185,129,0.3)',
                    fontWeight: 700,
                  }}
                >
                  {item.cweId}
                </span>
                <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{item.name}</span>
              </div>
              <span
                style={{
                  color: item.count > 0 ? '#fbbf24' : '#64748b',
                  fontWeight: item.count > 0 ? 700 : 400,
                }}
              >
                {item.count} finding(s) ({item.percentage}%)
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#0f172a',
                borderRadius: '9999px',
                overflow: 'hidden',
                border: '1px solid #1f2937',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.max(3, item.percentage)}%`,
                  background: item.count > 0
                    ? 'linear-gradient(to right, #f59e0b, #ef4444)'
                    : '#1e293b',
                  borderRadius: '9999px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default CategoryDistribution;
