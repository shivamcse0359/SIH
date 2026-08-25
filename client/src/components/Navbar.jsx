import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Scan' },
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-600/70 bg-ink-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md border border-signal-cyan/40 bg-ink-700">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-signal-cyan" style={{ width: 18, height: 18 }}>
              <path d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Zm0 2.18 6 2.25v4.57c0 4.25-2.7 8.14-6 9.06-3.3-.92-6-4.81-6-9.06V6.43l6-2.25Z" />
              <path d="m10.9 13.1-2-2-1.4 1.4 3.4 3.4 6-6-1.4-1.4-4.6 4.6Z" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-slate-50">
            Link<span className="text-signal-cyan">Guard</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3.5 py-2 font-body text-sm font-medium transition-colors ${
                  active
                    ? 'text-signal-cyan'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
