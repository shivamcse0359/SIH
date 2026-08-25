import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UrlScanner from '../components/UrlScanner';
import { scanUrl } from '../api/scanApi';

const FEATURES = [
  {
    title: 'Multi-engine reputation',
    desc: 'Cross-references malware and phishing databases from trusted security providers.',
    icon: (
      <path d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Z" />
    ),
  },
  {
    title: 'Certificate inspection',
    desc: 'Checks HTTPS enforcement and validates the site\u2019s SSL/TLS certificate live.',
    icon: (
      <path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4Zm-1 15-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7Z" />
    ),
  },
  {
    title: 'Domain intelligence',
    desc: 'Surfaces registration age and registrar details \u2014 newly created domains are a common red flag.',
    icon: (
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 9h-3.02a15.6 15.6 0 0 0-1.3-5.6A8.03 8.03 0 0 1 18.9 11ZM12 4.06c.9 1.3 1.9 3.6 2.1 6.94H9.9c.2-3.34 1.2-5.64 2.1-6.94ZM9.42 5.4A15.6 15.6 0 0 0 8.12 11H5.1a8.03 8.03 0 0 1 4.32-5.6ZM5.1 13h3.02c.16 2.16.62 4.1 1.3 5.6A8.03 8.03 0 0 1 5.1 13Zm4.8 0h4.2c-.2 3.34-1.2 5.64-2.1 6.94-.9-1.3-1.9-3.6-2.1-6.94Zm5.78 5.6c.68-1.5 1.14-3.44 1.3-5.6h3.02a8.03 8.03 0 0 1-4.32 5.6Z" />
    ),
  },
  {
    title: 'Transparent scoring',
    desc: 'Every point on the 0\u2013100 risk score traces back to a specific signal \u2014 no black box.',
    icon: (
      <path d="M3 13h4v8H3v-8Zm7-8h4v16h-4V5Zm7 4h4v12h-4V9Z" />
    ),
  },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  async function handleScan(url) {
    setLoading(true);
    setErrorMsg('');
    const { data, error } = await scanUrl(url);
    setLoading(false);

    if (error) {
      setErrorMsg(error);
      return;
    }

    navigate('/results', { state: { result: data } });
  }

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center sm:pt-28">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-ink-500 bg-ink-800/60 px-3.5 py-1.5 font-mono text-xs text-signal-cyan">
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-signal-cyan" />
          LIVE THREAT SCANNING
        </div>

        <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-6xl">
          Check Any Link
          <br />
          <span className="text-signal-cyan">Before You Click</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl font-body text-base text-slate-400 sm:text-lg">
          Paste a URL and LinkGuard cross-checks it against reputation databases,
          phishing lists, and certificate authorities \u2014 in seconds.
        </p>

        <div className="mx-auto mt-10 max-w-2xl">
          <UrlScanner onScan={handleScan} loading={loading} />
          {errorMsg && (
            <p className="mt-3 font-mono text-sm text-risk-dangerous">{errorMsg}</p>
          )}
        </div>

        <p className="mx-auto mt-6 max-w-lg font-mono text-xs leading-relaxed text-slate-600">
          Automated scans can miss threats. LinkGuard reports are a decision aid, not a
          guarantee of safety.
        </p>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-ink-600 bg-ink-800/40 p-5 transition-colors hover:border-signal-cyan/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-700 text-signal-cyan">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-current" style={{ width: 18, height: 18 }}>
                  {f.icon}
                </svg>
              </span>
              <h3 className="mt-4 font-display text-sm font-semibold text-slate-100">{f.title}</h3>
              <p className="mt-1.5 font-body text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
