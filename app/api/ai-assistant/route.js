import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma.js';

// Domain-specific security knowledge base for offline fallback
const SECURITY_KNOWLEDGE = {
  'cve-2026-1102': {
    title: 'CVE-2026-1102 — Critical RCE via Deserialization',
    detail: 'CVE-2026-1102 is a critical remote code execution vulnerability (CVSS 9.8) affecting Java deserialization workflows in enterprise middleware. Attackers craft malicious serialized payloads delivered via HTTP POST bodies or JMS queues. Exploitation allows arbitrary OS command execution without authentication. Affected products: Apache ActiveMQ < 5.17.4, Spring Boot < 3.1.2. Immediate mitigation: disable ObjectInputStream, apply vendor patches, implement allowlist-based deserialization filters.',
    mitre: 'T1059.007 (Command and Scripting Interpreter: JavaScript) / T1190 (Exploit Public-Facing Application)',
    owasp: 'A8:2021 — Software and Data Integrity Failures',
    remediation: 'Apply vendor security patches immediately. Implement Java SecurityManager deserialization filters. Deploy WAF rules blocking serialized Java object Content-Type headers.',
  },
  hsts: {
    title: 'Missing HTTP Strict-Transport-Security (HSTS)',
    detail: 'HSTS instructs browsers to only communicate via HTTPS. Without it, SSL-stripping MitM attacks (SSLstrip) can silently downgrade connections to HTTP, exposing credentials and session tokens.',
    mitre: 'T1557 (Adversary-in-the-Middle)',
    owasp: 'A02:2021 — Cryptographic Failures',
    remediation: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
  },
  csp: {
    title: 'Missing Content-Security-Policy (CSP)',
    detail: 'CSP prevents XSS by defining trusted content sources. Without it, any injected script executes in the context of the origin, enabling data exfiltration, credential theft, and keylogging.',
    mitre: 'T1059.007 (JavaScript Injection)',
    owasp: 'A03:2021 — Injection',
    remediation: "Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';",
  },
  bola: {
    title: 'Broken Object Level Authorization (BOLA/IDOR)',
    detail: 'BOLA (OWASP API1:2023) allows attackers to access resources belonging to other users by manipulating object IDs in API requests. Example: /api/users/123/data → /api/users/124/data bypasses authorization.',
    mitre: 'T1078 (Valid Accounts) / T1565 (Data Manipulation)',
    owasp: 'OWASP API Security Top 10 — API1:2023 Broken Object Level Authorization',
    remediation: 'Implement server-side ownership validation for every object access. Never rely on client-supplied IDs without authorization checks against the authenticated session.',
  },
  't1190': {
    title: 'MITRE ATT&CK T1190 — Exploit Public-Facing Application',
    detail: 'Adversaries exploit vulnerabilities in internet-facing applications (web servers, CMS, APIs) to gain initial access. Common vectors: SQL injection, deserialization flaws, path traversal, XXE, and unpatched CVEs.',
    mitre: 'T1190 (Exploit Public-Facing Application)',
    owasp: 'A06:2021 — Vulnerable and Outdated Components',
    remediation: 'Continuous vulnerability scanning, patch management SLA (critical: 24h), WAF deployment, and input validation across all API endpoints.',
  },
};

function matchKnowledge(query) {
  const q = query.toLowerCase();
  if (q.includes('cve-2026-1102') || q.includes('cve2026')) return SECURITY_KNOWLEDGE['cve-2026-1102'];
  if (q.includes('hsts') || q.includes('strict-transport')) return SECURITY_KNOWLEDGE['hsts'];
  if (q.includes('csp') || q.includes('content-security')) return SECURITY_KNOWLEDGE['csp'];
  if (q.includes('bola') || q.includes('idor') || q.includes('broken object')) return SECURITY_KNOWLEDGE['bola'];
  if (q.includes('t1190') || q.includes('public-facing')) return SECURITY_KNOWLEDGE['t1190'];
  return null;
}

function buildContextSummary(scanContext) {
  if (!scanContext?.findings?.length) return '';

  const { findings, scan } = scanContext;
  const critical = findings.filter((f) => f.severity === 'critical').length;
  const high = findings.filter((f) => f.severity === 'high').length;
  const medium = findings.filter((f) => f.severity === 'medium').length;
  const low = findings.filter((f) => f.severity === 'low').length;

  const topFindings = findings
    .slice(0, 5)
    .map((f) => `- [${f.severity?.toUpperCase()}] ${f.title} (${f.cweId || 'CWE-693'})`)
    .join('\n');

  return `
LIVE SCAN CONTEXT (Scan ID: ${scan?.id?.slice(0, 12) || 'N/A'}):
Target: ${scan?.targetUrl || 'Unknown'}
Risk Profile: Critical(${critical}) High(${high}) Medium(${medium}) Low(${low})
Top Findings:
${topFindings}
Total vulnerabilities: ${findings.length}
`;
}

