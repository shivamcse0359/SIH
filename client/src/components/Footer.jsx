import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-ink-600/70 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-sm font-semibold text-slate-200">
            Link<span className="text-signal-cyan">Guard</span>
          </p>
          <p className="mt-1 max-w-sm font-mono text-xs text-slate-500">
            Automated link intelligence. Not a substitute for careful judgment.
          </p>
        </div>
        <div className="flex gap-6 font-mono text-xs text-slate-500">
          <Link to="/about" className="hover:text-signal-cyan">ABOUT</Link>
          <Link to="/privacy" className="hover:text-signal-cyan">PRIVACY</Link>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
