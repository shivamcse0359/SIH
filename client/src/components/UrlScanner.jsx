import { useState, useEffect } from 'react';

const SCAN_STAGES = [
  'Resolving domain…',
  'Checking reputation engines…',
  'Screening for phishing indicators…',
  'Inspecting SSL certificate…',
  'Compiling report…',
];

export default function UrlScanner({ onScan, loading }) {
  const [value, setValue] = useState('');
  const [inputError, setInputError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();

    if (!trimmed) {
      setInputError('Paste a URL to scan.');
      return;
    }

    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      new URL(candidate);
    } catch {
      setInputError('That doesn\u2019t look like a valid URL.');
      return;
    }

    setInputError('');
    onScan(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`group relative rounded-2xl border bg-ink-800/80 p-2 shadow-[0_0_0_1px_rgba(0,0,0,0)] transition-colors ${
          inputError ? 'border-risk-dangerous/70' : 'border-ink-500 focus-within:border-signal-cyan/60'
        }`}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 px-3 py-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 fill-none stroke-slate-500" strokeWidth="1.8">
              <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.5-1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              value={value}
              onChange={(e) => { setValue(e.target.value); if (inputError) setInputError(''); }}
              placeholder="Paste a link to scan — e.g. example.com/login"
              disabled={loading}
              className="w-full bg-transparent font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none sm:text-base"
              aria-label="URL to scan"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-signal-cyan px-6 py-3.5 font-display text-sm font-semibold text-ink-900 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:py-3"
          >
            {loading ? (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-ink-900" />
                Scanning
              </>
            ) : (
              <>
                Scan Link
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-ink-900" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {inputError && (
        <p className="mt-2 pl-1 font-mono text-xs text-risk-dangerous">{inputError}</p>
      )}

      {loading && (
        <div className="mt-4 flex items-center gap-2 pl-1 font-mono text-xs text-signal-cyan/90">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-cyan opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-cyan" />
          </span>
          <ScanningText />
        </div>
      )}
    </form>
  );
}

function ScanningText() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setI((prev) => (prev + 1) % SCAN_STAGES.length);
    }, 1100);
    return () => clearInterval(timer);
  }, []);

  return <span>{SCAN_STAGES[i]}</span>;
}
