export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-signal-cyan">Privacy Policy</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-slate-50 sm:text-4xl">
        What we collect (and what we don\u2019t)
      </h1>

      <div className="mt-8 space-y-6 font-body text-sm leading-relaxed text-slate-400 sm:text-base">
        <p>
          LinkGuard is built to do one job \u2014 check a link \u2014 with as little data
          collection as possible.
        </p>

        <div className="rounded-xl border border-ink-600 bg-ink-800/40 p-5">
          <h2 className="font-display text-sm font-semibold text-slate-200">What we store</h2>
          <p className="mt-2 font-mono text-xs leading-relaxed text-slate-500">
            If scan history is enabled by the site operator, we store only: the scanned
            URL, its domain, the verdict, the risk score, and a timestamp. We do not
            store your IP address, browser fingerprint, account information, or any
            other identifying data alongside a scan.
          </p>
        </div>

        <div className="rounded-xl border border-ink-600 bg-ink-800/40 p-5">
          <h2 className="font-display text-sm font-semibold text-slate-200">Third-party providers</h2>
          <p className="mt-2 font-mono text-xs leading-relaxed text-slate-500">
            To generate a report, the URL you submit is sent to third-party security
            providers (such as VirusTotal and Google Safe Browsing) for reputation
            checks. Their own privacy policies govern how they handle that data. We
            recommend not scanning URLs that contain sensitive query parameters, tokens,
            or personal information.
          </p>
        </div>

        <div className="rounded-xl border border-ink-600 bg-ink-800/40 p-5">
          <h2 className="font-display text-sm font-semibold text-slate-200">What we never do</h2>
          <ul className="mt-2 space-y-1.5 font-mono text-xs text-slate-500">
            <li>\u2022 We never sell or share scan data with advertisers.</li>
            <li>\u2022 We never automatically open or visit a submitted link in a browser.</li>
            <li>\u2022 We never require an account or personal details to run a scan.</li>
          </ul>
        </div>

        <p className="pt-2 font-mono text-xs text-slate-600">
          Questions about this policy can be directed to the site operator listed in the
          project README.
        </p>
      </div>
    </div>
  );
}
