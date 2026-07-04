import { useEffect, useRef, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import IdeaForm from "./components/IdeaForm";
import HookCard from "./components/HookCard";
import ScoreGauge from "./components/ScoreGauge";
import HistoryPanel from "./components/HistoryPanel";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const isGeneratingRef = useRef(false);

  const loadHistory = async () => {
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    if (!error && data) setHistory(data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const generate = async (idea) => {
    if (isGeneratingRef.current) return;
    isGeneratingRef.current = true;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-hooks", {
        body: { idea },
      });
      if (error) throw error;
      setResult({ idea, ...data });
      loadHistory();
    } catch (err) {
      console.error(err);
      setError("Couldn't generate hooks. Check your API key setup and try again.");
    } finally {
      setLoading(false);
      isGeneratingRef.current = false;
    }
  };

  const selectHistoryItem = (item) => {
    setResult({
      idea: item.idea,
      hooks: item.hooks,
      captions: item.captions,
      fit_score: item.fit_score,
    });
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="px-6 py-14 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-display font-medium text-sm ig-gradient-text">
            ✨ hookline
          </span>
          <h1 className="font-display font-semibold text-5xl md:text-6xl mt-3 leading-[1.05] ig-gradient-text">
            Paste the idea.
            <br />
            Cut the hook.
          </h1>
          <p className="mt-4 text-muted max-w-xl mx-auto">
            Drop a raw video idea and get 10 scroll-stopping hooks, caption
            options, and an estimated audience fit score — instantly 💫
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 grid gap-10">
        <IdeaForm onGenerate={generate} loading={loading} />

        {error && (
          <p className="text-sm text-pink font-medium border border-pink/40 rounded-xl px-4 py-3 bg-pink/5">
            {error}
          </p>
        )}

        {result && (
          <section className="grid gap-8 animate-rise">
            <ScoreGauge
              score={result.fit_score?.score ?? 0}
              label={result.fit_score?.label}
              reasoning={result.fit_score?.reasoning}
            />

            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
                10 hook options 🎣
              </h2>
              <div className="grid gap-2">
                {result.hooks?.map((h, i) => (
                  <HookCard key={i} index={i} text={h.text} style={h.style} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
                Caption ideas 💬
              </h2>
              <div className="grid gap-2">
                {result.captions?.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-surface border border-line px-4 py-3 text-sm text-ink shadow-sm"
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
            Recent runs 🕐
          </h2>
          <HistoryPanel items={history} onSelect={selectHistoryItem} />
        </section>
      </main>

      <footer className="text-center text-muted font-mono text-xs py-10">
        Built with React, Supabase & Groq — free to run 🩷
      </footer>
    </div>
  );
}