import { useState } from "react";

export default function HomeScreen({ onStart }) {
  const [days,    setDays]    = useState(7);
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    await onStart({ windowDays: days });
    setLoading(false);
  }

  return (
    <div className="fade-up" style={{ maxWidth: 680, margin: "0 auto", color: "var(--text)" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--green-l)", border: "1px solid var(--border)", borderRadius: 99, padding: "5px 14px", fontSize: 12, color: "var(--green-d)", fontWeight: 600, marginBottom: 20 }}>
          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
          LIVE · Play Store + App Store
        </div>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.15, marginBottom: 12, letterSpacing: "-0.02em" }}>
           Review Insights
        </h1>
        <p style={{ color: "var(--sub)", fontSize: 15, maxWidth: 440, margin: "0 auto", lineHeight: 1.5 }}>
          Analyze live reviews with Groq AI to generate a one-page health pulse for your product team.
        </p>
      </div>

      {/* Config card */}
      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>

        {/* Window selector */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 16 }}>
            Select Review Window
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            {[7, 14, 21, 28].map(d => (
              <button key={d} onClick={() => setDays(d)} style={{
                flex: 1, padding: "12px 0", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                border: `1px solid ${days === d ? "var(--green)" : "var(--border)"}`,
                background: days === d ? "var(--green-l)" : "var(--white)",
                color: days === d ? "var(--green-d)" : "var(--sub)",
                fontWeight: days === d ? 600 : 500, fontSize: 14,
                transition: "all .15s",
              }}>{d} Days</button>
            ))}
          </div>
        </div>

        {/* Run button */}
        <button onClick={go} disabled={loading} style={{
          width: "100%", padding: "16px 0", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer",
          background: loading ? "var(--border)" : "var(--green)",
          color: loading ? "var(--muted)" : "white", fontWeight: 700, fontSize: 16,
          transition: "all .2s", boxShadow: loading ? "none" : "0 4px 14px rgba(0, 200, 83, 0.3)",
        }}>
          {loading ? "Starting Analysis…" : `Run ${days}-Day Pulse`}
        </button>

        {/* How it works */}
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            ["1", "Scrape", "Live reviews from Play & App Store"],
            ["2", "Analyse", "Groq AI classifies themes & insights"],
            ["3", "Report", "One-page pulse with actions & top issues"],
            ["4", "Email", "Sent to your team (disabled locally)"]
          ].map(([n, t, d]) => (
            <div key={n} style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--navy-l)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--navy)", fontWeight: 700, flexShrink: 0 }}>{n}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{t}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4, marginTop: 2 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