function generateResponse(query, knowledge, contextSummary) {
  const q = query.toLowerCase();

  if (knowledge) {
    return {
      response: `## ${knowledge.title}\n\n${knowledge.detail}\n\n**MITRE ATT&CK:** \`${knowledge.mitre}\`\n**OWASP:** ${knowledge.owasp}\n\n### Remediation\n\`\`\`\n${knowledge.remediation}\n\`\`\``,
      type: 'knowledge',
      confidence: 'high',
      navigateTo: q.includes('bola') || q.includes('idor')
        ? '/vulnerability-matrix'
        : q.includes('t1190') || q.includes('mitre')
        ? '/world-monitor'
        : null,
    };
  }

  if (contextSummary) {
    if (q.includes('critical') || q.includes('most severe') || q.includes('worst')) {
      return {
        response: `Based on your current scan assessment:\n\n${contextSummary}\n\n**Recommendation:** Address critical and high severity findings immediately. Critical vulnerabilities represent active exploitation risk and should be remediated within 24 hours per enterprise SLA standards.`,
        type: 'context-analysis',
        confidence: 'high',
      };
    }
    if (q.includes('remediat') || q.includes('fix') || q.includes('patch')) {
      return {
        response: `**Remediation Priority Matrix (Based on Active Scan):**\n\n${contextSummary}\n\n**Suggested Action Plan:**\n1. 🔴 **Critical/High:** Deploy patches within 24-48h\n2. 🟡 **Medium:** Schedule remediation sprint within 2 weeks\n3. 🟢 **Low:** Include in next quarterly hardening cycle\n\nNavigate to the Vulnerability Matrix tab for detailed per-finding remediation scripts.`,
        type: 'remediation-guidance',
        confidence: 'high',
        navigateTo: '/vulnerability-matrix',
      };
    }
    if (q.includes('summary') || q.includes('overview') || q.includes('report')) {
      return {
        response: `**Assessment Summary:**\n\n${contextSummary}\n\nReview the Executive Report tab for CISO-ready documentation with full CVE/CWE mapping, compliance checklist, and formal sign-off blocks.`,
        type: 'summary',
        confidence: 'high',
        navigateTo: '/executive-report',
      };
    }
  }

  // Generic security assistant response
  const genericResponses = {
    'owasp': '**OWASP Top 10 (2021)** covers: A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, A04 Insecure Design, A05 Security Misconfiguration, A06 Vulnerable Components, A07 Authentication Failures, A08 Software Integrity Failures, A09 Logging Failures, A10 SSRF. Run a Sentinel scan to automatically check your target against these vectors.',
    'cors': '**CORS Misconfiguration** (CWE-942): Overly permissive Cross-Origin Resource Sharing allows unauthorized domains to make authenticated API requests. Sentinel checks for wildcard origins (`*`) combined with credentials. Fix: implement an explicit origin whitelist on your API gateway.',
    'sql': '**SQL Injection** (CWE-89, OWASP A03): Unsanitized user input concatenated into SQL queries allows attackers to exfiltrate, modify, or delete database content. Use parameterized queries or ORM-based abstractions exclusively. Never construct SQL via string interpolation.',
    'xss': '**Cross-Site Scripting** (CWE-79, OWASP A03): Injected malicious scripts execute in victim browsers under the target origin. Primary mitigations: CSP headers, output encoding, and DOMPurify for HTML rendering. Sentinel checks for missing CSP headers as a leading indicator.',
  };

  for (const [keyword, resp] of Object.entries(genericResponses)) {
    if (q.includes(keyword)) {
      return { response: resp, type: 'knowledge', confidence: 'medium' };
    }
  }

  return {
    response: `I'm the Sentinel AI Security Assistant. I can help you:\n\n• **Analyze findings** from your current scan\n• **Explain CVEs** and vulnerability impact\n• **Map threats** to MITRE ATT\&CK and OWASP frameworks\n• **Generate remediation** guidance and code snippets\n\nTry asking: *"Explain the critical findings"*, *"How do I fix the CORS issue?"*, or *"Show me MITRE T1190 vectors"*.`,
    type: 'help',
    confidence: 'low',
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, scanId, chipAction } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    // Load live scan context if scanId provided
    let scanContext = null;
    if (scanId) {
      try {
        const scan = await prisma.scan.findUnique({
          where: { id: scanId },
          include: {
            findings: {
              orderBy: [{ severity: 'asc' }, { createdAt: 'asc' }],
            },
          },
        });
        if (scan) {
          scanContext = {
            scan: {
              id: scan.id,
              targetUrl: scan.targetUrl,
              status: scan.status,
              startedAt: scan.startedAt,
            },
            findings: scan.findings.map((f) => ({
              id: f.id,
              title: f.title,
              severity: f.severity,
              category: f.category,
              cweId: f.cweId,
              affectedComponent: f.affectedComponent,
            })),
          };
        }
      } catch (dbErr) {
        // Continue without context
      }
    }

    const knowledge = matchKnowledge(query);
    const contextSummary = buildContextSummary(scanContext);
    const result = generateResponse(query, knowledge, contextSummary);

    return NextResponse.json({
      success: true,
      query,
      response: result.response,
      type: result.type,
      confidence: result.confidence,
      navigateTo: result.navigateTo || null,
      contextLoaded: !!scanContext,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Assistant error:', error);
    return NextResponse.json(
      {
        success: false,
        response: '⚠️ The AI Security Assistant is currently in offline fallback mode. For immediate vulnerability guidance, please refer to the Vulnerability Matrix or select one of the quick-action chips.',
        type: 'fallback',
        confidence: 'low',
        error: error.message,
      },
      { status: 200 }
    );
  }
}
