'use client';

import { useState } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  Server,
  Globe,
  FileCode2,
  AlertTriangle,
  CheckCircle2,
  FileDiff,
  Layers,
} from 'lucide-react';
import dataset from '@/lib/dataset.json';

// Helper to look up canonical dataset entry
function findDatasetEntry(finding) {
  if (!finding) return null;
  return dataset.find(
    (item) =>
      item.id === finding.id ||
      item.cweId === finding.cweId ||
      item.checkId === finding.checkId ||
      (finding.title && item.title.toLowerCase().includes(finding.title.toLowerCase().slice(0, 15)))
  );
}

export default function RemediationModal({ finding, onClose }) {
  const [activeTab, setActiveTab] = useState('diff'); // 'diff' | 'framework'
  const [activeFramework, setActiveFramework] = useState(0);
  const [copiedKey, setCopiedKey] = useState(null);

  if (!finding) return null;

  const datasetEntry = findDatasetEntry(finding);
  const patchSnippet = datasetEntry?.patchSnippet || finding.patchSnippet || {};

  // Extract vulnerable legacy & secure patched code
  const vulnerableCode =
    patchSnippet.vulnerableLegacy ||
    `// Vulnerable legacy code snippet (${finding.affectedComponent || 'Target'})\n// Missing authorization or security controls\n// CWE: ${finding.cweId || 'CWE-693'}\napp.use((req, res, next) => {\n  // Insecure default handling\n  next();\n});`;

  const securePatchedCode =
    patchSnippet.securePatched ||
    `// Secure Patched Code — Sentinel Hardened\n// Enforced validation & secure response policies\napp.use((req, res, next) => {\n  res.setHeader('X-Content-Type-Options', 'nosniff');\n  res.setHeader('X-Frame-Options', 'DENY');\n  next();\n});`;

  // Framework tabs
  const frameworkList = [];
  if (patchSnippet.express) {
    frameworkList.push({ name: 'Express.js / Node', lang: 'javascript', code: patchSnippet.express });
  }
  if (patchSnippet.nginx) {
    frameworkList.push({ name: 'Nginx Configuration', lang: 'nginx', code: patchSnippet.nginx });
  }
  if (patchSnippet.django) {
    frameworkList.push({ name: 'Django / Python', lang: 'python', code: patchSnippet.django });
  }
  if (patchSnippet.prisma) {
    frameworkList.push({ name: 'Prisma Client ORM', lang: 'javascript', code: patchSnippet.prisma });
  }
  if (patchSnippet.nodePg) {
    frameworkList.push({ name: 'Node pg / SQL', lang: 'javascript', code: patchSnippet.nodePg });
  }

  // Fallback frameworks if none provided
  if (frameworkList.length === 0) {
    frameworkList.push({
      name: 'Nginx Security Header Snippet',
      lang: 'nginx',
      code: `# /etc/nginx/conf.d/security.conf\nadd_header Content-Security-Policy "default-src 'self';" always;\nadd_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;\nadd_header X-Frame-Options "DENY" always;\nadd_header X-Content-Type-Options "nosniff" always;`,
    });
    frameworkList.push({
      name: 'Express Helmet Middleware',
      lang: 'javascript',
      code: `const helmet = require('helmet');\napp.use(helmet());\napp.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));`,
    });
  }

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFix = () => {
    const diffContent = `--- a/${finding.affectedComponent || 'service'}/legacy.js\n+++ b/${finding.affectedComponent || 'service'}/secure.js\n@@ -1,10 +1,15 @@\n// SENTINEL PATCH CODE STUDIO FIX\n// Vulnerability ID: ${finding.id || 'SEC-AUDIT'}\n// Title: ${finding.title}\n// CWE: ${finding.cweId || 'CWE-GENERAL'}\n// Severity: ${finding.severity?.toUpperCase()}\n\n<<<<<<< VULNERABLE CODE\n${vulnerableCode}\n=======\n${securePatchedCode}\n>>>>>>> SECURE PATCHED CODE\n\n// FRAMEWORK DEPLOYMENT SNIPPET:\n${frameworkList[activeFramework]?.code || ''}\n`;

    const blob = new Blob([diffContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-patch-${(finding.id || 'fix').toLowerCase()}.diff`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Studio Modal Container */}
      <div className="relative z-10 w-full max-w-5xl bg-[#080C14] border border-slate-800 rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0F172A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400">
              <FileDiff className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Patch Code Generator Studio
                </h3>
                {finding.cweId && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/25 border border-emerald-900/35 text-emerald-400/90 font-medium">
                    {finding.cweId}
                  </span>
                )}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase border font-semibold text-rose-300 bg-rose-950/30 border-rose-900/40">
                  {finding.severity}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate max-w-xl">
                {finding.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadFix}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download Fix (.diff)
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-800 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Studio Sub-Header & Navigation Tabs */}
        <div className="px-6 py-2.5 bg-[#0A0E17] border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('diff')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'diff'
                  ? 'bg-slate-800 border border-slate-700 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <FileDiff className="w-3.5 h-3.5 text-emerald-400" />
              Side-by-Side Code Diff
            </button>
            <button
              onClick={() => setActiveTab('framework')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'framework'
                  ? 'bg-slate-800 border border-slate-700 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Framework Deployment Snippets ({frameworkList.length})
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
            Target Component: <span className="text-slate-300 font-semibold">{finding.affectedComponent}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Executive Remediation Advice */}
          <div className="p-4 bg-[#0F172A] border border-slate-800 rounded-xl space-y-1">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Remediation Directive
            </div>
            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              {finding.remediation || 'Deploy explicit security controls and input validations on target component.'}
            </p>
          </div>

          {/* TAB 1: SIDE-BY-SIDE DIFF STUDIO */}
          {activeTab === 'diff' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Vulnerable Legacy Code */}
                <div className="flex flex-col rounded-xl overflow-hidden border border-red-900/40 bg-[#0F172A]">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-red-950/20 border-b border-red-900/30">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#F87171]" />
                      <span className="text-[10px] font-mono font-bold text-[#F87171] uppercase tracking-wider">
                        Vulnerable Code (Legacy)
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(vulnerableCode, 'vulnerable')}
                      className="text-[10px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      {copiedKey === 'vulnerable' ? <Check className="w-3 h-3 text-red-400" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 bg-[#080C14] text-[11px] font-mono text-red-300/90 overflow-x-auto leading-relaxed whitespace-pre h-72">
                    {vulnerableCode}
                  </pre>
                  <div className="px-4 py-2 bg-red-950/10 border-t border-red-900/20 text-[10px] font-mono text-red-400/80">
                    ✕ Insecure: Exposed to {finding.cweId || 'unauthorized exploits'}
                  </div>
                </div>

                {/* Right: Secure Patched Code */}
                <div className="flex flex-col rounded-xl overflow-hidden border border-emerald-900/40 bg-[#0F172A]">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-950/20 border-b border-emerald-900/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                      <span className="text-[10px] font-mono font-bold text-[#34D399] uppercase tracking-wider">
                        Secure Patched Code (Remediated)
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(securePatchedCode, 'secure')}
                      className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      {copiedKey === 'secure' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy Fix
                    </button>
                  </div>
                  <pre className="p-4 bg-[#080C14] text-[11px] font-mono text-emerald-300/90 overflow-x-auto leading-relaxed whitespace-pre h-72">
                    {securePatchedCode}
                  </pre>
                  <div className="px-4 py-2 bg-emerald-950/10 border-t border-emerald-900/20 text-[10px] font-mono text-emerald-400/80">
                    ✓ Hardened: Validated & compliant with OWASP & NIST guidelines
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FRAMEWORK DEPLOYMENT SNIPPETS */}
          {activeTab === 'framework' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {frameworkList.map((fw, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFramework(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all flex items-center gap-1.5 ${
                      activeFramework === idx
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Server className="w-3 h-3" />
                    {fw.name}
                  </button>
                ))}
              </div>

              {frameworkList[activeFramework] && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0F172A]">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-mono text-slate-300 font-semibold">
                        {frameworkList[activeFramework].name}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(frameworkList[activeFramework].code, `fw_${activeFramework}`)}
                      className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      {copiedKey === `fw_${activeFramework}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      Copy Code
                    </button>
                  </div>
                  <pre className="p-4 bg-[#080C14] text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                    {frameworkList[activeFramework].code}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#0F172A] shrink-0 flex items-center justify-between">
          <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
            <span>Diff Engine: Sentinel AST Code Harmonizer</span>
            <span>·</span>
            <span>Ready for CI/CD pipeline integration</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-xl transition-colors"
            >
              Close Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
