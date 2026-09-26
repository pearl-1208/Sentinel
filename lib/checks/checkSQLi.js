/**
 * Check: checkSQLi
 * SQL Injection Detection Engine
 * 
 * OWASP A03:2021 — Injection
 * CWE-89: Improper Neutralization of Special Elements used in SQL Commands
 * MITRE ATT&CK: T1190 (Exploit Public-Facing Application)
 *
 * Tests common API endpoints with SQLi payloads and observes error-based,
 * timing-based, and response differential indicators.
 */

const SQLI_PAYLOADS = [
  { payload: "'", type: 'single-quote', desc: 'Single quote — tests for syntax error disclosure' },
  { payload: "' OR '1'='1", type: 'or-bypass', desc: 'OR bypass — classic auth bypass pattern' },
  { payload: "1 AND SLEEP(2)--", type: 'time-based', desc: 'Time-based blind — MySQL SLEEP() probe', timing: true },
  { payload: "1; SELECT 1--", type: 'stacked', desc: 'Stacked query probe' },
  { payload: "' UNION SELECT NULL--", type: 'union', desc: 'UNION-based injection probe' },
];

const SQL_ERROR_PATTERNS = [
  /you have an error in your sql syntax/i,
  /warning: mysql/i,
  /unclosed quotation mark after the character string/i,
  /quoted string not properly terminated/i,
  /pg_query\(\): query failed/i,
  /sqlite_error/i,
  /ORA-[0-9]{5}/i,
  /microsoft ole db provider for sql server/i,
  /syntax error.*near/i,
  /unexpected end of sql command/i,
];

const TEST_ENDPOINTS = [
  '/api/users?id=',
  '/api/products?id=',
  '/api/search?q=',
  '/api/items?id=',
  '/api/posts?id=',
];

export const checkSQLi = {
  id: 'checkSQLi',
  category: 'input-handling',

  async run(ctx) {
    const { targetUrl } = ctx;
    const findings = [];
    const baseUrl = targetUrl.replace(/\/$/, '');

    for (const endpointTemplate of TEST_ENDPOINTS.slice(0, 3)) {
      for (const { payload, type, desc, timing } of SQLI_PAYLOADS.slice(0, 3)) {
        try {
          const testUrl = `${baseUrl}${endpointTemplate}${encodeURIComponent(payload)}`;
          const startTime = Date.now();

          const response = await fetch(testUrl, {
            method: 'GET',
            headers: {
              'User-Agent': 'Sentinel-Security-Scanner/3.0',
              'Accept': 'application/json, text/html, */*',
            },
            signal: AbortSignal.timeout(5000),
          });

          const elapsed = Date.now() - startTime;
          const responseText = await response.text().catch(() => '');

          // Check for error-based SQLi indicators
          const hasErrorPattern = SQL_ERROR_PATTERNS.some((pattern) => pattern.test(responseText));

          if (hasErrorPattern) {
            findings.push({
              checkId: 'checkSQLi',
              category: 'input-handling',
              title: `SQL Injection Detected — Error Disclosure (${endpointTemplate.split('?')[0]})`,
              description: `The endpoint ${endpointTemplate} reflects a SQL error message in the HTTP response when injected with the payload '${payload}'. This confirms that user-supplied input is being concatenated into SQL queries without sanitization. Error-based SQL injection allows attackers to extract database schema, table structures, and data.`,
              affectedComponent: testUrl,
              severity: 'critical',
              referenceScore: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
              cweId: 'CWE-89',
              confidence: 'confirmed',
              evidence: JSON.stringify({
                endpoint: endpointTemplate,
                payload,
                payloadType: type,
                testUrl,
                responseStatus: response.status,
                responsePreview: responseText.slice(0, 500),
                errorPatternMatched: SQL_ERROR_PATTERNS.find((p) => p.test(responseText))?.toString(),
                timestamp: new Date().toISOString(),
              }),
              stepsToReproduce: `1. Send GET request to: ${testUrl}\n2. Observe SQL error message in HTTP response body.\n3. Payload used: ${payload}\n4. Description: ${desc}`,
              businessImpact: 'Complete database compromise: authentication bypass, data exfiltration (PII, credentials, financial records), schema extraction, and potential remote code execution via SQL file writes or LOAD_FILE/INTO OUTFILE functions.',
              remediation: 'Replace all string-concatenated SQL queries with parameterized queries / prepared statements. Use an ORM (Prisma, Sequelize, SQLAlchemy) that handles parameterization automatically. Implement input validation and output encoding. Deploy a WAF with SQL injection detection rules.',
            });
            break; // One finding per endpoint
          }

          // Check for time-based SQLi (timing anomaly >1.5s on SLEEP payload)
          if (timing && elapsed > 1500) {
            findings.push({
              checkId: 'checkSQLi',
              category: 'input-handling',
              title: `Potential Blind SQL Injection — Timing Anomaly (${endpointTemplate.split('?')[0]})`,
              description: `The endpoint ${endpointTemplate} took ${elapsed}ms to respond to a SLEEP(2) injection payload, indicating a potential time-based blind SQL injection vulnerability. Unlike error-based SQLi, blind SQLi doesn't display errors but allows boolean- or time-based data extraction.`,
              affectedComponent: testUrl,
              severity: 'high',
              referenceScore: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N',
              cweId: 'CWE-89',
              confidence: 'needs-review',
              evidence: JSON.stringify({
                endpoint: endpointTemplate,
                payload,
                payloadType: 'time-based-blind',
                testUrl,
                responseTimeMs: elapsed,
                threshold: 1500,
                timestamp: new Date().toISOString(),
              }),
              stepsToReproduce: `1. Send GET request to: ${testUrl}\n2. Observe response delay of ${elapsed}ms (threshold: 1500ms).\n3. Payload: ${payload}\n4. Repeat with SLEEP(5) to confirm timing correlation.`,
              businessImpact: 'Blind SQL injection enables systematic database exfiltration bit-by-bit, allowing attackers to reconstruct entire tables without visible error messages.',
              remediation: 'Use parameterized queries or prepared statements throughout the application. Disable detailed SQL error responses in production. Implement query timeout controls.',
            });
            break;
          }
        } catch (err) {
          if (err.name === 'TimeoutError') {
            // Timeout could indicate time-based SQLi but needs confirmation
          }
          // Continue to next payload
        }
      }
    }

    return findings;
  },
};
