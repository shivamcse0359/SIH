# LinkGuard

LinkGuard is a full-stack URL security checker. Paste any link and it cross-checks it
against trusted reputation and security sources, inspects HTTPS/SSL configuration, and
returns a transparent 0–100 risk score with a plain-language verdict.

> **Automated scans can miss threats.** LinkGuard is a decision aid, not a guarantee
> that a URL is safe.

---

## Tech stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React + Vite, Tailwind CSS, React Router |
| Backend   | Node.js, Express |
| Database  | MongoDB (optional — used only for scan history) |
| Security APIs | VirusTotal, Google Safe Browsing, a WHOIS provider, native TLS inspection |

## Project structure

```
linkguard/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/            # Axios client for the backend API
│   │   ├── components/     # Navbar, UrlScanner, RiskScore, SecurityCard, Footer
│   │   ├── pages/          # Home, Results, About, Privacy
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
│
├── server/                 # Express backend
│   ├── routes/scanRoutes.js
│   ├── controllers/scanController.js
│   ├── services/           # virusTotalService, safeBrowsingService, domainService
│   ├── utils/               # urlValidator, riskCalculator
│   ├── models/Scan.js       # optional Mongoose model for scan history
│   ├── server.js
│   └── .env.example
│
└── README.md
```

---

## 1. Prerequisites

- Node.js 18+ and npm
- (Optional) A local or hosted MongoDB instance, if you want scan history
- API keys from the providers you want to enable (the app degrades gracefully if any
  are missing — see [API integration](#3-api-integration) below)

## 2. Installation

Open the project in VS Code, then use two terminals (or run the frontend/backend in
sequence).

**Backend:**
```bash
cd server
npm install
cp .env.example .env
# then edit .env and add your API keys
npm run dev        # starts on http://localhost:5000
```

**Frontend** (in a second terminal):
```bash
cd client
npm install
npm run dev         # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser. The Vite dev server proxies `/api`
requests to the backend on port 5000 (see `client/vite.config.js`), so no CORS
configuration is needed in development beyond what's already set up.

## 3. API integration

All keys live only in `server/.env` — the frontend never sees them.

| Variable | Where to get it | Required? |
|---|---|---|
| `VIRUSTOTAL_API_KEY` | [virustotal.com/gui/join-us](https://www.virustotal.com/gui/join-us) — free tier available | Optional, but recommended |
| `GOOGLE_SAFE_BROWSING_API_KEY` | [Google Safe Browsing API docs](https://developers.google.com/safe-browsing/v4/get-started) via Google Cloud Console | Optional, but recommended |
| `WHOIS_API_KEY` + `WHOIS_API_URL` | Any WHOIS API provider of your choice (e.g. whoisjson.com, whoisxmlapi.com) | Optional |
| `MONGODB_URI` | Local MongoDB or a hosted cluster (e.g. MongoDB Atlas) | Optional — enables scan history |

If a key is left as its placeholder value or omitted, that check is skipped and the
scan report shows it as **UNKNOWN / unavailable** rather than failing the whole scan
or fabricating a result. SSL certificate inspection works out of the box with no API
key — it opens a direct TLS connection to the target host.

Respect each provider's terms of service and rate limits. The backend also applies its
own rate limiting (`RATE_LIMIT_WINDOW_MINUTES` / `RATE_LIMIT_MAX_REQUESTS` in `.env`)
to avoid exhausting upstream quotas.

## 4. API reference

### `POST /api/scan`

Request:
```json
{ "url": "https://example.com" }
```

Response:
```json
{
  "url": "https://example.com/",
  "domain": "example.com",
  "verdict": "SAFE",
  "riskScore": 15,
  "confidence": 100,
  "reasons": [],
  "checks": {
    "malware": "SAFE",
    "phishing": "SAFE",
    "blacklist": "SAFE",
    "https": true,
    "ssl": "VALID"
  },
  "domainInfo": {
    "domain": "example.com",
    "domainAge": "9125 days",
    "registrar": "Unknown"
  },
  "engineResults": { "virusTotal": { }, "safeBrowsing": { } },
  "disclaimer": "This is an automated assessment...",
  "scannedAt": "2026-08-23T12:00:00.000Z"
}
```

### `GET /api/history`

Returns the last 20 scans if `MONGODB_URI` is configured and connected; otherwise
returns an empty list with a note that history is disabled.

## 5. Risk scoring

The score starts at 0 and points are **added** for each negative signal — every point
is traceable to a specific check, with no opaque model in between:

- VirusTotal malicious/suspicious engine ratio — up to 45 points
- Google Safe Browsing threat matches — 35 points
- Missing HTTPS or an invalid/expired SSL certificate — up to 20 points
- Very recently registered domain — up to 10 points

| Score | Verdict |
|---|---|
| 0–20 | SAFE |
| 21–40 | LOW RISK |
| 41–60 | SUSPICIOUS |
| 61–80 | DANGEROUS |
| 81–100 | HIGH RISK |

## 6. Error handling

- Invalid URLs are rejected with a clear message before any API calls are made.
- Local/private network addresses (e.g. `localhost`, `192.168.x.x`) are blocked to
  prevent misuse.
- Every third-party service call is wrapped so a single provider outage never crashes
  the scan — it just reduces the report's confidence and is shown as unavailable.
- Backend errors are logged server-side only; clients only ever see a generic
  "Service temporarily unavailable" message, never a stack trace or API key.

## 7. Ethical notes

LinkGuard never automatically visits or fetches the content of a submitted URL in a
browser context — it only queries reputation APIs and performs a TLS handshake to
inspect the certificate. Results are always presented as an automated assessment, and
the UI includes a persistent disclaimer that no scan is a guarantee of safety.
