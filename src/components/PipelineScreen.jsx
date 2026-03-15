// A cleanly animated, minimalist loading screen
const MESSAGES = [
  "Scraping recent reviews from Play Store...",
  "Fetching iOS reviews from App Store...",
  "Analyzing unstructured text via Groq AI...",
  "Classifying sentiment and core pain points...",
  "Structuring action roadmap...",
  "Finalizing dashboard..."
];

export default function PipelineScreen({ layers }) {
  // Use layers.active (1-5) to show messages
  const msgIndex = Math.min(Math.max(0, layers.active - 1), MESSAGES.length - 1);
  const percent = Math.min(100, Math.round((layers.active / 5) * 100));

  return (
    <div className="animate-fade-in" style={{ 
      flex: 1, display: "flex", flexDirection: "column", 
      alignItems: "center", justifyContent: "center", 
      height: "100%", paddingBottom: "10vh" 
    }}>
      
      {/* Circular Progress Element */}
      <div style={{ position: "relative", width: 120, height: 120, marginBottom: 40 }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
          <circle cx="50" cy="50" r="46" fill="transparent" stroke="var(--border)" strokeWidth="6" />
          <circle 
            cx="50" cy="50" r="46" fill="transparent" 
            stroke="var(--green)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray="289" strokeDashoffset={289 - (289 * percent) / 100}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="animate-spin" style={{ 
          position: "absolute", inset: 16, border: "2px solid var(--border-focus)", 
          borderTopColor: "transparent", borderRadius: "50%" 
        }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          {percent}%
        </div>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12 }}>
        Processing Data
      </h2>
      
      <p style={{ fontSize: 16, color: "var(--text-secondary)", height: 24, transition: "all 0.3s" }}>
        {MESSAGES[msgIndex]}
      </p>

    </div>
  );
}
