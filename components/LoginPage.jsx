'use client';

import { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Wifi,
  Server,
  Cpu,
} from 'lucide-react';

const DEMO_USERS = {
  admin: { username: 'admin', password: 'sentinel2026', role: 'Admin', name: 'Security Administrator' },
  analyst: { username: 'analyst', password: 'analyst123', role: 'Analyst', name: 'Security Analyst' },
};

const STATUS_INDICATORS = [
  { label: 'Threat Intelligence Feed', status: 'LIVE', color: 'emerald', icon: Activity },
  { label: 'Scanner Engine', status: 'READY', color: 'emerald', icon: Cpu },
  { label: 'Database Connection', status: 'ACTIVE', color: 'emerald', icon: Server },
  { label: 'Network Probe Module', status: 'ONLINE', color: 'blue', icon: Wifi },
  { label: 'SOC Compliance Suite', status: 'ENFORCING', color: 'emerald', icon: Shield },
];

const BADGES = ['ISO 27001', 'SOC 2 Type II', 'NIST 800-53', 'OWASP ASVS', 'PCI DSS v4'];

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState('Admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('sentinel2026');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Admin') {
      setUsername('admin');
      setPassword('sentinel2026');
    } else {
      setUsername('analyst');
      setPassword('analyst123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const user = DEMO_USERS[username.toLowerCase().trim()];
    if (user && user.password === password) {
      onLogin({ username: username.toLowerCase().trim(), role: user.role, name: user.name });
    } else {
      setError('Invalid credentials. Use admin/sentinel2026 or analyst/analyst123.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col lg:flex-row overflow-hidden bg-[#050811] text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Full-Screen Background Image (User uploaded glowing shield visual) */}
      <div
        className="absolute inset-0 bg-cover bg-left lg:bg-center bg-no-repeat transition-all duration-700 scale-100"
        style={{ backgroundImage: "url('/login-bg.png')" }}
      />

      {/* Sophisticated Dark Gradient & Vignette Overlay */}
      {/* Allows glowing shield to shine through naturally on left while fading into a sleek dark backdrop for the login card on right */}
      <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-[#050811]/30 via-[#080C14]/65 to-[#080C14]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid opacity-15 pointer-events-none" />

      {/* Left Panel — Overlay over the Glowing Shield */}
      <div className="hidden lg:flex lg:w-[54%] flex-col relative z-10 p-10 lg:p-14 justify-between">
        {/* Top Telemetry Header */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300">[SEC_GATEWAY // NODE_ALPHA]</span>
          </div>
          <span className="text-slate-400 font-medium">SENTINEL PLATFORM v3.2</span>
        </div>

        {/* Central Overlay Directly Over the Glowing Shield */}
        <div className="my-auto max-w-lg space-y-6 pl-2">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md shadow-lg">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono tracking-widest text-cyan-300 font-bold uppercase">
              Perimeter Shield Active
            </span>
          </div>

          {/* App Name: SENTINEL */}
          <div className="space-y-2">
            <h1 className="text-4xl xl:text-5xl font-black font-mono tracking-[0.25em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
              SENTINEL
            </h1>
            <p className="text-xs xl:text-sm font-mono text-slate-300 tracking-wider uppercase font-semibold drop-shadow">
              Enterprise Cyber Defense & Threat Intelligence Suite
            </p>
          </div>

          {/* 3 Subsystem Badges cleanly overlaid */}
          <div className="space-y-2 pt-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              Integrated Subsystems
            </div>
            <div className="flex flex-wrap gap-2.5">
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 backdrop-blur-md shadow-lg hover:border-emerald-500/50 transition-colors">
                <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[11px] font-mono text-slate-200 font-bold">THREAT INTEL ENGINE</div>
                  <div className="text-[9px] font-mono text-emerald-400 font-semibold">v4.2 · REAL-TIME FEED</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 backdrop-blur-md shadow-lg hover:border-cyan-500/50 transition-colors">
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-[11px] font-mono text-slate-200 font-bold">ZERO-TRUST BOLA SENTRY</div>
                  <div className="text-[9px] font-mono text-cyan-400 font-semibold">DUAL-CONTEXT SCANNER</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 backdrop-blur-md shadow-lg hover:border-amber-500/50 transition-colors">
                <Server className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[11px] font-mono text-slate-200 font-bold">NTRO COMPLIANT CORE</div>
                  <div className="text-[9px] font-mono text-amber-400 font-semibold">AUDIT SPEC v2.4</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Technical Stamps */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 tracking-widest pt-4 border-t border-slate-800/60">
          <span>ENCRYPTION: AES-256-GCM</span>
          <span>ISO 27001 · SOC 2 TYPE II · OWASP ASVS</span>
        </div>
      </div>

      {/* Right Panel — Login Card with Tuned Glassmorphism */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="relative w-full max-w-md">
          {/* Glassmorphic card adjusted for smooth blending with background image */}
          <div className="relative bg-[#0F172A]/85 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

            <div className="px-8 py-9">
              {/* Mobile logo header */}
              <div className="flex items-center gap-3 mb-6 lg:hidden">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold font-mono text-white tracking-wider">SENTINEL</h2>
                  <p className="text-[10px] font-mono text-slate-400">Security Operations Portal</p>
                </div>
              </div>

              <h3 className="text-lg font-bold font-mono text-white mb-1">Security Operations Center</h3>
              <p className="text-xs font-mono text-slate-400 mb-6">
                Authenticate with role authorization to access audit telemetry
              </p>

              {/* Role Toggle Selector */}
              <div className="mb-6 p-1 bg-[#080C14] border border-slate-800 rounded-xl flex gap-1">
                {['Admin', 'Analyst'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => selectRole(r)}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                      role === r
                        ? 'bg-[#1E293B] border border-slate-700 text-emerald-400 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {r === 'Admin' ? '⚙️ Admin Role' : '🔍 Analyst Role'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="Username"
                      className="w-full pl-9 pr-4 py-2.5 bg-[#080C14] border border-slate-800 focus:border-emerald-500/60 rounded-xl text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Password"
                      className="w-full pl-9 pr-10 py-2.5 bg-[#080C14] border border-slate-800 focus:border-emerald-500/60 rounded-xl text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-950/30 border border-red-800/40 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-[#F87171] shrink-0 mt-0.5" />
                    <p className="text-[11px] font-mono text-red-300">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-950/50 disabled:text-slate-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      Authenticate Session
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Credentials Quick Info */}
              <div className="mt-6 p-3 bg-[#080C14] border border-slate-800 rounded-xl space-y-1">
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider text-center font-bold mb-1">
                  Preset Access Accounts
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex justify-between">
                  <span>Admin:</span>
                  <span className="text-slate-200">admin / sentinel2026</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex justify-between">
                  <span>Analyst:</span>
                  <span className="text-slate-200">analyst / analyst123</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-mono text-slate-500">
              Session-Scoped Cryptographic Key Exchange
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
