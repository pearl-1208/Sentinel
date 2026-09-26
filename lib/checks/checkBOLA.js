/**
 * Check: checkBOLA
 * Broken Object Level Authorization (BOLA / IDOR) Detection Engine
 * 
 * OWASP API Security Top 10 - API1:2023
 * Attempts cross-user resource access patterns using User A and User B credentials.
 * Maps to MITRE ATT&CK T1078 (Valid Accounts) and CWE-639 (Authorization Bypass Through User-Controlled Key).
 */

const BOLA_TEST_PATHS = [
  '/api/users/{id}',
  '/api/profile',
  '/api/account',
  '/api/orders',
  '/api/documents',
  '/api/files',
  '/api/data',
  '/api/settings',
];

export const checkBOLA = {
  id: 'checkBOLA',
  category: 'access-control',

  async run(ctx) {
    const { targetUrl, credentials } = ctx;
    const findings = [];

    const userA = credentials?.userA;
    const userB = credentials?.userB;

    // Only run full BOLA cross-check if both credentials are provided
    if (!userA?.username || !userB?.username) {
      // Single-user mode: check for unauthenticated access to protected endpoints
      try {
        const testPaths = ['/api/users/1', '/api/profile', '/api/account', '/api/orders/1'];
        const baseUrl = targetUrl.replace(/\/$/, '');

        for (const path of testPaths.slice(0, 3)) {
          try {
            const response = await fetch(`${baseUrl}${path}`, {
              method: 'GET',
              headers: {
                'User-Agent': 'Sentinel-Security-Scanner/3.0',
                'Accept': 'application/json',
              },
            });

            // If we get 200 without auth, potential unauthenticated object access
            if (response.status === 200) {
              const contentType = response.headers.get('content-type') || '';
              if (contentType.includes('application/json')) {
                findings.push({
                  checkId: 'checkBOLA',
                  category: 'access-control',
                  title: 'Potential Unauthenticated Object Access (BOLA Risk)',
                  description: `The endpoint ${path} returned HTTP 200 without any authentication headers. If this endpoint serves user-specific data, it represents an unauthenticated BOLA/IDOR vulnerability. Provide User A and User B credentials for cross-user BOLA verification.`,
                  affectedComponent: `${baseUrl}${path}`,
                  severity: 'high',
                  referenceScore: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
                  cweId: 'CWE-639',
                  confidence: 'needs-review',
                  evidence: JSON.stringify({
                    url: `${baseUrl}${path}`,
                    method: 'GET',
                    responseStatus: response.status,
                    contentType,
                    authProvided: false,
                    note: 'BOLA cross-user test requires both User A and User B credentials.',
                  }),
                  stepsToReproduce: `1. Send GET request to ${baseUrl}${path} without authentication.\n2. Observe HTTP 200 response with data payload.\n3. Confirm response contains user-specific or object-level data.`,
                  businessImpact: 'Unauthenticated access to user data resources enables mass data extraction without any account credentials.',
                  remediation: 'Enforce authentication middleware on all data endpoints. Validate that the authenticated user owns the requested resource before returning data.',
                });
                break; // Avoid duplicate findings per scan
              }
            }
          } catch (pathErr) {
            // Path not available, continue
          }
        }
      } catch (err) {
        // Silent fail for BOLA check
      }

      return findings;
    }

    // Full dual-credential BOLA test
    try {
      const baseUrl = targetUrl.replace(/\/$/, '');

      // Step 1: Authenticate User A — attempt basic auth or form login
      let tokenA = null;
      let tokenB = null;

      const loginAttempt = async (user) => {
        try {
          const res = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Sentinel-Security-Scanner/3.0',
            },
            body: JSON.stringify({ username: user.username, password: user.password }),
          });
          if (res.ok) {
            const data = await res.json();
            return data.token || data.accessToken || data.jwt || null;
          }
        } catch (e) {
          // Try alternate path
        }
        return null;
      };

      tokenA = await loginAttempt(userA);
      tokenB = await loginAttempt(userB);

      if (tokenA && tokenB) {
        // Step 2: Get User A's resource IDs
        const resourceRes = await fetch(`${baseUrl}/api/users/${userA.username}/resources`, {
          headers: {
            'Authorization': `Bearer ${tokenA}`,
            'User-Agent': 'Sentinel-Security-Scanner/3.0',
          },
        });

        if (resourceRes.ok) {
          const resourceData = await resourceRes.json();
          const resourceIds = (resourceData?.data || resourceData?.items || []).map((r) => r.id).slice(0, 3);

          // Step 3: Try to access User A's resources with User B's token
          for (const resourceId of resourceIds) {
            const testRes = await fetch(`${baseUrl}/api/resources/${resourceId}`, {
              headers: {
                'Authorization': `Bearer ${tokenB}`,
                'User-Agent': 'Sentinel-Security-Scanner/3.0',
              },
            });

            if (testRes.status === 200) {
              findings.push({
                checkId: 'checkBOLA',
                category: 'access-control',
                title: `CONFIRMED BOLA: Cross-User Object Access Detected (Resource ID: ${resourceId})`,
                description: `User B (${userB.username}) successfully accessed a resource owned by User A (${userA.username}) with ID '${resourceId}'. The server returned HTTP 200, confirming that object-level authorization is not enforced per-user. This is a critical Broken Object Level Authorization vulnerability (OWASP API1:2023).`,
                affectedComponent: `${baseUrl}/api/resources/${resourceId}`,
                severity: 'critical',
                referenceScore: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N',
                cweId: 'CWE-639',
                confidence: 'confirmed',
                evidence: JSON.stringify({
                  ownerUser: userA.username,
                  accessorUser: userB.username,
                  resourceId,
                  endpoint: `${baseUrl}/api/resources/${resourceId}`,
                  responseStatus: testRes.status,
                  authMethod: 'JWT Bearer Token',
                  violationType: 'Cross-user object access without ownership verification',
                }),
                stepsToReproduce: `1. Authenticate as ${userA.username} and record resource ID '${resourceId}'.\n2. Authenticate as ${userB.username} and obtain JWT token.\n3. Send GET request to /api/resources/${resourceId} with User B's JWT.\n4. Observe HTTP 200 with User A's data returned.`,
                businessImpact: 'Any authenticated user can access and potentially modify another user\'s data by simply incrementing or guessing object identifiers. This enables complete horizontal privilege escalation across all user accounts.',
                remediation: 'Implement server-side ownership validation: before returning any resource, verify that the authenticated user\'s ID matches the resource\'s owner ID. Use opaque UUIDs (not sequential integers) for resource identifiers.',
              });
            }
          }
        }
      } else {
        // Credentials provided but auth endpoint not standard - report for manual verification
        findings.push({
          checkId: 'checkBOLA',
          category: 'access-control',
          title: 'BOLA Engine: Manual Cross-User Verification Required',
          description: `Credentials for User A (${userA.username}) and User B (${userB.username}) were provided but the scanner could not automatically authenticate via standard /api/auth/login. Manual BOLA cross-user testing is recommended using these credential pairs against all authenticated API endpoints.`,
          affectedComponent: `${baseUrl}/api/auth/login`,
          severity: 'medium',
          referenceScore: 'N/A',
          cweId: 'CWE-639',
          confidence: 'needs-review',
          evidence: JSON.stringify({
            userAProvided: !!userA.username,
            userBProvided: !!userB.username,
            loginEndpointTested: `${baseUrl}/api/auth/login`,
            recommendation: 'Manually test cross-user resource access using provided credential pairs.',
          }),
          stepsToReproduce: `1. Obtain JWT for ${userA.username}.\n2. Obtain JWT for ${userB.username}.\n3. Identify resources owned by User A.\n4. Attempt to access those resources using User B's JWT.\n5. Flag any HTTP 200 responses.`,
          businessImpact: 'Unverified BOLA exposure may allow horizontal privilege escalation across user accounts.',
          remediation: 'Implement object-level ownership validation for every authenticated API endpoint that accesses user-specific data.',
        });
      }
    } catch (err) {
      // BOLA check failed gracefully
    }

    return findings;
  },
};
