import { useLocation, useNavigate, Link } from 'react-router-dom';
import RiskScore from '../components/RiskScore';
import SecurityCard from '../components/SecurityCard';

const ICONS = {
  malware: <path d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Z" />,
  phishing: <path d="M22 6 12 13 2 6" />,
  blacklist: <path d="M4 4h16v16H4V4Zm3 3 10 10M17 7 7 17" />,
  https: <path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4Z" />,
  domain: <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />,
  ssl: <path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4Zm-1 15-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7Z" />,
};

function IconWrap({ children }) {
  return (
    <svg viewBox="0 0 24 24" className="fill-none stroke-current" strokeWidth="1.8" style={{ width: 16, height: 16 }}>
      {children}
    </svg>
  );
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="mx-auto max-w-xl px-6 py-28 text-center">
        <p className="font-mono text-sm text-slate-500">No scan result to show.</p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-lg bg-signal-cyan px-5 py-2.5 font-display text-sm font-semibold text-ink-900"
        >
          Run a scan
        </Link>
      </div>
    );
  }

  const { url, domain, verdict, riskScore, checks, domainInfo, engineResults, reasons, disclaimer, confidence } = result;

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <button
        onClick={() => navigate('/')}
        className="mb-8 flex items-center gap-1.5 font-mono text-xs text-slate-500 hover:text-signal-cyan"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2.2">
          <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Scan another link
      </button>

      <div className="rounded-2xl border border-ink-600 bg-ink-800/50 p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-wide text-slate-500">Scanned URL</p>
        <p className="mt-1.5 break-all font-mono text-sm text-slate-200 sm:text-base">{url}</p>

        <div className="mt-8 flex flex-col items-center gap-8 border-t border-ink-600 pt-8 sm:flex-row sm:justify-around">
          <RiskScore score={riskScore} verdict={verdict} />

          <div className="w-full max-w-xs space-y-3 font-mono text-sm">
            <Row label="Domain" value={domain} />
            <Row label="Domain age" value={domainInfo?.domainAge || 'Unknown'} />
            <Row label="Registrar" value={domainInfo?.registrar || 'Unknown'} />
            <Row label="HTTPS" value={checks?.https ? 'Enabled' : 'Disabled'} />
            <Row label="SSL certificate" value={checks?.ssl || 'UNKNOWN'} />
            <Row label="Confidence" value={confidence != null ? `${confidence}%` : 'N/A'} />
          </div>
        </div>
      </div>

      {reasons?.length > 0 && (
        <div className="mt-6 rounded-2xl border border-ink-600 bg-ink-800/40 p-6">
          <h2 className="font-display text-sm font-semibold text-slate-200">What we found</h2>
          <ul className="mt-3 space-y-2">
            {reasons.map((r, idx) => (
              <li key={idx} className="flex items-start gap-2 font-mono text-xs leading-relaxed text-slate-400">
                <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-signal-cyan" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="mb-4 mt-10 font-display text-lg font-semibold text-slate-100">Security checks</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SecurityCard icon={<IconWrap>{ICONS.malware}</IconWrap>} title="Malware Detection" status={checks?.malware} description={engineDesc(engineResults?.virusTotal, 'malicious')} />
        <SecurityCard icon={<IconWrap>{ICONS.phishing}</IconWrap>} title="Phishing Detection" status={checks?.phishing} description={engineDesc(engineResults?.safeBrowsing)} />
        <SecurityCard icon={<IconWrap>{ICONS.blacklist}</IconWrap>} title="Blacklist Status" status={checks?.blacklist} description="Aggregated from reputation engine flags." />
        <SecurityCard icon={<IconWrap>{ICONS.https}</IconWrap>} title="HTTPS Security" status={checks?.https ? 'ENABLED' : 'DISABLED'} description={checks?.https ? 'Traffic to this site is encrypted.' : 'This site does not enforce HTTPS.'} />
        <SecurityCard icon={<IconWrap>{ICONS.domain}</IconWrap>} title="Domain Reputation" status={domainInfo?.domainAge && domainInfo.domainAge !== 'Unknown' ? 'SAFE' : 'UNKNOWN'} description={`Registered: ${domainInfo?.domainAge || 'Unknown'}`} />
        <SecurityCard icon={<IconWrap>{ICONS.ssl}</IconWrap>} title="SSL Certificate" status={checks?.ssl} description="Live certificate validity check via TLS handshake." />
      </div>

      <div className="mt-8 rounded-xl border border-ink-600 bg-ink-800/30 p-5">
        <p className="font-mono text-xs leading-relaxed text-slate-500">
          <span className="font-semibold text-slate-400">Disclaimer: </span>
          {disclaimer}
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-700 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200">{value}</span>
    </div>
  );
}

function engineDesc(engine, key) {
  if (!engine || engine.status === 'unavailable') return 'Provider unavailable for this scan.';
  if (key === 'malicious') {
    return `${engine.malicious ?? 0} of ${engine.totalEngines ?? 0} engines flagged this URL.`;
  }
  if (typeof engine.threatsFound === 'number') {
    return engine.threatsFound > 0
      ? `Matched: ${engine.threatTypes?.join(', ')}`
      : 'No threats matched on Safe Browsing lists.';
  }
  return '';
}
