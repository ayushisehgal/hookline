export default function ScoreGauge({ score = 0, label = "", reasoning = "" }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm shadow-pink/5">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8134AF" />
                <stop offset="50%" stopColor="#E1306C" />
                <stop offset="100%" stopColor="#F77737" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#FBE1D6" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.7s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-semibold text-3xl">{score}</span>
            <span className="font-mono text-[10px] text-muted">out of 100</span>
          </div>
        </div>

        <div className="flex-1 min-w-[180px]">
          <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">
            Estimated audience fit
          </p>
          {label && (
            <span className="inline-block font-display font-medium text-sm px-3 py-1 rounded-full ig-gradient-bg text-white">
              {label} ✨
            </span>
          )}
          {reasoning && (
            <p className="mt-3 text-sm text-muted leading-relaxed">{reasoning}</p>
          )}
        </div>
      </div>
    </div>
  );
}