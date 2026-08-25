/**
 * Transparent, signal-based risk scoring.
 *
 * The score starts at 0 (best case) and points are ADDED for each negative
 * signal found. This keeps the logic auditable: every point on the final
 * score can be traced back to a specific check. Missing/unavailable signals
 * contribute 0 - we never penalize a site just because a provider was down,
 * but we do surface that reduced confidence to the user.
 *
 * Score bands:
 *   0-20  SAFE
 *   21-40 LOW RISK
 *   41-60 SUSPICIOUS
 *   61-80 DANGEROUS
 *   81-100 HIGH RISK
 */
function calculateRisk({ virusTotal, safeBrowsing, https, ssl, domainInfo }) {
  let score = 0;
  const reasons = [];
  let signalsAvailable = 0;
  const signalsTotal = 4; // virusTotal, safeBrowsing, https/ssl, domain age

  // --- VirusTotal signal (weight: up to 45 points) ---
  if (virusTotal?.available) {
    signalsAvailable += 1;
    const { malicious, suspicious, totalEngines } = virusTotal;
    if (totalEngines > 0) {
      const maliciousRatio = malicious / totalEngines;
      const suspiciousRatio = suspicious / totalEngines;
      const vtPoints = Math.round(maliciousRatio * 45 + suspiciousRatio * 15);
      score += vtPoints;
      if (malicious > 0) {
        reasons.push(`${malicious} security engine(s) flagged this URL as malicious.`);
      }
      if (suspicious > 0) {
        reasons.push(`${suspicious} security engine(s) flagged this URL as suspicious.`);
      }
    }
  }

  // --- Google Safe Browsing signal (weight: up to 35 points) ---
  if (safeBrowsing?.available) {
    signalsAvailable += 1;
    if (safeBrowsing.threatsFound > 0) {
      score += 35;
      reasons.push(`Google Safe Browsing found matches for: ${safeBrowsing.threatTypes.join(', ')}.`);
    }
  }

  // --- HTTPS / SSL signal (weight: up to 15 points) ---
  signalsAvailable += 1;
  if (!https) {
    score += 10;
    reasons.push('Site does not use HTTPS encryption.');
  }
  if (ssl?.available) {
    if (!ssl.valid) {
      score += 10;
      reasons.push(ssl.expired ? 'SSL certificate has expired.' : 'SSL certificate is not valid/trusted.');
    }
  }

  // --- Domain age signal (weight: up to 10 points) ---
  if (domainInfo?.available && typeof domainInfo.domainAgeDays === 'number') {
    signalsAvailable += 1;
    if (domainInfo.domainAgeDays < 30) {
      score += 10;
      reasons.push('Domain was registered very recently (under 30 days ago).');
    } else if (domainInfo.domainAgeDays < 180) {
      score += 5;
      reasons.push('Domain was registered relatively recently (under 6 months ago).');
    }
  }

  score = Math.max(0, Math.min(100, score));

  let verdict;
  if (score <= 20) verdict = 'SAFE';
  else if (score <= 40) verdict = 'LOW RISK';
  else if (score <= 60) verdict = 'SUSPICIOUS';
  else if (score <= 80) verdict = 'DANGEROUS';
  else verdict = 'HIGH RISK';

  const confidence = Math.round((signalsAvailable / signalsTotal) * 100);

  return { score, verdict, reasons, confidence };
}

module.exports = { calculateRisk };
