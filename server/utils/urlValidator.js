const validator = require('validator');

/**
 * Normalizes a raw user-provided string into a well-formed URL.
 * - Trims whitespace
 * - Prepends https:// if no protocol is present
 * - Validates the final result
 *
 * Returns { valid: boolean, url: string|null, hostname: string|null, error: string|null }
 */
function normalizeAndValidateUrl(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') {
    return { valid: false, url: null, hostname: null, error: 'URL is required.' };
  }

  let input = rawInput.trim();

  if (input.length === 0) {
    return { valid: false, url: null, hostname: null, error: 'URL is required.' };
  }

  if (input.length > 2048) {
    return { valid: false, url: null, hostname: null, error: 'URL is too long.' };
  }

  // Prepend https:// when no protocol is present
  if (!/^https?:\/\//i.test(input)) {
    input = `https://${input}`;
  }

  const isValid = validator.isURL(input, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
    allow_underscores: true,
  });

  if (!isValid) {
    return { valid: false, url: null, hostname: null, error: 'Please enter a valid website URL.' };
  }

  try {
    const parsed = new URL(input);

    // Block obviously non-public / unsafe targets to prevent SSRF-style abuse
    const hostname = parsed.hostname.toLowerCase();
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
    const isPrivateIp = /^(10\.|172\.(1[6-9]|2\d|3[0-1])\.|192\.168\.|169\.254\.)/.test(hostname);

    if (blockedHosts.includes(hostname) || isPrivateIp) {
      return { valid: false, url: null, hostname: null, error: 'Local or private network addresses cannot be scanned.' };
    }

    return { valid: true, url: parsed.toString(), hostname: parsed.hostname, error: null };
  } catch (err) {
    return { valid: false, url: null, hostname: null, error: 'Please enter a valid website URL.' };
  }
}

module.exports = { normalizeAndValidateUrl };
