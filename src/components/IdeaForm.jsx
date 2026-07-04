import { useState } from "react";

export default function IdeaForm({ onGenerate, loading }) {
  const [idea, setIdea] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!idea.trim() || loading) return;
    onGenerate(idea.trim());
  };

  return (
    <form onSubmit={submit} className="w-full">
      <label htmlFor="idea" className="font-mono text-xs uppercase tracking-widest text-muted">
        Your video idea
      </label>
      <textarea
        id="idea"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="e.g. I tried the 75 Hard challenge for 30 days and quit halfway — here's the real reason nobody talks about"
        rows={4}
        className="mt-2 w-full resize-none rounded-2xl bg-surface border border-line focus-visible:border-pink px-4 py-3 text-ink placeholder:text-muted/70 outline-none shadow-sm"
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-xs text-muted">{idea.length} characters</span>
        <button
          type="submit"
          disabled={!idea.trim() || loading}
          className="inline-flex items-center gap-2 rounded-full ig-gradient-bg text-white font-display font-medium px-6 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition"
        >
          {loading ? "Cutting hooks… ✂️" : "Generate hooks ✨"}
        </button>
      </div>
    </form>
  );
}