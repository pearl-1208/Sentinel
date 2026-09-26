import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, scanContext } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: { message: 'Prompt is required' } },
        { status: 400 }
      );
    }

    const query = prompt.toLowerCase();
    let reply = '';

    const totalFindings = scanContext?.findings?.length || 0;
    const criticals = scanContext?.findings?.filter(f => f.severity === 'critical') || [];
    const highs = scanContext?.findings?.filter(f => f.severity === 'high') || [];

    if (query.includes('summarize') || query.includes('summary') || query.includes('findings')) {
      if (totalFindings === 0) {
        reply = 'No security issues have been detected on the target endpoint. All automated Phase 2 checks passed with positive compliance.';
      } else {
        reply = `The active assessment identified ${totalFindings} security item(s): ${criticals.length} Critical, ${highs.length} High, and ${totalFindings - criticals.length - highs.length} Medium/Low finding(s). Priority remediation should focus on missing CSP headers and CORS policies.`;
      }
    } else if (query.includes('csp') || query.includes('content-security-policy')) {
      reply = 'To resolve a missing Content-Security-Policy (CSP) (CWE-693), add the HTTP response header: Content-Security-Policy: default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; frame-ancestors \'none\';. This mitigates XSS and data injection vectors.';
    } else if (query.includes('hsts') || query.includes('strict-transport-security')) {
      reply = 'To fix missing Strict-Transport-Security (HSTS) (CWE-523), configure your web server or reverse proxy to include: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload. Ensure HTTPS is active before applying.';
    } else if (query.includes('cors')) {
      reply = 'For CORS Policy misconfigurations (CWE-942), avoid returning Access-Control-Allow-Origin: * alongside Access-Control-Allow-Credentials: true. Explicitly whitelist trusted origin domains instead.';
    } else if (query.includes('cookie') || query.includes('httponly') || query.includes('secure')) {
      reply = 'For Cookie Security (CWE-1004 / CWE-614), ensure all session cookies include HttpOnly, Secure, and SameSite=Lax flags in Set-Cookie response directives.';
    } else {
      reply = `Sentinel Intelligence Assistant active. Context loaded: ${totalFindings} finding(s) on target '${scanContext?.scan?.targetUrl || 'Localhost'}'. You can ask about remediation steps, CWE classifications, or severity breakdowns.`;
    }

    return NextResponse.json({
      success: true,
      data: {
        reply,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('AI Assistant API Error:', err);
    return NextResponse.json(
      { success: false, error: { message: err.message } },
      { status: 500 }
    );
  }
}
