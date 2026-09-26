/**
 * Check: checkCookieSecurity
 * Audits Set-Cookie headers for missing Secure, HttpOnly, and SameSite security attributes.
 */

export const checkCookieSecurity = {
  id: 'checkCookieSecurity',
  category: 'session-handling',

  async run(ctx) {
    const { targetUrl } = ctx;
    const findings = [];

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'Sentinel-Security-Scanner/2.0' },
        redirect: 'manual',
      });

      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        const cookies = setCookieHeader.split(/,\s*(?=[A-Za-z0-9_%-]+=[^;]+)/);

        for (const cookieStr of cookies) {
          const parts = cookieStr.split(';').map(p => p.trim());
          const nameValue = parts[0];
          const cookieName = nameValue.split('=')[0];

          const hasHttpOnly = parts.some(p => p.toLowerCase() === 'httponly');
          const hasSecure = parts.some(p => p.toLowerCase() === 'secure');
          const hasSameSite = parts.some(p => p.toLowerCase().startsWith('samesite='));

          if (!hasHttpOnly) {
            findings.push({
              checkId: 'checkCookieSecurity',
              category: 'session-handling',
              title: `Cookie Missing HttpOnly Flag (${cookieName})`,
              description: `The cookie '${cookieName}' is set without the HttpOnly attribute, making it accessible to client-side scripts via document.cookie.`,
              affectedComponent: `Cookie: ${cookieName}`,
              severity: 'medium',
              referenceScore: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N',
              cweId: 'CWE-1004',
              confidence: 'confirmed',
              evidence: JSON.stringify({ cookie: cookieStr }),
              stepsToReproduce: `Inspect Set-Cookie header for '${cookieName}'. Note absence of HttpOnly directive.`,
              businessImpact: 'If an XSS vulnerability exists, attackers can steal session tokens directly.',
              remediation: "Append 'HttpOnly' to the Set-Cookie directive.",
            });
          }

          if (!hasSecure && targetUrl.startsWith('https:')) {
            findings.push({
              checkId: 'checkCookieSecurity',
              category: 'session-handling',
              title: `Cookie Missing Secure Flag (${cookieName})`,
              description: `The cookie '${cookieName}' lacks the Secure flag, allowing user agents to transmit it over unencrypted HTTP links.`,
              affectedComponent: `Cookie: ${cookieName}`,
              severity: 'medium',
              referenceScore: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N',
              cweId: 'CWE-614',
              confidence: 'confirmed',
              evidence: JSON.stringify({ cookie: cookieStr }),
              stepsToReproduce: `Inspect Set-Cookie header for '${cookieName}'. Note absence of Secure directive.`,
              businessImpact: 'Session cookies may be exposed over cleartext network hops.',
              remediation: "Append 'Secure' flag to Set-Cookie response header.",
            });
          }

          if (!hasSameSite) {
            findings.push({
              checkId: 'checkCookieSecurity',
              category: 'session-handling',
              title: `Cookie Missing SameSite Flag (${cookieName})`,
              description: `The cookie '${cookieName}' does not specify a SameSite attribute (Lax or Strict), increasing CSRF vulnerability.`,
              affectedComponent: `Cookie: ${cookieName}`,
              severity: 'low',
              referenceScore: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:L/A:N',
              cweId: 'CWE-1275',
              confidence: 'confirmed',
              evidence: JSON.stringify({ cookie: cookieStr }),
              stepsToReproduce: `Inspect Set-Cookie header for '${cookieName}'. Note absence of SameSite attribute.`,
              businessImpact: 'Increases exposure to cross-site request forgery attacks.',
              remediation: "Set 'SameSite=Lax' or 'SameSite=Strict' on all session cookies.",
            });
          }
        }
      }
    } catch (err) {
      // Ignore network errors for cookie check
    }

    return findings;
  },
};
