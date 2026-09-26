import React, { useState } from 'react';
import { Target } from 'lucide-react';

const VECTORS = [
  { key: 'client-config',    name: 'Client Config',    angle: 0   },
  { key: 'transport-config', name: 'Transport Config', angle: 60  },
  { key: 'api-config',       name: 'API Config',       angle: 120 },
  { key: 'cors',             name: 'CORS',             angle: 180 },
  { key: 'session-handling', name: 'Session Handling', angle: 240 },
  { key: 'input-handling',   name: 'Input Handling',   angle: 300 },
];

const CENTER = 150;
const RADIUS = 100;
const GRID_RINGS = [25, 50, 75, 100];

function toXY(angleDeg, r) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  };
}

function getVectorScore(key, findings) {
  const map = {
    'client-config':    ['misconfiguration', 'config'],
    'transport-config': ['ssl', 'tls', 'transport'],
    'api-config':       ['api', 'endpoint'],
    'cors':             ['cors', 'cross-origin'],
    'session-handling': ['session', 'cookie', 'auth'],
    'input-handling':   ['injection', 'xss', 'input'],
  };
  const keywords = map[key] || [];
  const matched = findings.filter((f) => {
    const text = ((f.type || '') + ' ' + (f.description || '') + ' ' + (f.category || '')).toLowerCase();
    return keywords.some((kw) => text.includes(kw));
  });
  if (!findings.length) return 0;
  return Math.min(100, Math.round((matched.length / Math.max(findings.length, 1)) * 100 + matched.length * 8));
}

const SecurityRadarChart = React.memo(function SecurityRadarChart({ findings = [] }) {
  const [selectedVector, setSelectedVector] = useState(null);

  const scores = VECTORS.reduce((acc, v) => {
    acc[v.key] = getVectorScore(v.key, findings);
    return acc;
  }, {});

  const polygonPoints = VECTORS.map((v) => {
    const r = (scores[v.key] / 100) * RADIUS;
    const { x, y } = toXY(v.angle, r);
    return `${x},${y}`;
  }).join(' ');

  const activeVector = selectedVector !== null ? VECTORS[selectedVector] : null;
  const activeScore = activeVector ? scores[activeVector.key] : null;

  return (
    <div
      style={{
        backgroundColor: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '1rem',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Target size={15} color="#10b981" />
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Attack Surface Radar
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* SVG Radar */}
        <div style={{ flex: '0 0 auto' }}>
          <svg
            width="300"
            height="300"
            viewBox="0 0 300 300"
            style={{ display: 'block' }}
          >
            {/* Grid rings */}
            {GRID_RINGS.map((r) => {
              const pts = VECTORS.map((v) => {
                const { x, y } = toXY(v.angle, r);
                return `${x},${y}`;
              }).join(' ');
              return (
                <polygon
                  key={r}
                  points={pts}
                  fill="none"
                  stroke="#1f2937"
                  strokeWidth="1"
                />
              );
            })}

            {/* Axis lines */}
            {VECTORS.map((v) => {
              const { x, y } = toXY(v.angle, RADIUS);
              return (
                <line
                  key={v.key}
                  x1={CENTER}
                  y1={CENTER}
                  x2={x}
                  y2={y}
                  stroke="#1f2937"
                  strokeWidth="1"
                />
              );
            })}

            {/* Data polygon */}
            <polygon
              points={polygonPoints}
              fill="rgba(16,185,129,0.15)"
              stroke="#10b981"
              strokeWidth="1.5"
            />

            {/* Vector nodes and labels */}
            {VECTORS.map((v, idx) => {
              const score = scores[v.key];
              const r = (score / 100) * RADIUS;
              const { x, y } = toXY(v.angle, r);
              const labelPos = toXY(v.angle, RADIUS + 18);
              const isSelected = selectedVector === idx;

              return (
                <g key={v.key}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 8 : 5}
                    fill={isSelected ? '#10b981' : '#065f46'}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    style={{ cursor: 'pointer', transition: 'r 0.15s' }}
                    onMouseEnter={() => setSelectedVector(idx)}
                    onMouseLeave={() => setSelectedVector(null)}
                    onClick={() => setSelectedVector(isSelected ? null : idx)}
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: '9px',
                      fontFamily: 'monospace',
                      fill: isSelected ? '#10b981' : '#64748b',
                      pointerEvents: 'none',
                      transition: 'fill 0.15s',
                    }}
                  >
                    {v.name}
                  </text>
                </g>
              );
            })}

            {/* Center dot */}
            <circle cx={CENTER} cy={CENTER} r={3} fill="#10b981" opacity={0.5} />
          </svg>
        </div>

        {/* Metrics breakdown */}
        <div style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {VECTORS.map((v, idx) => {
            const score = scores[v.key];
            const isActive = selectedVector === idx;
            return (
              <div
                key={v.key}
                onMouseEnter={() => setSelectedVector(idx)}
                onMouseLeave={() => setSelectedVector(null)}
                style={{
                  cursor: 'pointer',
                  padding: '0.375rem 0.5rem',
                  borderRadius: '0.375rem',
                  backgroundColor: isActive ? 'rgba(16,185,129,0.08)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(16,185,129,0.3)' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.25rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.6875rem',
                      color: isActive ? '#10b981' : '#94a3b8',
                    }}
                  >
                    {v.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.6875rem',
                      color: isActive ? '#10b981' : '#64748b',
                    }}
                  >
                    {score}
                  </span>
                </div>
                <div
                  style={{
                    height: '3px',
                    backgroundColor: '#1f2937',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${score}%`,
                      backgroundColor: score > 70 ? '#ef4444' : score > 40 ? '#f59e0b' : '#10b981',
                      borderRadius: '2px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active tooltip */}
      {activeVector && (
        <div
          style={{
            backgroundColor: '#0b0f17',
            border: '1px solid #1f2937',
            borderRadius: '0.5rem',
            padding: '0.625rem 1rem',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: '#cbd5e1',
          }}
        >
          <span style={{ color: '#10b981', fontWeight: 700 }}>{activeVector.name}</span>
          {' — '}Score:{' '}
          <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{activeScore}</span>
          /100
        </div>
      )}
    </div>
  );
});

export default SecurityRadarChart;
