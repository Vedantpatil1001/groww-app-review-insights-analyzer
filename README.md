# Groww Insights 📊

An automated pipeline that scrapes live Groww app reviews from Google Play Store and Apple App Store, runs intelligent NLP analysis via Groq (LLaMA 3.3), and delivers a comprehensive dashboard and weekly health pulse to your product team.

## What It Does

1. **Scrapes** live reviews from Play Store + App Store (1 / 2 / 3 / 4 week windows).
2. **Classifies** reviews into 4 product themes using heuristics.
3. **Analyses** actionable intelligence, extracting sentiment distributions per theme, calculating a unified NPS proxy and calculating severity.
4. **Highlights** the Top 3 User Quotes, dynamically selecting the most notable English reviews and leveraging AI to summarize them into punchy, powerful 15-word actionable PM insights.
5. **Generates** a beautiful, grid-based dashboard with a structured pulse: theme breakdown, action roadmap timelines, positive highlights, and risk alerts.
6. **Emails** a rich HTML digest to your team via Gmail SMTP.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend API | Express / Custom Node Web Service |
| AI analysis | Groq AI API (`llama-3.3-70b-versatile`) |
| Play Store scraping | `google-play-scraper` |
| Email delivery | Nodemailer (Gmail) |

---

## Project Structure

\`\`\`text
groww-pulse/
├── functions/               ← Node.js backend handlers
│   ├── scrape.cjs           ← Layer 1: live Play Store + App Store scraper
│   ├── analyze.cjs          ← Layer 2-4: Groq AI aggregation, summarization + analysis
│   ├── send-email.cjs       ← Email delivery via Nodemailer (Gmail)
│   └── schedule.cjs         ← API for saved schedules (background)
├── src/
│   ├── components/
│   │   ├── HomeScreen.jsx     ← Premium Split-Screen Config UI
│   │   ├── PipelineScreen.jsx ← Minimalist circular progress indicator
│   │   └── ResultsScreen.jsx  ← Live dashboard, Top Quotes, Theme Bars, Actions Timeline
│   ├── lib/
│   │   └── api.js             ← API fetch wrappers (Detects local vs Vercel Prod Base)
│   ├── App.jsx                ← Root pipeline orchestration
│   ├── main.jsx
│   └── index.css              ← Global unified color palette (Inter Font + Groww branding)
├── server.cjs                 ← Backend production Node Server (port 9999) + cron scheduler
├── package.json
└── .env.example
\`\`\`

---

## Local Development

### Prerequisites

- Node.js 18+
- A free [Groq Console](https://console.groq.com) account for the API key
- A Gmail account with an App Password for email delivery

### Setup

\`\`\`bash
# 1. Clone the repo
git clone https://github.com/Vedantpatil1001/groww-app-review-insights-analyzer.git
cd groww-app-review-insights-analyzer

# 2. Install all dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and fill in your keys
\`\`\`

### Environment Variables

\`\`\`env
# Groq AI Key
GROQ_API_KEY=your_groq_api_key

# Gmail credentials for sending emails (Use an App Password)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
\`\`\`

### Running Locally

You need **two terminals** running simultaneously:

\`\`\`bash
# Terminal 1 — Backend Express Server (port 9999)
npm run dev:functions

# Terminal 2 — React Frontend (port 5173)
npm run dev
\`\`\`

Open **http://localhost:5173**

---

## Production Deployment (Free)

This project has been explicitly engineered to sit beautifully on scalable free tiers.

### 1. Deploy the Backend (Render)
1. Push this code to your GitHub repo.
2. Sign up on **Render.com** and deploy a *Web Service*.
3. Connect your repository, set build command to `npm install` and start command to `node server.cjs`.
4. Add all environment variables from your `.env` to the Render dashboard.
5. Copy your live Render URL (e.g. `https://groww-pulse.onrender.com`).

### 2. Deploy the Frontend (Vercel)
1. Sign up on **Vercel.com** and add your repository as a new *Vite* project.
2. Under "Environment Variables", set `VITE_API_BASE_URL` to your Render backend URL.
3. Turn **OFF** "Vercel Authentication" in Deployment Protection settings so it is public.
4. Deploy! It will automatically map and hit your Render API via the environmental hooks.

---

## How the Pipeline Works

\`\`\`text
User clicks "Generate Report"
        │
        ▼
Layer 1 ─ Scrape
  ├── google-play-scraper → Fetch massive batches of Play Store reviews
  └── iTunes RSS API      → Fetch Apple reviews
        │
        ▼
Layer 2 ─ Aggregate & Data Cleanse
  └── Strip invalid characters, calculate rating splits, 
      extract Top 15 robust English candidates for quoting.
        │
        ▼
Layer 3 ─ Groq AI Analysis
  └── AI receives mathematical aggregations + Top 15 raw quotes
      Returns: JSON containing selected top 3 quotes summarized, core pains, risk alert, 3 actions.
        │
        ▼
Layer 4 ─ Deliver
  ├── Render stunning Grid UI Dashboard (ResultsScreen.jsx)
  └── Dispatch HTML pulse email via SMTP NodeMailer
\`\`\`

### The 4 Themes

| Theme | Priority | What it tracks |
|---|---|---|
| ⚡ Execution & Performance | CRITICAL | Withdrawals, payment failures, OTP, crashes |
| 🪪 KYC & Identity | HIGH | Document rejection, video KYC drops, frozen accounts |
| 📊 Charges & Transparency | FOCUS | P&L errors, hidden fees, tax statements |
| 🎨 UI & Features | WATCH | Design, navigation, missing features |

---

## Privacy Architecture

- 99% of aggregation (Math, Theme Assignment, Splits) happens completely offline inside the `analyze.cjs` Node script.
- Only the 15 selected highest-entropy anonymous English reviews are ever injected into the Groq LLaMA prompt for Summarization, meaning no massive data payloads of user PII are blindly blasted to LLM APIs.
