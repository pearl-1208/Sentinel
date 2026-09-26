/**
 * Check: checkCorsConfig
 * Inspects Cross-Origin Resource Sharing (CORS) configurations for risky wildcard or credentials exposure.
 */

export const checkCorsConfig = {
  id: 'checkCorsConfig',
  category: 'api-config',

  async run(ctx) {
    const { targetUrl } = ctx;
    const findings = [];
    const testOrigin = 'https://evil-attacker-domain.example';

    try {
      const response = await fetch(targetUrl, {
        method: 'OPTIONS',
        headers: {
          'Origin': testOrigin,
          'Access-Control-Request-Method': 'GET',
          'User-Agent': 'Sentinel-Security-Scanner/2.0',
        },
      });

      const allowOrigin = response.headers.get('access-control-allow-origin');
      const allowCreds = response.headers.get('access-control-allow-credentials');

      // 1. Wildcard Origin with Credentials
      if (allowOrigin === '*' && allowCreds === 'true') {
        findings.push({
          checkId: 'checkCorsConfig',
          category: 'api-config',
          title: 'Wildcard CORS Origin with Credentials Enabled',
          description: 'The endpoint returns Access-Control-Allow-Origin: * while allowing credentials (Access-Control-Allow-Credentials: true). Browsers prohibit this, but misconfiguration signals risky policy intent.',
          affectedComponent: `CORS Policy (${targetUrl})`,
          severity: 'high',
          referenceScore: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:L/A:N',
          cweId: 'CWE-942',
          confidence: 'confirmed',
          evidence: JSON.stringify({
            requestOrigin: testOrigin,
            responseHeaders: {
              'access-control-allow-origin': allowOrigin,
              'access-control-allow-credentials': allowCreds,
            },
          }),
          stepsToReproduce: `Send OPTIONS request with Origin: ${testOrigin}. Note response header Access-Control-Allow-Origin: * and Access-Control-Allow-Credentials: true.`,
          businessImpact: 'Exposes API data to unauthorized cross-origin requests.',
          remediation: 'Restrict allowed origins to trusted domains explicitly instead of wildcard.',
        });
      }

      // 2. Arbitrary Origin Reflection with Credentials
      if (allowOrigin === testOrigin && allowCreds === 'true') {
        findings.push({
          checkId: 'checkCorsConfig',
          category: 'api-config',
          title: 'Arbitrary CORS Origin Reflection with Credentials',
          description: `The application dynamically reflects arbitrary request Origin headers ('${testOrigin}') in Access-Control-Allow-Origin with credentials allowed.`,
          affectedComponent: `CORS Policy (${targetUrl})`,
          severity: 'high',
          referenceScore: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:N',
          cweId: 'CWE-942',
          confidence: 'confirmed',
          evidence: JSON.stringify({
            sentOrigin: testOrigin,
            returnedAllowOrigin: allowOrigin,
            allowCredentials: allowCreds,
          }),
          stepsToReproduce: `Send HTTP request with Origin header '${testOrigin}'. Observe that server reflects the origin in Access-Control-Allow-Origin alongside Access-Control-Allow-Credentials: true.`,
          businessImpact: 'Allows malicious third-party websites to make authenticated API requests on behalf of victims.',
          remediation: 'Validate requested Origin against an explicit whitelist of trusted web domains.',
        });
      }
    } catch (err) {
      // CORS check failed gracefully
    }

    return findings;
  },
};
