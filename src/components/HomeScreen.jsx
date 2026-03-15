import { useState } from "react";

export default function HomeScreen({ onStart }) {
  const [days,    setDays]    = useState(7);
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    await onStart({ windowDays: days });
    // On success, App.jsx handles the transition. On error, it stops loading.
    setLoading(false); 
  }

  return (
    <div className="animate-fade-in" style={{ 
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", 
      padding: "24px 32px" 
    }}>
      <div style={{ 
        maxWidth: 1080, width: "100%", display: "grid", 
        gridTemplateColumns: "1fr 1fr", gap: "10%", alignItems: "center" 
      }}>
        
        {/* Left Column: Value Prop */}
        <div>
          <div style={{ 
            display: "inline-flex", alignItems: "center", gap: 8, 
            background: "var(--green-light)", color: "var(--green-hover)", 
            padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, 
            letterSpacing: "0.08em", marginBottom: 32 
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
            PlayStore Reviws - PM INSIGHTS
          </div>
          
          <h1 style={{ 
            fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 900, 
            lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 24,
            color: "var(--text-primary)"
          }}>
            Product Insights,<br/>
            <span style={{ color: "var(--text-tertiary)" }}>Categorised by AI.</span>
          </h1>
          
          <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 440 }}>
            Automatically scrape live reviews from Play Store and App Store. Our fine-tuned prompt extracts actionable summaries and sentiment metrics in seconds.
          </p>
        </div>

        {/* Right Column: Interactive Panel */}
        <div style={{ 
          background: "var(--surface)", 
          border: "1px solid var(--border)", 
          borderRadius: 24, 
          padding: 40,
          boxShadow: "var(--shadow-lg)"
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>
            Run Pulse Analysis
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32 }}>
            Select the time window to analyze recent reviews.
          </p>

          {/* Window Selection */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { val: 7, label: "Last 1 Week" },
                { val: 14, label: "Last 2 Weeks" },
                { val: 21, label: "Last 3 Weeks" },
                { val: 28, label: "Last 4 Weeks" }
              ].map(d => (
                <button key={d.val} onClick={() => setDays(d.val)} style={{
                  padding: "16px", borderRadius: 16, 
                  border: days === d.val ? "2px solid var(--text-primary)" : "1px solid var(--border)",
                  background: days === d.val ? "var(--text-primary)" : "var(--bg)",
                  color: days === d.val ? "var(--bg)" : "var(--text-primary)",
                  fontWeight: days === d.val ? 600 : 500, fontSize: 14,
                  textAlign: "center"
                }}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={go} disabled={loading} style={{
            width: "100%", padding: "20px 0", borderRadius: 16, border: "none",
            background: loading ? "var(--border)" : "var(--green)",
            color: loading ? "var(--text-secondary)" : "white",
            fontWeight: 700, fontSize: 16,
            boxShadow: loading ? "none" : "0 4px 14px rgba(0, 208, 156, 0.3)",
          }}>
            {loading ? "Initializing..." : `Generate Report for ${days / 7} Week${days / 7 > 1 ? 's' : ''}`}
          </button>
          
          <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-tertiary)", marginTop: 24 }}>
            Aggregated entirely in Node. No PII is sent to Groq.
          </p>
        </div>
        
      </div>
    </div>
  );
}
