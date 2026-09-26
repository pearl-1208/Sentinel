import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return <SettingsModalInner onClose={onClose} />;
}

function SettingsModalInner({ onClose }) {
  const [sensitivity, setSensitivity] = useState('Standard');
  const [timeout, setTimeout_] = useState(10000);

  const sensitivities = ['Low', 'Standard', 'Aggressive'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          backgroundColor: '#111827',
          border: '1px solid #1f2937',
          borderRadius: '1rem',
          width: '100%',
          maxWidth: '28rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #1f2937',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Settings size={18} color="#10b981" />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#e2e8f0',
                letterSpacing: '0.05em',
              }}
            >
              Settings &amp; API Configuration
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.375rem',
              color: '#94a3b8',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#e2e8f0')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Scan Sensitivity */}
          <Section label="Scan Sensitivity">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {sensitivities.map((s) => {
                const active = sensitivity === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSensitivity(s)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: `1px solid ${active ? '#10b981' : '#1f2937'}`,
                      backgroundColor: active ? 'rgba(16,185,129,0.15)' : 'transparent',
                      color: active ? '#10b981' : '#64748b',
                      transition: 'all 0.15s',
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Request Timeout */}
          <Section label="Request Timeout (ms)">
            <input
              type="number"
              value={timeout}
              onChange={(e) => setTimeout_(Number(e.target.value))}
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                border: '1px solid #1f2937',
                borderRadius: '0.375rem',
                padding: '0.5rem 0.75rem',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#e2e8f0',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#10b981')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#1f2937')}
            />
          </Section>

          {/* Scanner User-Agent */}
          <Section label="Scanner User-Agent">
            <input
              type="text"
              readOnly
              value="Sentinel-Security-Scanner/2.0"
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                border: '1px solid #1f2937',
                borderRadius: '0.375rem',
                padding: '0.5rem 0.75rem',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#64748b',
                outline: 'none',
                boxSizing: 'border-box',
                cursor: 'default',
              }}
            />
          </Section>

          {/* SSRF Protection */}
          <Section label="SSRF Protection">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  backgroundColor: 'rgba(16,185,129,0.12)',
                  border: '1px solid rgba(16,185,129,0.35)',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#10b981',
                  letterSpacing: '0.08em',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    display: 'inline-block',
                  }}
                />
                ENABLED
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.6875rem', color: '#475569' }}>
                Protects against server-side request forgery
              </span>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #1f2937',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.625rem 1.5rem',
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: '0.8125rem',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div
        style={{
          fontSize: '0.625rem',
          fontFamily: 'monospace',
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
