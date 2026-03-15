const STEPS = [
  { id:1, icon:"🔍", label:"Scraping Reviews",  desc:"Fetching live data from Play Store & App Store" },
  { id:2, icon:"🧠", label:"Classifying Themes", desc:"Groq AI is categorising reviews into themes" },
  { id:3, icon:"⚡", label:"Generating Insights",desc:"Building theme analysis & priority scores" },
  { id:4, icon:"📋", label:"Creating Actions",   desc:"Drafting action roadmap and email digest" },
];

export default function PipelineScreen({ layers }) {
  const { active, done } = layers;

  return (
    <div className="fade-up" style={{ maxWidth: 560, margin: "0 auto", paddingTop: 20 }}>
      <h2 style={{ fontWeight: 800, fontSize: 24, textAlign: "center", marginBottom: 8, color: "var(--text)", letterSpacing: "-0.02em" }}>
        Running Pulse Pipeline
      </h2>
      <p style={{ color: "var(--sub)", textAlign: "center", fontSize: 14, marginBottom: 36 }}>
        This takes about 30–60 seconds. Please wait…
      </p>

      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 4, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        {STEPS.map(step => {
          const isDone    = done.includes(step.id);
          const isActive  = active === step.id;

          return (
            <div key={step.id} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "14px 16px", borderRadius: 12, background: isActive ? "var(--green-l)" : "transparent", border: isActive ? "1px solid #A7F3D0" : "1px solid transparent", transition: "all .3s" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                background: isDone ? "var(--green)" : isActive ? "var(--white)" : "var(--bg)",
                border: `1px solid ${isDone ? "var(--green)" : isActive ? "var(--green)" : "var(--border)"}`,
                boxShadow: isActive ? "0 0 0 4px var(--green-l)" : "none",
              }}>
                {isDone ? <span style={{ color: "var(--white)", fontWeight: 900 }}>✓</span>
                 : isActive ? <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid var(--green)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                 : <span style={{ opacity: .5 }}>{step.icon}</span>}
              </div>

              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: isDone ? "var(--green-d)" : isActive ? "var(--green-d)" : "var(--sub)", transition: "color .3s" }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{step.desc}</div>
              </div>

              <div style={{ fontSize: 12, color: isDone ? "var(--green)" : isActive ? "var(--green)" : "var(--muted)", fontWeight: isDone||isActive ? 700 : 500, paddingTop: 4, animation: isActive ? "pulse 1.5s ease infinite" : "none" }}>
                {isDone ? "Done" : isActive ? "Running…" : "Waiting"}
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 24 }}>
        Groww Pulse · Live data · No PII stored
      </p>
    </div>
  );
}
