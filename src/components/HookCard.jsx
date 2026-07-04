const accents = ["#8134AF", "#B4489B", "#E1306C", "#F0555A", "#F77737"];

export default function HookCard({ index, text, style }) {
  const num = String(index + 1).padStart(2, "0");
  const accent = accents[index % accents.length];

  const copy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      className="group relative rounded-2xl bg-surface border border-line pl-5 pr-4 py-4 flex items-start gap-4 animate-rise shadow-sm hover:shadow-md transition-shadow"
      style={{ borderLeftColor: accent, borderLeftWidth: "4px" }}
    >
      <span
        className="font-display font-semibold text-xs pt-1 shrink-0"
        style={{ color: accent }}
      >
        {num}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-ink text-base leading-snug font-medium">{text}</p>
        {style && (
          <span className="mt-2 inline-block font-mono text-[11px] uppercase tracking-wide text-muted">
            {style}
          </span>
        )}
      </div>
      <button
        onClick={copy}
        className="shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity font-medium text-xs rounded-full px-3 py-1 border border-line hover:border-pink hover:text-pink"
      >
        Copy 📋
      </button>
    </div>
  );
}