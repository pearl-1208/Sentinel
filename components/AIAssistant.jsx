'use client';

import { useState } from 'react';
import { Bot, X, Send, Loader2, Sparkles, MessageSquare } from 'lucide-react';

export default function AIAssistant({ scanContext }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Greetings. I am the Sentinel Security Operations AI Assistant. Ask me about critical vulnerabilities, remediation procedures, or CWE compliance.',
    },
  ]);

  const handleSend = async (promptText) => {
    const textToSend = promptText || input;
    if (!textToSend.trim()) return;

    const userMsg = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, scanContext }),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data.data.reply },
        ]);
      } else {
        throw new Error(data?.error?.message || 'Failed to query assistant');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Summarize scan findings',
    'How do I fix missing CSP?',
    'Remediation for CORS policy',
    'Explain Cookie security flags',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[80] select-none no-print">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl shadow-xl transition-all flex items-center gap-2 group font-mono text-xs font-bold"
        >
          <Bot className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">AI Security Assistant</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-[#0b0f17] border border-[#1f2937] rounded-2xl shadow-2xl flex flex-col h-[480px] overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Chat Header */}
          <div className="p-4 bg-[#111827] border-b border-[#1f2937] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  Sentinel Copilot
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-[10px] font-mono text-slate-400">Contextual Audit Assistant</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg border border-[#1f2937] text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message List */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 font-mono text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl border leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-[#111827] border-[#1f2937] text-slate-300'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 bg-[#111827] border border-[#1f2937] rounded-xl text-slate-400 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Analyzing context...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 border-t border-[#1f2937] bg-[#080c14] flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 bg-[#111827] border border-[#1f2937] hover:border-emerald-500/40 text-[10px] font-mono text-slate-300 rounded-lg whitespace-nowrap transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[#1f2937] bg-[#0d121c] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask security assistant..."
              className="flex-1 bg-[#111827] border border-[#1f2937] rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 rounded-xl transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
