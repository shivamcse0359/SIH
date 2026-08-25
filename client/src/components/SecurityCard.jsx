const STATUS_STYLES = {
  SAFE: { color: '#22C55E', text: 'Clear' },
  FLAGGED: { color: '#F0563D', text: 'Flagged' },
  UNKNOWN: { color: '#64748B', text: 'Unavailable' },
  VALID: { color: '#22C55E', text: 'Valid' },
  INVALID: { color: '#F0563D', text: 'Invalid' },
  ENABLED: { color: '#22C55E', text: 'Enabled' },
  DISABLED: { color: '#F0563D', text: 'Disabled' },
};

export default function SecurityCard({ icon, title, status, description }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.UNKNOWN;

  return (
    <div className="rounded-xl border border-ink-600 bg-ink-800/60 p-4 transition-colors hover:border-ink-500">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-700 text-slate-400">
            {icon}
          </span>
          <p className="font-body text-sm font-medium text-slate-200">{title}</p>
        </div>
        <span
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium"
          style={{ backgroundColor: `${style.color}18`, color: style.color }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: style.color }} />
          {style.text}
        </span>
      </div>
      {description && <p className="mt-2.5 font-mono text-xs leading-relaxed text-slate-500">{description}</p>}
    </div>
  );
}
