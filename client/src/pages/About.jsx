export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-signal-cyan">About</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-slate-50 sm:text-4xl">
        Why LinkGuard exists
      </h1>

      <div className="mt-8 space-y-6 font-body text-sm leading-relaxed text-slate-400 sm:text-base">
        <p>
          Phishing and malicious links remain one of the most common ways people get
          scammed or compromised online. LinkGuard gives anyone a fast, free way to
          check a link before clicking it \u2014 without needing security expertise.
        </p>
        <p>
          When you submit a URL, LinkGuard queries multiple independent security and
          reputation sources, inspects the site\u2019s HTTPS and SSL/TLS configuration, and
          looks up domain registration details. Those signals are combined into a single,
          transparent 0\u2013100 risk score with a plain-language verdict.
        </p>
        <p>
          Every point on that score can be traced back to a specific signal \u2014 there\u2019s no
          hidden model deciding a site is safe or dangerous. If a data source is
          unavailable, LinkGuard says so instead of guessing.
        </p>

        <div className="rounded-xl border border-ink-600 bg-ink-800/40 p-5">
          <h2 className="font-display text-sm font-semibold text-slate-200">A necessary caveat</h2>
          <p className="mt-2 font-mono text-xs leading-relaxed text-slate-500">
            No automated scanner catches every threat. New malicious sites appear faster
            than any database can track them, and a clean report is not a guarantee of
            safety. Treat LinkGuard as one signal among many \u2014 stay cautious with
            unfamiliar links, especially ones asking for credentials or payment.
          </p>
        </div>

        <h2 className="pt-4 font-display text-lg font-semibold text-slate-100">How scoring works</h2>
        <ul className="space-y-2 font-mono text-xs text-slate-500">
          <li>0\u201320 &nbsp;\u2014&nbsp; Safe</li>
          <li>21\u201340 \u2014 Low Risk</li>
          <li>41\u201360 \u2014 Suspicious</li>
          <li>61\u201380 \u2014 Dangerous</li>
          <li>81\u2013100 \u2014 High Risk</li>
        </ul>
      </div>
    </div>
  );
}
