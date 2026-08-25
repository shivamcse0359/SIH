const VERDICT_META = {
  SAFE: { color: '#22C55E', label: 'SAFE' },
  'LOW RISK': { color: '#B7C93B', label: 'LOW RISK' },
  SUSPICIOUS: { color: '#F59E0B', label: 'SUSPICIOUS' },
  DANGEROUS: { color: '#F0563D', label: 'DANGEROUS' },
  'HIGH RISK': { color: '#DC2626', label: 'HIGH RISK' },
};

export default function RiskScore({ score, verdict }) {
  const meta = VERDICT_META[verdict] || VERDICT_META.SUSPICIOUS;
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-52 w-52">
        {/* radar sweep ring */}
        <div
          className="absolute inset-0 animate-sweep rounded-full opacity-70"
          style={{
            background: `conic-gradient(from 0deg, ${meta.color}55, transparent 35%)`,
            maskImage: 'radial-gradient(circle, transparent 62%, black 63%, black 100%)',
            WebkitMaskImage: 'radial-gradient(circle, transparent 62%, black 63%, black 100%)',
          }}
        />

        <svg viewBox="0 0 200 200" className="relative h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#1B2530" strokeWidth="10" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={meta.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.4s' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-5xl font-semibold text-slate-50 mono-num">{score}</span>
          <span className="font-mono text-xs text-slate-500">/ 100</span>
        </div>
      </div>

      <div
        className="mt-5 flex items-center gap-2 rounded-full border px-4 py-1.5"
        style={{ borderColor: `${meta.color}55`, backgroundColor: `${meta.color}14` }}
      >
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
        <span className="font-display text-sm font-semibold tracking-wide" style={{ color: meta.color }}>
          {meta.label}
        </span>
      </div>
    </div>
  );
}
