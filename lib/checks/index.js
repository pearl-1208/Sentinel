import { checkSecurityHeaders } from './checkSecurityHeaders.js';
import { checkCorsConfig } from './checkCorsConfig.js';
import { checkCookieSecurity } from './checkCookieSecurity.js';
import { checkInfoLeakage } from './checkInfoLeakage.js';
import { checkBOLA } from './checkBOLA.js';
import { checkSQLi } from './checkSQLi.js';

/**
 * Registry of all automated security checks.
 * Phase 3 Engine — Full security assessment suite:
 * - Security Headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
 * - CORS Configuration (wildcard, credential reflection)
 * - Cookie Security (HttpOnly, Secure, SameSite)
 * - Information Leakage (server banners, technology disclosure)
 * - BOLA / IDOR (Broken Object Level Authorization — OWASP API1:2023)
 * - SQL Injection (error-based, time-based blind — OWASP A03:2021)
 */
export const checks = [
  checkSecurityHeaders,
  checkCorsConfig,
  checkCookieSecurity,
  checkInfoLeakage,
  checkBOLA,
  checkSQLi,
];
