import { useState } from "react";
import { fetchReviews, analyzeReviews } from "./lib/api.js";
import HomeScreen     from "./components/HomeScreen.jsx";
import PipelineScreen from "./components/PipelineScreen.jsx";
import ResultsScreen  from "./components/ResultsScreen.jsx";

const fmt = iso => iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

export default function App() {
  const [page,   setPage]   = useState("home");
  const [layers, setLayers] = useState({ active: 0, done: [] });
  const [result, setResult] = useState(null);
  const [meta,   setMeta]   = useState(null);
  const [error,  setError]  = useState("");

  async function handleStart({ windowDays }) {
    setError("");
    setPage("pipeline");
    setLayers({ active: 1, done: [] });

    try {
      const scrape = await fetchReviews(windowDays);
      const { reviews, fromDate, toDate, sources } = scrape;

      if (!reviews?.length) throw new Error("No reviews found. Try a wider date window.");

      setLayers({ active: 2, done: [1] });
      setMeta({ fromDate, toDate, windowDays, sources });

      let vis = 2;
      const timer = setInterval(() => {
        if (vis < 4) { vis++; setLayers(p => ({ active: vis, done: [...p.done, vis - 1] })); }
      }, 12000);

      let analysis;
      try { analysis = await analyzeReviews({ reviews, windowDays, fromDate, toDate }); }
      finally { clearInterval(timer); }

      setLayers({ active: 5, done: [1, 2, 3, 4] });
      await new Promise(r => setTimeout(r, 600));
      
      setResult(analysis);
      setPage("results");
    } catch (e) {
      console.error(e);
      setError(e.message || "An unexpected error occurred during processing.");
      setPage("home");
      setLayers({ active: 0, done: [] });
    }
  }

  function reset() { 
    setPage("home"); setResult(null); setMeta(null); setError(""); setLayers({ active: 0, done: [] }); 
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Modern, minimalist Top Navigation */}
      <header style={{ 
        height: 72, 
        borderBottom: "1px solid var(--border)", 
        background: "var(--bg)",
        position: "sticky", 
        top: 0, 
        zIndex: 50
      }}>
        <div style={{ 
          maxWidth: 1400, margin: "0 auto", padding: "0 32px", height: "100%", 
          display: "flex", alignItems: "center", justifyContent: "space-between" 
        }}>
          {/* Logo */}
          <div 
            onClick={reset} 
            style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
          >
            <div style={{ 
              width: 32, height: 32, borderRadius: "50%", background: "var(--text-primary)", 
              display: "flex", alignItems: "center", justifyContent: "center" 
            }}>
              <div style={{ width: 14, height: 14, borderRadius: "2px", background: "var(--bg)" }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.03em" }}>
              Groww Insights
            </span>
          </div>

          {/* Right Section / Context */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {meta && page === "results" && (
              <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500, background: "var(--surface)", padding: "6px 16px", borderRadius: 100 }}>
                {fmt(meta.fromDate)} — {fmt(meta.toDate)}
              </span>
            )}
            {page === "results" && (
              <button onClick={reset} style={{
                background: "transparent", border: "1px solid var(--border)", color: "var(--text-primary)",
                padding: "8px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600
              }}>
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {error && (
          <div className="animate-slide-up" style={{ 
            maxWidth: 600, margin: "32px auto 0", padding: "16px 24px", 
            background: "var(--text-primary)", color: "var(--bg)", 
            borderRadius: 12, fontSize: 14, fontWeight: 500, 
            display: "flex", justifyContent: "space-between", alignItems: "center",
            boxShadow: "var(--shadow-lg)"
          }}>
            <span>Failed: {error}</span>
            <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "var(--bg)", opacity: 0.6 }}>✕</button>
          </div>
        )}

        {page === "home"     && <HomeScreen onStart={handleStart} />}
        {page === "pipeline" && <PipelineScreen layers={layers} />}
        {page === "results"  && result && <ResultsScreen result={result} meta={meta} />}
      </main>

    </div>
  );
}
