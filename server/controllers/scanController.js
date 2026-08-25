const { normalizeAndValidateUrl } = require('../utils/urlValidator');
const { calculateRisk } = require('../utils/riskCalculator');
const { scanWithVirusTotal } = require('../services/virusTotalService');
const { checkSafeBrowsing } = require('../services/safeBrowsingService');
const { getDomainInfo, getSslInfo } = require('../services/domainService');

let Scan = null;
try {
  Scan = require('../models/Scan');
} catch (err) {
  // Model unavailable if mongoose isn't connected - history saving is optional
}

function checkLabel(hasFinding, unavailable) {
  if (unavailable) return 'UNKNOWN';
  return hasFinding ? 'FLAGGED' : 'SAFE';
}

async function scanUrl(req, res) {
  try {
    const { url: rawUrl } = req.body;
    const { valid, url, hostname, error } = normalizeAndValidateUrl(rawUrl);

    if (!valid) {
      return res.status(400).json({ error: error || 'Invalid URL.' });
    }

    const isHttps = url.startsWith('https://');

    // Run all checks concurrently for speed. Each service is designed to
    // never throw - failures resolve to { available: false } instead.
    const [virusTotal, safeBrowsing, domainInfo, ssl] = await Promise.all([
      scanWithVirusTotal(url),
      checkSafeBrowsing(url),
      getDomainInfo(hostname),
      isHttps ? getSslInfo(hostname) : Promise.resolve({ available: false, reason: 'not_https' }),
    ]);

    const { score, verdict, reasons, confidence } = calculateRisk({
      virusTotal,
      safeBrowsing,
      https: isHttps,
      ssl,
      domainInfo,
    });

    const response = {
      url,
      domain: hostname,
      verdict,
      riskScore: score,
      confidence,
      reasons,
      checks: {
        malware: checkLabel(virusTotal.available && virusTotal.malicious > 0, !virusTotal.available),
        phishing: checkLabel(
          safeBrowsing.available && safeBrowsing.threatsFound > 0,
          !safeBrowsing.available
        ),
        blacklist: checkLabel(virusTotal.available && virusTotal.malicious > 0, !virusTotal.available),
        https: isHttps,
        ssl: ssl.available ? (ssl.valid ? 'VALID' : 'INVALID') : 'UNKNOWN',
      },
      domainInfo: {
        domain: hostname,
        domainAge: domainInfo.available && domainInfo.domainAgeDays != null
          ? `${domainInfo.domainAgeDays} days`
          : 'Unknown',
        registrar: domainInfo.available ? domainInfo.registrar || 'Unknown' : 'Unknown',
      },
      engineResults: {
        virusTotal: virusTotal.available
          ? {
              malicious: virusTotal.malicious,
              suspicious: virusTotal.suspicious,
              harmless: virusTotal.harmless,
              totalEngines: virusTotal.totalEngines,
            }
          : { status: 'unavailable' },
        safeBrowsing: safeBrowsing.available
          ? { threatsFound: safeBrowsing.threatsFound, threatTypes: safeBrowsing.threatTypes }
          : { status: 'unavailable' },
      },
      disclaimer:
        'This is an automated assessment based on available third-party security signals. It is not a guarantee of safety. No automated scan can detect every threat - use your own judgment before entering credentials or downloading files.',
      scannedAt: new Date().toISOString(),
    };

    // Best-effort history save - never blocks or fails the response
    if (Scan && require('mongoose').connection.readyState === 1) {
      Scan.create({
        url,
        domain: hostname,
        verdict,
        riskScore: score,
      }).catch(() => {});
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error('Scan error:', err.message);
    return res.status(500).json({ error: 'Service temporarily unavailable. Please try again shortly.' });
  }
}

async function getHistory(req, res) {
  try {
    if (!Scan || require('mongoose').connection.readyState !== 1) {
      return res.status(200).json({ history: [], note: 'History storage is not enabled.' });
    }

    const history = await Scan.find({}).sort({ createdAt: -1 }).limit(20).lean();
    return res.status(200).json({ history });
  } catch (err) {
    console.error('History fetch error:', err.message);
    return res.status(500).json({ error: 'Service temporarily unavailable. Please try again shortly.' });
  }
}

module.exports = { scanUrl, getHistory };
