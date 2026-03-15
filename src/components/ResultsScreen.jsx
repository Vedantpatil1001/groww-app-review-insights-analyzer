import { useState } from "react";
import { sendEmail } from "../lib/api.js";

const THEME_META = {
  "Execution & Performance": { color: "var(--red)", icon: "⚡" },
  "KYC & Identity":          { color: "var(--amber)", icon: "🪪" },
  "Charges & Transparency":  { color: "var(--green)", icon: "📊" },
  "UI & Features":           { color: "var(--navy)", icon: "🎨" },
};

const PRIORITY_STYLE = {
  CRITICAL: { badge: "var(--red)", bg: "var(--red-l)", border: "#FEB2B2" },
  HIGH:     { badge: "var(--amber)", bg: "var(--amber-l)", border: "#FDE68A" },
  FOCUS:    { badge: "var(--green-d)", bg: "var(--green-l)", border: "#A7F3D0" },
  WATCH:    { badge: "var(--navy)", bg: "var(--navy-l)", border: "#BFDBFE" },
};

const fmt = iso => iso ? new Date(iso).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "";

function Badge({ priority }) {
  const s = PRIORITY_STYLE[priority] || PRIORITY_STYLE.WATCH;
  return <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", padding: "3px 10px", borderRadius: 99, background: s.bg, color: s.badge, border: `1px solid ${s.border}` }}>{priority}</span>;
}

