import { useState } from "react";
import { fetchReviews, analyzeReviews } from "./lib/api.js";
import HomeScreen     from "./components/HomeScreen.jsx";
import PipelineScreen from "./components/PipelineScreen.jsx";
import ResultsScreen  from "./components/ResultsScreen.jsx";

const fmt = iso => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

const NAV = {
  height: 60,
  background: "#fff",
  borderBottom: "1px solid #E2E8F0",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

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

      if (!reviews?.length)
        throw new Error("No reviews found. Try a wider date window.");

      setLayers({ active: 2, done: [1] });
      setMeta({ fromDate, toDate, windowDays, sources });

      let vis = 2;
      const timer = setInterval(() => {
        if (vis < 4) { vis++; setLayers(p => ({ active: vis, done: [...p.done, vis - 1] })); }
      }, 15000);

      let analysis;
      try { analysis = await analyzeReviews({ reviews, windowDays, fromDate, toDate }); }
      finally { clearInterval(timer); }

      setLayers({ active: 5, done: [1, 2, 3, 4] });
      await new Promise(r => setTimeout(r, 400));
      setResult(analysis);
      setPage("results");

    } catch (e) {
      console.error(e);
      setError(e.message || "Something went wrong. Check your functions terminal.");
      setPage("home");
      setLayers({ active: 0, done: [] });
    }
  }

  function reset() { setPage("home"); setResult(null); setMeta(null); setError(""); setLayers({ active: 0, done: [] }); }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* Navbar */}
      <header style={NAV}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: "100%", display: "flex", alignItems: "center", gap: 16 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="7" fill="#00C853"/>
              <text x="14" y="20" textAnchor="middle" fill="white" fontSize="16" fontWeight="800" fontFamily="Inter,sans-serif">G</text>
            </svg>
            <span style={{ fontWeight: 800, fontSize: 15, color: "var(--text)", letterSpacing: "-0.02em" }}>Groww Pulse</span>
          </div>

          {/* Right */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            {meta && page === "results" && (
              <span style={{ fontSize: 12, color: "var(--sub)", background: "var(--bg)", padding: "3px 12px", borderRadius: 99, border: "1px solid var(--border)" }}>
                {fmt(meta.fromDate)} → {fmt(meta.toDate)}
              </span>
            )}
            {page === "results" && (
              <button onClick={reset} style={{
                fontSize: 13, color: "var(--navy)", background: "var(--navy-l)", border: "none",
                padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
              }}>
                ← New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "36px 24px" }}>
        {error && (
          <div style={{ marginBottom: 20, padding: "12px 16px", background: "var(--red-l)", border: "1px solid #FEB2B2", borderRadius: 10, color: "var(--red)", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>⚠ {error}</span>
            <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
        )}

        {page === "home"     && <HomeScreen onStart={handleStart} />}
        {page === "pipeline" && <PipelineScreen layers={layers} meta={meta} />}
        {page === "results"  && result && <ResultsScreen result={result} meta={meta} />}
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "16px 24px", textAlign: "center", fontSize: 12, color: "var(--muted)" }}>
        Groww Review Pulse · Play Store + App Store · Groq AI · No PII stored
      </footer>
    </div>
  );
}
