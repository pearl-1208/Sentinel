/**
 * URL Parser & SSRF Protection Utility for Sentinel
 * Normalizes URLs, strips query params/hash fragments, and checks for restricted IPs.
 */

const BLOCKED_HOSTS = [
  '169.254.169.254', // AWS/GCP Instance Metadata
  'metadata.google.internal',
  '100.100.100.200', // Alibaba Cloud Metadata
];

export function parseAndNormalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Target URL must be a non-empty string');
  }

  let trimmed = rawUrl.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'http://' + trimmed;
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch (err) {
    throw new Error(`Invalid URL format: ${rawUrl}`);
  }

  // SSRF validation
  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTS.includes(hostname)) {
    throw new Error(`Target host '${hostname}' is restricted by SSRF protection policy`);
  }

  // Strip query parameters and hash fragments for standard security audit target normalization
  parsed.search = '';
  parsed.hash = '';

  let normalizedUrl = parsed.toString().replace(/\/+$/, '');
  return {
    normalizedUrl,
    hostname: parsed.hostname,
    port: parsed.port || (parsed.protocol === 'https:' ? '443' : '80'),
    protocol: parsed.protocol,
    pathname: parsed.pathname || '/',
  };
}
