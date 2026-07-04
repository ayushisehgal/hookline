export default function HistoryPanel({ items, onSelect }) {
  if (!items.length) {
    return (
      <p className="text-sm text-muted">
        Nothing generated yet 🎬 your last 10 runs will show up here.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => onSelect(item)}
            className="w-full text-left rounded-xl border border-line bg-surface hover:border-pink/60 px-4 py-3 transition-colors"
          >
            <p className="text-sm text-ink truncate">{item.idea}</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-mono text-[11px] text-muted">
                {new Date(item.created_at).toLocaleString()}
              </span>
              <span className="font-mono text-[11px] text-pink">
                fit {item.fit_score?.score ?? "—"}
              </span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}