function Stat({ label, value, highlight }) {
  return (
    <div style={{ flex: 1, minWidth: 90, background: "var(--white)", border: highlight ? "1px solid var(--green)" : "1px solid var(--border)", borderRadius: 12, padding: "16px 12px", textAlign: "center", boxShadow: highlight ? "0 4px 12px rgba(0,200,83,0.1)" : "none" }}>
      <div style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 800, color: highlight ? "var(--green)" : "var(--text)" }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--sub)", marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function ThemeCard({ theme }) {
  const [open, setOpen] = useState(false);
  const m = THEME_META[theme.name] || { color: "var(--navy)", icon: "●" };
  const pct = n => Math.max(0, Math.min(100, n || 0));

  return (
    <div onClick={() => setOpen(o => !o)} style={{ cursor: "pointer", background: "var(--white)", border: open ? `1px solid ${m.color}` : "1px solid var(--border)", borderRadius: 16, padding: 20, transition: "all .2s", boxShadow: open ? "0 4px 12px rgba(0,0,0,0.05)" : "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{m.icon}</div>
        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: "var(--text)" }}>{theme.name}</span>
            <Badge priority={theme.priority} />
          </div>
          <div style={{ fontSize: 13, color: "var(--sub)" }}>{theme.corePain}</div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: m.color }}>{theme.reviewCount}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>reviews</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text)" }}>{theme.avgRating}★</div>
            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>avg</div>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 14, marginLeft: 8, background: "var(--bg)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{open ? "▲" : "▼"}</div>
        </div>
      </div>

      <div style={{ marginTop: 18, height: 6, borderRadius: 3, overflow: "hidden", display: "flex", gap: 2, background: "var(--bg)" }}>
        <div style={{ flex: pct(theme.sentiment_split?.positive), background: "var(--green)", transition: "flex .4s" }} />
        <div style={{ flex: pct(theme.sentiment_split?.neutral),  background: "var(--muted)", transition: "flex .4s" }} />
        <div style={{ flex: pct(theme.sentiment_split?.negative), background: "var(--red)",    transition: "flex .4s" }} />
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
        <span style={{ color: "var(--green-d)" }}>● {theme.sentiment_split?.positive ?? 0}% pos</span>
        <span>● {theme.sentiment_split?.neutral ?? 0}% neu</span>
        <span style={{ color: "var(--red)" }}>● {theme.sentiment_split?.negative ?? 0}% neg</span>
      </div>

      {open && (
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)", animation: "fadeUp 0.3s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ padding: 16, background: "var(--red-l)", border: "1px solid #FEB2B2", borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: "var(--red)", fontWeight: 700, marginBottom: 8, letterSpacing: "0.05em" }}>NEGATIVE COUNT</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--red)" }}>{theme.negativeCount}</div>
              <div style={{ fontSize: 12, color: "var(--sub)" }}>out of {theme.reviewCount} reviews</div>
            </div>
            <div style={{ padding: 16, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: "var(--sub)", fontWeight: 700, marginBottom: 8, letterSpacing: "0.05em" }}>CORE PAIN</div>
              <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>{theme.corePain}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsScreen({ result, meta }) {
  const [emailStatus, setEmailStatus] = useState("idle");
  const [emailError,  setEmailError]  = useState("");

  const { overview, themes, positiveHighlight, riskAlert, actions, stats, email } = result;
  const npsStr = stats.nps >= 0 ? `+${stats.nps}` : String(stats.nps);

  async function handleSendEmail() {
    setEmailStatus("sending"); setEmailError("");
    try {
      await sendEmail({ subject: email?.subject, plain: email?.plain, themes, actions, stats, fromDate: meta?.fromDate, toDate: meta?.toDate, positiveHighlight, riskAlert, headline: overview?.headline });
      setEmailStatus("sent");
    } catch (e) {
      setEmailError(e.message);
      setEmailStatus("error");
    }
  }

  return (
    <div className="fade-up">
      {/* Masthead */}
      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 32px", marginBottom: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--green-d)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>
              GROWW PULSE · {fmt(meta?.fromDate)} – {fmt(meta?.toDate)}
            </div>
            <h1 style={{ fontWeight: 800, fontSize: "clamp(20px, 3.5vw, 28px)", lineHeight: 1.25, maxWidth: 640, color: "var(--text)", letterSpacing: "-0.01em" }}>
              {overview?.headline}
            </h1>
          </div>
          {meta?.sources && (
            <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
              {[["🤖",meta.sources.playStore,"Play Store"],["🍎",meta.sources.appStore,"App Store"]].map(([icon,n,lbl]) => (
                <div key={lbl} style={{ textAlign: "center", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text)" }}>{n}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{lbl}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <Stat label="Total Reviews"  value={stats.total} highlight />
          <Stat label="Avg Rating"     value={`${stats.avg}★`} />
          <Stat label="Positive"       value={stats.pos} />
          <Stat label="Negative"       value={stats.neg} />
          <Stat label="Sentiment NPS"  value={npsStr} highlight />
        </div>
      </div>

      {/* Positive + Risk */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        <div style={{ background: "var(--green-l)", border: "1px solid var(--green)", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--green-d)", fontWeight: 700, marginBottom: 12, letterSpacing: "0.04em" }}>
            <span style={{ fontSize: 16 }}>✨</span> POSITIVE HIGHLIGHT
          </div>
          <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.5 }}>{positiveHighlight}</p>
        </div>
        <div style={{ background: "var(--red-l)", border: "1px solid var(--red)", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--red)", fontWeight: 700, marginBottom: 12, letterSpacing: "0.04em" }}>
            <span style={{ fontSize: 16 }}>⚠️</span> RISK ALERT
          </div>
          <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.5 }}>{riskAlert}</p>
        </div>
      </div>

      <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 16, color: "var(--text)" }}>Theme Breakdown</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {(themes || []).map(t => <ThemeCard key={t.name} theme={t} />)}
      </div>

      <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 16, color: "var(--text)" }}>Action Roadmap</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
        {(actions || []).map((a, i) => {
          const m = THEME_META[a.theme] || { color: "var(--navy)" };
          return (
            <div key={i} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, display: "flex", gap: 16, alignItems: "flex-start", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: m.color, flexShrink: 0 }}>{i+1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 800, fontSize: 16, color: "var(--text)" }}>{a.title}</span>
                  <Badge priority={a.priority} />
                  <span style={{ fontSize: 12, color: "var(--sub)", background: "var(--bg)", padding: "4px 10px", borderRadius: 99, border: "1px solid var(--border)", fontWeight: 500 }}>⏱ {a.timeline}</span>
                  <span style={{ fontSize: 12, color: "var(--sub)", background: "var(--bg)", padding: "4px 10px", borderRadius: 99, border: "1px solid var(--border)", fontWeight: 500 }}>👤 {a.owner}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text)", marginBottom: 8, lineHeight: 1.5 }}>{a.description}</p>
                <div style={{ fontSize: 13, color: "var(--sub)", fontWeight: 500 }}>📏 {a.successMetric}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: "var(--text)" }}>Share Insights</h2>
        <p style={{ fontSize: 14, color: "var(--sub)", marginBottom: 20, lineHeight: 1.5 }}>Send this pulse to the preset team mailing list. Subject: <span style={{ color: "var(--navy)", fontWeight: 600 }}>{email?.subject}</span></p>

        <button onClick={handleSendEmail} disabled={emailStatus === "sending"} style={{
          padding: "12px 24px", borderRadius: 10, border: "none", cursor: emailStatus === "sending" ? "not-allowed" : "pointer",
          background: emailStatus === "sent" ? "var(--green-l)" : "var(--navy)",
          color: emailStatus === "sent" ? "var(--green-d)" : "var(--white)",
          fontWeight: 700, fontSize: 14, fontFamily: "inherit", transition: "all .2s"
        }}>
          {emailStatus === "sending" ? "Sending…" : emailStatus === "sent" ? "✓ Sent to Team!" : "Send Email to Team"}
        </button>

        {emailStatus === "error" && <p style={{ color: "var(--red)", fontSize: 14, marginTop: 12, fontWeight: 500 }}>⚠ {emailError}</p>}
      </div>
    </div>
  );
}
