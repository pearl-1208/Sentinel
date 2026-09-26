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
    <div className="min-h-screen bg-[#080C14] flex overflow-hidden">
      {/* Left Panel — Corporate Cybersecurity Overview */}
      <div className="hidden lg:flex lg:w-[52%] flex-col relative overflow-hidden bg-[#050810] border-r border-slate-800">
        <div className="absolute inset-0 bg-cyber-grid opacity-20" />

        <div className="absolute top-6 left-8 text-[10px] font-mono text-slate-500 tracking-widest font-semibold">
          [SEC_GATEWAY // AUTH_STAGE_0]
        </div>
        <div className="absolute top-6 right-8 text-[10px] font-mono text-slate-500 tracking-widest font-semibold">
          SENTINEL v3.0
        </div>

        {/* Central Brand Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-12 relative z-10">
          <div className="relative mb-6">
            <div className="p-5 bg-[#0F172A] border border-slate-800 rounded-2xl shadow-xl">
              <Shield className="w-16 h-16 text-emerald-400" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold font-mono tracking-wider text-white mb-1.5">
            SENTINEL
          </h1>
          <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-8">
            Enterprise Security Operations Platform
          </p>

          {/* Live Status Indicators */}
          <div className="w-full max-w-sm space-y-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 text-center font-bold">
              Subsystem Integrity
            </div>
            {STATUS_INDICATORS.map(({ label, status, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-[#0F172A] border border-slate-800/80 rounded-xl px-3.5 py-2"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-mono text-slate-300 flex-1">{label}</span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-wider">
                  ● {status}
                </span>
              </div>
            ))}
          </div>

          {/* Compliance Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="text-[9px] font-mono px-2.5 py-1 rounded-md bg-[#0F172A] border border-slate-800 text-slate-400 tracking-wider"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 right-8 text-[10px] font-mono text-slate-500 tracking-widest">
          NTRO CYBER AUDIT COMPLIANT
        </div>
        <div className="absolute bottom-6 left-8 text-[10px] font-mono text-slate-500 tracking-widest">
          ENCRYPTION: AES-256-GCM
        </div>
      </div>

      {/* Right Panel — Login Card */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative bg-[#080C14]">
        <div className="relative z-10 w-full max-w-md">
          <div className="relative bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

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
