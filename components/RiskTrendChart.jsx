import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

const W = 520;
const H = 160;
const PAD = { top: 16, right: 16, bottom: 32, left: 40 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;

const RiskTrendChart = React.memo(function RiskTrendChart({ historyScans = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const data = historyScans.slice(-20);

  if (data.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#111827',
          border: '1px solid #1f2937',
          borderRadius: '1rem',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '160px',
        }}
      >
        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#475569' }}>
          No scan history yet
        </span>
      </div>
    );
  }

  const scores = data.map((s) => s.riskScore ?? 0);
  const minScore = Math.max(0, Math.min(...scores) - 10);
  const maxScore = Math.min(100, Math.max(...scores) + 10);
  const range = maxScore - minScore || 1;

  function toSvgX(i) {
    return PAD.left + (i / Math.max(data.length - 1, 1)) * CHART_W;
  }
  function toSvgY(score) {
    return PAD.top + CHART_H - ((score - minScore) / range) * CHART_H;
  }

  const pathD = data
    .map((s, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(i)},${toSvgY(s.riskScore ?? 0)}`)
    .join(' ');

  const areaD =
    pathD +
    ` L${toSvgX(data.length - 1)},${PAD.top + CHART_H} L${toSvgX(0)},${PAD.top + CHART_H} Z`;

  const gradientId = 'riskGrad';

  const hovered = hoveredPoint !== null ? data[hoveredPoint] : null;

  return (
    <div
      style={{
        backgroundColor: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '1rem',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <TrendingUp size={15} color="#10b981" />
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
          Risk Score Trend
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.625rem',
            color: '#475569',
          }}
        >
          Last {data.length} scan{data.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* SVG chart */}
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis ticks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          if (tick < minScore - 5 || tick > maxScore + 5) return null;
          const y = toSvgY(tick);
          return (
            <g key={tick}>
              <line x1={PAD.left} y1={y} x2={PAD.left + CHART_W} y2={y} stroke="#1f2937" strokeWidth="1" />
              <text
                x={PAD.left - 6}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                style={{ fontFamily: 'monospace', fontSize: '9px', fill: '#475569' }}
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Line */}
        <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />

        {/* Data points */}
        {data.map((scan, i) => {
          const x = toSvgX(i);
          const y = toSvgY(scan.riskScore ?? 0);
          const isHovered = hoveredPoint === i;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={isHovered ? 6 : 3.5}
              fill={isHovered ? '#10b981' : '#065f46'}
              stroke="#10b981"
              strokeWidth="1.5"
              style={{ cursor: 'pointer', transition: 'r 0.1s' }}
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          );
        })}
      </svg>

      {/* Tooltip rendered outside SVG as a div */}
      <div style={{ minHeight: '56px' }}>
        {hovered ? (
          <div
            style={{
              backgroundColor: '#0b0f17',
              border: '1px solid #1f2937',
              borderRadius: '0.5rem',
              padding: '0.625rem 1rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <TooltipItem label="Scan ID" value={(hovered.id || hovered.scanId || '').slice(0, 12)} />
            <TooltipItem label="Target" value={hovered.targetUrl || hovered.url || '—'} />
            <TooltipItem label="Risk Score" value={hovered.riskScore ?? '—'} highlight />
            <TooltipItem label="Findings" value={hovered.totalFindings ?? (hovered.findings?.length ?? '—')} />
            <TooltipItem label="Critical" value={hovered.criticalCount ?? '—'} />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '56px',
            }}
          >
            <span style={{ fontFamily: 'monospace', fontSize: '0.625rem', color: '#334155' }}>
              Hover a data point for details
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

function TooltipItem({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: '0.5625rem',
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: highlight ? '#10b981' : '#cbd5e1',
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default RiskTrendChart;
