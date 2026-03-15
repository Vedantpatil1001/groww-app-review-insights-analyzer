# Groww Review Pulse 📊

An automated pipeline that scrapes live Groww app reviews from Google Play Store and Apple App Store, runs AI analysis via Groq, and delivers a one-page weekly health pulse to your product team.

## What It Does

1. **Scrapes** live reviews from Play Store + App Store (7 / 14 / 21 / 28 day windows)
2. **Classifies** reviews into 4 product themes using heuristics + Groq AI
3. **Analyses** sentiment, NPS proxy, and priority scores — all aggregation happens in Node so no user PII reaches the AI
4. **Generates** a structured pulse: theme breakdown, action roadmap, positive highlights, risk alerts
5. **Emails** a rich HTML digest to your team via Gmail

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Serverless functions | Netlify Functions (Node.js) |
| AI analysis | Groq AI API |
| Play Store scraping | `google-play-scraper` |
| App Store scraping | iTunes RSS public API |
| Email delivery | Nodemailer (Gmail) |
| Hosting | Netlify |

---

## Project Structure

```text
groww-pulse/
├── functions/               ← Netlify serverless functions
│   ├── scrape.cjs           ← Layer 1: live Play Store + App Store scraper
│   ├── analyze.cjs          ← Layer 2-4: Groq AI aggregation + analysis
│   ├── send-email.cjs       ← Email delivery via Nodemailer (Gmail)
│   ├── schedule.cjs         ← API for saved schedules (background)
│   └── package.json         ← Function-specific deps
├── src/
│   ├── components/
│   │   ├── HomeScreen.jsx   ← Config UI: window slider
│   │   ├── PipelineScreen.jsx ← Animated progress indicator
│   │   └── ResultsScreen.jsx  ← Masthead, stats, theme cards, actions, email trigger
│   ├── lib/
│   │   └── api.js           ← API fetch wrappers
│   ├── App.jsx              ← Root pipeline orchestration
│   ├── main.jsx
│   └── index.css
├── server.cjs               ← Local dev HTTP server (port 9999) + cron scheduler
├── vite.config.js           ← Dev proxy: /.netlify/functions/* → localhost:9999
├── package.json
└── .env.example
```

---

## Local Development

### Prerequisites

- Node.js 18+
- A free [Groq Console](https://console.groq.com) account for the API key
- A Gmail account with an App Password for email delivery

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/Vedantpatil1001/groww-app-review-insights-analyzer.git
cd groww-app-review-insights-analyzer

# 2. Install all dependencies
npm install
cd functions && npm install && cd ..

# 3. Set up environment variables
cp .env.example .env
# Edit .env and fill in your keys
```

### Environment Variables

```env
# Groq AI Key
GROQ_API_KEY=your_groq_api_key

# Gmail credentials for sending emails (Use an App Password)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Optional: Default recipients for the email digest (comma-separated)
TEAM_EMAILS=pm@company.com,ceo@company.com
```

### Running Locally

You need **two terminals** running simultaneously:

```bash
# Terminal 1 — functions server + scheduler (port 9999)
npm run dev:functions

# Terminal 2 — React app (port 5173)
npm run dev
```

Open **http://localhost:5173**

The Vite dev server proxies all `/.netlify/functions/*` requests to `localhost:9999`, so everything works identically to production.

---

## How the Pipeline Works

```text
User clicks "Run Pulse"
        │
        ▼
Layer 1 ─ Scrape
  ├── google-play-scraper → up to 200 Play Store reviews
  └── iTunes RSS API      → up to 100 App Store reviews
        │
        ▼
Layer 2 ─ Aggregate (in Node.js — no PII sent to AI)
  └── Count reviews per theme, calculate avg ratings,
      sentiment splits, NPS proxy
        │
        ▼
Layer 3 ─ Groq AI Analysis
  └── Receives only aggregated numbers (counts, averages)
      Returns: headline, core pains, risk alert, 3 actions, email copy
        │
        ▼
Layer 4 ─ Deliver
  ├── Display results in UI
  └── Send HTML email via Gmail (Nodemailer)
```

### The 4 Themes

| Theme | Priority | What it tracks |
|---|---|---|
| ⚡ Execution & Performance | CRITICAL | Withdrawals, payment failures, OTP, crashes |
| 🪪 KYC & Identity | HIGH | Document rejection, video KYC drops, frozen accounts |
| 📊 Charges & Transparency | FOCUS | P&L errors, hidden fees, tax statements |
| 🎨 UI & Features | WATCH | Design, navigation, missing features |

---

## API Reference

All functions are called via `POST /.netlify/functions/<name>`.

### `POST /scrape`
```json
// Request
{ "windowDays": 7 }

// Response
{
  "reviews": [...],
  "fromDate": "2024-01-01",
  "toDate": "2024-01-07",
  "total": 362,
  "sources": { "playStore": 200, "appStore": 162 }
}
```

### `POST /analyze`
```json
// Request
{ "reviews": [...], "windowDays": 7, "fromDate": "...", "toDate": "..." }

// Response
{
  "overview": { "headline": "...", "sentiment": "mixed" },
  "themes": [...],
  "actions": [...],
  "stats": { "total": 362, "avg": "3.2", "pos": 120, "neg": 180, "nps": -16 },
  "email": { "subject": "...", "plain": "..." }
}
```

### `POST /send-email`
```json
// Request (recipient falls back to env vars if omitted)
{ "subject": "...", "plain": "...", "themes": [...], "actions": [...], "stats": {...} }
```

---

## Privacy

- No user review text is ever sent to Groq or any external AI service.
- Only aggregated statistics (counts, averages) reach the AI.
- No data is stored permanently — reviews exist only in memory during a pipeline run.

---

## License

nidhipawar5