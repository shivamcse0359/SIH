const axios = require('axios');

const SAFE_BROWSING_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';

/**
 * Checks a URL against Google Safe Browsing's threat lists
 * (malware, social engineering / phishing, unwanted software, potentially harmful apps).
 * Never throws - failures are captured in the `available` flag.
 */
async function checkSafeBrowsing(targetUrl) {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

  if (!apiKey || apiKey === 'your_google_safe_browsing_api_key_here') {
    return { available: false, reason: 'not_configured' };
  }

  try {
    const response = await axios.post(
      `${SAFE_BROWSING_URL}?key=${apiKey}`,
      {
        client: { clientId: 'linkguard', clientVersion: '1.0.0' },
        threatInfo: {
          threatTypes: [
            'MALWARE',
            'SOCIAL_ENGINEERING',
            'UNWANTED_SOFTWARE',
            'POTENTIALLY_HARMFUL_APPLICATION',
          ],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url: targetUrl }],
        },
      },
      { timeout: 10000 }
    );

    const matches = response.data?.matches || [];

    return {
      available: true,
      threatsFound: matches.length,
      threatTypes: [...new Set(matches.map((m) => m.threatType))],
    };
  } catch (err) {
    return { available: false, reason: 'request_failed' };
  }
}

module.exports = { checkSafeBrowsing };
