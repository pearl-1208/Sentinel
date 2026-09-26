/**
 * Check: checkInfoLeakage
 * Audits response headers for server technology and framework version disclosures.
 */

const LEAK_HEADERS = [
  { key: 'server', label: 'Server Software Disclosure', cweId: 'CWE-200', severity: 'low' },
  { key: 'x-powered-by', label: 'Framework / Technology Disclosure (X-Powered-By)', cweId: 'CWE-200', severity: 'low' },
  { key: 'x-aspnet-version', label: 'ASP.NET Version Disclosure', cweId: 'CWE-200', severity: 'medium' },
  { key: 'x-generator', label: 'CMS / Generator Disclosure', cweId: 'CWE-200', severity: 'low' },
];

export const checkInfoLeakage = {
  id: 'checkInfoLeakage',
  category: 'api-config',

  async run(ctx) {
    const { targetUrl } = ctx;
    const findings = [];

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'User-Agent': 'Sentinel-Security-Scanner/2.0' },
        redirect: 'manual',
      });

      for (const item of LEAK_HEADERS) {
        const val = response.headers.get(item.key);
        if (val) {
          findings.push({
            checkId: 'checkInfoLeakage',
            category: 'api-config',
            title: `Information Exposure via '${item.key}' Header`,
            description: `The application reveals internal backend infrastructure technology ('${val}') via the HTTP '${item.key}' response header.`,
            affectedComponent: `HTTP Header: ${item.key}`,
            severity: item.severity,
            referenceScore: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N',
            cweId: item.cweId,
            confidence: 'confirmed',
            evidence: JSON.stringify({ header: item.key, value: val }),
            stepsToReproduce: `Send GET request to ${targetUrl}. Observe presence of '${item.key}: ${val}' in response headers.`,
            businessImpact: 'Provides target system intelligence to prospective adversaries during reconnaissance.',
            remediation: `Remove or obfuscate the '${item.key}' header from reverse proxy / web server configuration.`,
          });
        }
      }
    } catch (err) {
      // Ignore network errors
    }

    return findings;
  },
};
