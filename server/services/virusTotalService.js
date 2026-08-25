const axios = require('axios');

const VT_BASE_URL = 'https://www.virustotal.com/api/v3';

/**
 * Submits a URL to VirusTotal and retrieves its analysis report.
 * VirusTotal identifies URLs by a base64 (url-safe, no padding) id, which lets us
 * fetch an existing report without re-submitting when one is already on file.
 *
 * Returns a normalized result object. Never throws - failures are captured
 * in the `available` flag so the caller can degrade gracefully.
 */
async function scanWithVirusTotal(targetUrl) {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;

  if (!apiKey || apiKey === 'your_virustotal_api_key_here') {
    return { available: false, reason: 'not_configured' };
  }

  const urlId = Buffer.from(targetUrl).toString('base64').replace(/=+$/, '');

  try {
    // Try to fetch an existing report first (avoids unnecessary re-scans / rate limit use)
    let report;
    try {
      const existing = await axios.get(`${VT_BASE_URL}/urls/${urlId}`, {
        headers: { 'x-apikey': apiKey },
        timeout: 10000,
      });
      report = existing.data;
    } catch (lookupErr) {
      // Not previously analyzed - submit it for scanning
      const submission = await axios.post(
        `${VT_BASE_URL}/urls`,
        new URLSearchParams({ url: targetUrl }),
        {
          headers: {
            'x-apikey': apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000,
        }
      );

      const analysisId = submission.data?.data?.id;
      if (!analysisId) throw new Error('No analysis id returned');

      // Poll briefly for the analysis to complete
      let attempts = 0;
      let analysis;
      while (attempts < 4) {
        await new Promise((r) => setTimeout(r, 2000));
        const analysisRes = await axios.get(`${VT_BASE_URL}/analyses/${analysisId}`, {
          headers: { 'x-apikey': apiKey },
          timeout: 10000,
        });
        analysis = analysisRes.data;
        if (analysis?.data?.attributes?.status === 'completed') break;
        attempts += 1;
      }

      const stats = analysis?.data?.attributes?.stats;
      if (!stats) {
        return { available: false, reason: 'analysis_pending' };
      }

      return {
        available: true,
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        harmless: stats.harmless || 0,
        undetected: stats.undetected || 0,
        totalEngines:
          (stats.malicious || 0) + (stats.suspicious || 0) + (stats.harmless || 0) + (stats.undetected || 0),
      };
    }

    const stats = report?.data?.attributes?.last_analysis_stats;
    if (!stats) {
      return { available: false, reason: 'no_data' };
    }

    return {
      available: true,
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      harmless: stats.harmless || 0,
      undetected: stats.undetected || 0,
      totalEngines:
        (stats.malicious || 0) + (stats.suspicious || 0) + (stats.harmless || 0) + (stats.undetected || 0),
    };
  } catch (err) {
    return { available: false, reason: 'request_failed' };
  }
}

module.exports = { scanWithVirusTotal };
