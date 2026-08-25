const axios = require('axios');
const tls = require('tls');

/**
 * Looks up WHOIS/domain registration info via a configured third-party WHOIS API.
 * If no provider is configured, returns available: false so the caller can
 * degrade gracefully rather than fail the whole scan.
 */
async function getDomainInfo(hostname) {
  const apiKey = process.env.WHOIS_API_KEY;
  const apiUrl = process.env.WHOIS_API_URL;

  if (!apiKey || apiKey === 'your_whois_api_key_here' || !apiUrl) {
    return { available: false, reason: 'not_configured', domain: hostname };
  }

  try {
    const response = await axios.get(apiUrl, {
      params: { domain: hostname, key: apiKey },
      timeout: 10000,
    });

    const data = response.data || {};
    const createdRaw = data.created || data.creationDate || data.created_date;

    let domainAgeDays = null;
    if (createdRaw) {
      const createdDate = new Date(createdRaw);
      if (!isNaN(createdDate.getTime())) {
        domainAgeDays = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      }
    }

    return {
      available: true,
      domain: hostname,
      registrar: data.registrar || null,
      createdDate: createdRaw || null,
      domainAgeDays,
    };
  } catch (err) {
    return { available: false, reason: 'request_failed', domain: hostname };
  }
}

/**
 * Opens a TLS connection to the host to inspect its certificate.
 * Returns validity window, issuer, and whether the cert is currently trusted/valid.
 */
function getSslInfo(hostname) {
  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: hostname,
        port: 443,
        servername: hostname,
        timeout: 8000,
        rejectUnauthorized: false, // we want to inspect even invalid certs, not fail on them
      },
      () => {
        const cert = socket.getPeerCertificate();
        const authorized = socket.authorized;

        if (!cert || Object.keys(cert).length === 0) {
          socket.end();
          resolve({ available: false, reason: 'no_certificate' });
          return;
        }

        const validFrom = new Date(cert.valid_from);
        const validTo = new Date(cert.valid_to);
        const now = new Date();
        const isExpired = now > validTo;
        const isNotYetValid = now < validFrom;

        socket.end();
        resolve({
          available: true,
          valid: authorized && !isExpired && !isNotYetValid,
          issuer: cert.issuer?.O || cert.issuer?.CN || 'Unknown',
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          expired: isExpired,
        });
      }
    );

    socket.on('error', () => {
      resolve({ available: false, reason: 'connection_failed' });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ available: false, reason: 'timeout' });
    });
  });
}

module.exports = { getDomainInfo, getSslInfo };
