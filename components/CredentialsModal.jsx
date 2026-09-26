import React from 'react';
import { Lock, X } from 'lucide-react';

export default function CredentialsModal({ isOpen, onClose, userA, setUserA, userB, setUserB }) {
  if (!isOpen) return null;

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
          maxWidth: '32rem',
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
            <Lock size={18} color="#10b981" />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#e2e8f0',
                letterSpacing: '0.05em',
              }}
            >
              Target &amp; Credentials Manager
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
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            {/* User A Card */}
            <UserCard
              label="User A"
              accent="#10b981"
              accentLight="rgba(16,185,129,0.12)"
              accentBorder="rgba(16,185,129,0.3)"
              credentials={userA}
              setCredentials={setUserA}
            />

            {/* User B Card */}
            <UserCard
              label="User B"
              accent="#06b6d4"
              accentLight="rgba(6,182,212,0.12)"
              accentBorder="rgba(6,182,212,0.3)"
              credentials={userB}
              setCredentials={setUserB}
            />
          </div>
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
            Save Credentials
          </button>
        </div>
      </div>
    </div>
  );
}

function UserCard({ label, accent, accentLight, accentBorder, credentials = {}, setCredentials }) {
  const { username = '', password = '' } = credentials;

  const inputStyle = {
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
  };

  const handleFocus = (e) => (e.currentTarget.style.borderColor = accent);
  const handleBlur = (e) => (e.currentTarget.style.borderColor = '#1f2937');

  return (
    <div
      style={{
        flex: '1 1 calc(50% - 0.5rem)',
        minWidth: '200px',
        backgroundColor: accentLight,
        border: `1px solid ${accentBorder}`,
        borderRadius: '0.75rem',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: accent,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        {label}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.625rem', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
          placeholder="username"
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.625rem', fontFamily: 'monospace', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
          placeholder="••••••••"
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
