import { useState } from "react";
import { sendEmail } from "../lib/api.js";

const THEME_META = {
  "Execution & Performance": { color: "var(--red)", icon: "⚡" },
  "KYC & Identity":          { color: "var(--amber)", icon: "🛡️" },
  "Charges & Transparency":  { color: "var(--green)", icon: "💳" },
  "UI & Features":           { color: "var(--blue)", icon: "✨" },
};

function Metric({ label, value, highlight }) {
  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ fontSize: 13, color: "var(--text-tertiary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
        {label}
      </div>
      <div style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, color: highlight ? "var(--green)" : "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}

function ThemeCard({ theme }) {
  const m = THEME_META[theme.name] || { color: "var(--blue)", icon: "📌" };
  const pct = n => Math.max(0, Math.min(100, n || 0));

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 24, padding: 32, transition: "transform 0.2s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
          {m.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.01em", color: "var(--text-primary)", marginBottom: 4 }}>{theme.name}</h3>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{theme.corePain}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24, background: "var(--bg)", padding: 16, borderRadius: 16, border: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.05em", marginBottom: 4 }}>REVIEWS</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)" }}>{theme.reviewCount}</div>
        </div>
        <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.05em", marginBottom: 4 }}>AVG RATING</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)" }}>{theme.avgRating}★</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 8 }}>
        {/* Bold visual split text */}
        <div style={{ display: "flex", gap: 12, fontWeight: 800, fontSize: 13, letterSpacing: "0.05em" }}>
          <span style={{ color: "var(--green)" }}>{theme.sentiment_split?.positive ?? 0}% P</span>
          <span style={{ color: "var(--text-tertiary)" }}>{theme.sentiment_split?.neutral ?? 0}% N</span>
          <span style={{ color: "var(--red)" }}>{theme.sentiment_split?.negative ?? 0}% N</span>
        </div>
        
        {/* Redesigned thicker discrete bar segments */}
        <div style={{ flex: 1, display: "flex", gap: 4, height: 8 }}>
          <div style={{ width: `${pct(theme.sentiment_split?.positive)}%`, background: "var(--green)", borderRadius: 4 }} />
          <div style={{ width: `${pct(theme.sentiment_split?.neutral)}%`, background: "var(--border)", borderRadius: 4 }} />
          <div style={{ width: `${pct(theme.sentiment_split?.negative)}%`, background: "var(--red)", borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

export default function ResultsScreen({ result, meta }) {
  const [emailStatus, setEmailStatus] = useState("idle");

  const { overview, themes, positiveHighlight, riskAlert, actions, stats, email } = result;
  const npsStr = stats.nps >= 0 ? `+${stats.nps}` : String(stats.nps);

  async function handleSendEmail() {
    setEmailStatus("sending");
    try {
      await sendEmail({ subject: email?.subject, plain: email?.plain, themes, actions, stats, fromDate: meta?.fromDate, toDate: meta?.toDate, positiveHighlight, riskAlert, headline: overview?.headline });
      setEmailStatus("sent");
    } catch (e) {
      setEmailStatus("error");
    }
  }

  return (
    <div className="animate-fade-in" style={{ padding: "0 32px 64px", maxWidth: 1400, margin: "0 auto" }}>
      
      {/* Top Split Header (Matches HomeScreen branding) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10%", marginBottom: 64, alignItems: "center" }}>
        
        {/* Left: Summary */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--blue-light)", color: "var(--blue-hover)", padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--blue)" }} />
            INSIGHTS GENERATED
          </div>
          
          <h1 style={{ fontSize: "clamp(36px, 4.5vw, 64px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: 24 }}>
            {overview?.headline}
          </h1>
          
          <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 540 }}>
            {positiveHighlight}
          </p>
        </div>

        {/* Right: Big Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", background: "var(--surface)", padding: 40, borderRadius: 24, border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
          <Metric label="Average Rating" value={`${stats.avg}★`} highlight />
        </div>
      </div>

      {riskAlert && (
        <div style={{ background: "var(--red-light)", border: "1px solid #FECACA", borderRadius: 16, padding: "24px 32px", marginBottom: 64, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>⚠️</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--red)", letterSpacing: "0.08em", marginBottom: 4 }}>CRITICAL RISK ALERT</div>
            <div style={{ fontSize: 16, color: "#7F1D1D", fontWeight: 500 }}>{riskAlert}</div>
          </div>
        </div>
      )}

      {/* Grid: Themes and Actions side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 80 }}>
        
        {/* Themes Column */}
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--text-primary)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>1</div>
            Core Themes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {(themes || []).map(t => <ThemeCard key={t.name} theme={t} />)}
          </div>
        </div>

        {/* Actions Column */}
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--green)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>2</div>
            Action Roadmap
          </h2>
          
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 24, padding: "40px 32px", display: "flex", flexDirection: "column", gap: 40 }}>
            {(actions || []).map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 24 }}>
                <div style={{ flexShrink: 0, width: 2, background: i === actions.length -1 ? "transparent" : "var(--border)", position: "relative", marginLeft: "11px" }}>
                  <div style={{ position: "absolute", top: 0, left: -11, width: 24, height: 24, borderRadius: "50%", background: "var(--bg)", border: "2px solid var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>
                    {i+1}
                  </div>
                </div>
                <div style={{ paddingBottom: i === actions.length - 1 ? 0 : 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em", color: "var(--text-primary)", marginBottom: 8, marginTop: -2 }}>{a.title}</h3>
                  <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16 }}>{a.description}</p>
                  <div style={{ display: "flex", gap: 16, fontSize: 12, fontWeight: 600, color: "var(--text-tertiary)" }}>
                    <span style={{ background: "var(--bg)", padding: "4px 12px", borderRadius: 100, border: "1px solid var(--border)" }}>👤 {a.owner}</span>
                    <span style={{ background: "var(--bg)", padding: "4px 12px", borderRadius: 100, border: "1px solid var(--border)" }}>⏳ {a.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>

      {/* New Top 3 Quotes Section */}
      {result.topQuotes && result.topQuotes.length > 0 && (
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--blue)", color: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>3</div>
            Top User Quotes
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {result.topQuotes.map((q, i) => (
              <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 24, padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ fontSize: 40, color: "var(--border-focus)", lineHeight: 0.5, fontFamily: "serif" }}>"</div>
                <p style={{ fontSize: 15, color: "var(--text-primary)", lineHeight: 1.6, flex: 1, fontStyle: "italic" }}>
                  {q.text.length > 150 ? q.text.slice(0, 150) + "..." : q.text}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                  <div style={{ display: "flex", gap: 4, color: q.rating >= 4 ? "var(--green)" : q.rating <= 2 ? "var(--red)" : "var(--amber)", fontSize: 14 }}>
                    {"★".repeat(q.rating)}{"☆".repeat(5-q.rating)}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 600 }}>{q.platform}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Block */}
      <div style={{ background: "var(--text-primary)", color: "var(--bg)", borderRadius: 24, padding: 48, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "var(--shadow-lg)" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 8 }}>Distribute Insights</h2>
          <p style={{ fontSize: 16, color: "var(--text-tertiary)", maxWidth: 400 }}>Send this compiled dashboard via email to your configured product team aliases.</p>
        </div>
        <button onClick={handleSendEmail} disabled={emailStatus === "sending" || emailStatus === "sent"} style={{
          padding: "20px 40px", borderRadius: 16, border: "none",
          background: emailStatus === "sent" ? "var(--green)" : "var(--bg)",
          color: emailStatus === "sent" ? "var(--bg)" : "var(--text-primary)",
          fontWeight: 800, fontSize: 16,
          boxShadow: emailStatus === "sent" ? "none" : "0 4px 14px rgba(255,255,255,0.15)",
        }}>
          {emailStatus === "sending" ? "Dispatching Email..." : emailStatus === "sent" ? "✓ Successfully Sent" : "Email Digest"}
        </button>
      </div>

    </div>
  );
}
