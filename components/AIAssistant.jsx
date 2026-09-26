'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Send,
  Bot,
  Shield,
  Zap,
  ChevronRight,
  Loader2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

const QUICK_CHIPS = [
  {
    label: 'Explain CVE-2026-1102 Impact',
    query: 'Explain Critical CVE-2026-1102 Impact and remediation steps',
    icon: '🔴',
    navigateTo: null,
  },
  {
    label: 'Remediate HSTS & CSP Headers',
    query: 'Remediate Missing HSTS and CSP Headers with exact configuration',
    icon: '🛡️',
    navigateTo: 'vulnerability-matrix',
  },
  {
    label: 'Analyze BOLA / IDOR Scope',
    query: 'Analyze BOLA IDOR Vulnerability Scope and exploitation vectors',
    icon: '🔓',
    navigateTo: 'vulnerability-matrix',
  },
  {
    label: 'MITRE ATT&CK T1190 Vectors',
    query: 'Show Active MITRE ATT&CK T1190 exploitation vectors and defenses',
    icon: '🗺️',
    navigateTo: 'world-monitor',
  },
];

const TYPING_DELAY = 18;

export default function AIAssistant({ scanId, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "👋 **Sentinel AI Security Assistant** online.\n\nI have real-time access to your scan findings. Ask me about vulnerabilities, MITRE ATT&CK mappings, OWASP frameworks, or select a quick-action chip below.",
      timestamp: new Date().toISOString(),
      type: 'welcome',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (queryText) => {
      const text = (queryText || input).trim();
      if (!text || isLoading) return;

      setInput('');
      const userMsg = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await fetch('/api/ai-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: text, scanId: scanId || null }),
        });

        const data = await res.json();
        const aiMsg = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.response || 'Unable to process request.',
          timestamp: new Date().toISOString(),
          type: data.type,
          confidence: data.confidence,
          navigateTo: data.navigateTo,
          contextLoaded: data.contextLoaded,
        };
        setMessages((prev) => [...prev, aiMsg]);

        if (!isOpen) setHasUnread(true);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content:
              '⚠️ Connection error. The assistant is offline. Check your network and retry.',
            timestamp: new Date().toISOString(),
            type: 'error',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, isOpen, scanId]
  );

  const handleChip = useCallback(
    (chip) => {
      if (chip.navigateTo && onNavigate) {
        const clean = chip.navigateTo.replace(/^\//, '');
        onNavigate(clean === 'executive-report' ? 'export' : clean);
      }
      sendMessage(chip.query);
    },
    [onNavigate, sendMessage]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderContent = (content) => {
    // Basic markdown-like rendering
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('## '))
          return (
            <div key={i} className="font-bold text-emerald-400 text-sm mb-1">
              {line.replace('## ', '')}
            </div>
          );
        if (line.startsWith('### '))
          return (
            <div key={i} className="font-semibold text-slate-200 text-xs mt-2 mb-0.5">
              {line.replace('### ', '')}
            </div>
          );
        if (line.startsWith('**') && line.endsWith('**'))
          return (
            <div key={i} className="font-bold text-slate-100 text-xs">
              {line.replace(/\*\*/g, '')}
            </div>
          );
        if (line.startsWith('```') || line.endsWith('```'))
          return null;
        if (line.startsWith('• ') || line.startsWith('- '))
          return (
            <div key={i} className="flex gap-1.5 text-xs text-slate-300">
              <span className="text-emerald-400 mt-0.5">›</span>
              <span>{line.replace(/^[•\-]\s/, '').replace(/\*\*/g, '')}</span>
            </div>
          );
        if (line.startsWith('`') && line.endsWith('`'))
          return (
            <code key={i} className="text-[10px] font-mono bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-emerald-400 block my-0.5">
              {line.replace(/`/g, '')}
            </code>
          );
        if (!line.trim()) return <div key={i} className="h-1.5" />;
        return (
          <div key={i} className="text-xs text-slate-300 leading-relaxed">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      })
      .filter(Boolean);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/30 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_45px_rgba(16,185,129,0.55)] transition-all flex items-center justify-center group"
        title="Sentinel AI Assistant"
      >
        <Bot className="w-6 h-6 text-white" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" />
        )}
        <span className="absolute -top-8 right-0 text-[10px] font-mono text-emerald-400 bg-slate-950/90 border border-emerald-500/20 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Assistant
        </span>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed right-6 z-[85] bg-[#0b0f17] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized
              ? 'bottom-24 w-72 h-14'
              : 'bottom-24 w-96 h-[580px]'
          }`}
          style={{ boxShadow: '0 0 60px rgba(0,0,0,0.8), 0 0 30px rgba(16,185,129,0.08)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/50 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-7 h-7 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-white">SENTINEL AI</div>
                <div className="text-[10px] font-mono text-emerald-400">
                  {scanId ? '● Context loaded' : '○ No active scan'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-emerald-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2.5 space-y-1 ${
                        msg.role === 'user'
                          ? 'bg-emerald-600/20 border border-emerald-500/25 text-right'
                          : 'bg-slate-900/80 border border-slate-800'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-xs text-slate-200">{msg.content}</p>
                      ) : (
                        <div className="space-y-1">{renderContent(msg.content)}</div>
                      )}
                      {msg.navigateTo && onNavigate && (
                        <button
                          onClick={() => {
                            const clean = msg.navigateTo.replace(/^\//, '');
                            onNavigate(clean === 'executive-report' ? 'export' : clean);
                          }}
                          className="mt-1.5 flex items-center gap-1 text-[10px] font-mono text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 bg-emerald-500/10 rounded px-2 py-0.5 transition-colors"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          Navigate to /{msg.navigateTo.replace(/^\//, '')}
                        </button>
                      )}
                      {msg.contextLoaded && (
                        <div className="text-[9px] font-mono text-slate-600 flex items-center gap-1 mt-1">
                          <Zap className="w-2 h-2 text-emerald-600" />
                          Live scan context applied
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Bot className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2.5 flex items-center gap-2">
                      <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />
                      <span className="text-[10px] font-mono text-slate-500">Analyzing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Chips */}
              <div className="px-3 py-2 border-t border-slate-800/60 shrink-0">
                <div className="text-[9px] font-mono text-slate-600 mb-1.5 uppercase tracking-wider">Quick Actions</div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => handleChip(chip)}
                      disabled={isLoading}
                      className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-emerald-300 bg-slate-900/60 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 rounded-lg px-2 py-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{chip.icon}</span>
                      <span className="hidden sm:inline">{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="px-3 py-2.5 border-t border-slate-800 bg-slate-950/40 shrink-0">
                <div className="flex gap-2 items-end">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about vulnerabilities, CVEs, MITRE..."
                    rows={1}
                    className="flex-1 bg-slate-900/80 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none resize-none transition-colors"
                    style={{ minHeight: '36px', maxHeight: '80px' }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="w-9 h-9 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl flex items-center justify-center transition-all shrink-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                </div>
                <div className="text-[9px] font-mono text-slate-700 mt-1.5 text-center">
                  Press Enter to send • Shift+Enter for newline
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
