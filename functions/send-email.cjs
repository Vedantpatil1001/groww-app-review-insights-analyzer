const nodemailer = require("nodemailer");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const PRIORITY_BADGE = {
  CRITICAL: { bg: "#FFF5F5", color: "#C53030", border: "#FEB2B2" },
  HIGH:     { bg: "#FFFBEB", color: "#B45309", border: "#FCD34D" },
  FOCUS:    { bg: "#EBF8FF", color: "#2B6CB0", border: "#90CDF4" },
  WATCH:    { bg: "#F7FAFC", color: "#718096", border: "#E2E8F0" },
};

function htmlEmail({ headline, fromDate, toDate, stats, themes, actions, positiveHighlight, riskAlert }) {
  const fmt    = iso => { try { return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return iso; } };
  const npsStr = stats.nps >= 0 ? `+${stats.nps}` : String(stats.nps);

  const badge = (priority) => {
    const s = PRIORITY_BADGE[priority] || PRIORITY_BADGE.WATCH;
    return `<span style="display:inline-block;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;letter-spacing:0.06em;background:${s.bg};color:${s.color};border:1px solid ${s.border}">${priority}</span>`;
  };

  const themeRows = (themes || []).map(t => `
    <tr>
      <td style="padding:11px 14px;border-bottom:1px solid #EDF2F7;font-weight:600;font-size:13px;color:#1A1A2E;">${t.name} ${badge(t.priority)}</td>
      <td style="padding:11px 14px;border-bottom:1px solid #EDF2F7;color:#718096;font-size:13px;">${t.reviewCount} reviews</td>
      <td style="padding:11px 14px;border-bottom:1px solid #EDF2F7;color:#718096;font-size:13px;">${t.avgRating}★</td>
      <td style="padding:11px 14px;border-bottom:1px solid #EDF2F7;color:#4A5568;font-size:13px;">${t.corePain || ""}</td>
    </tr>`).join("");

  const actionRows = (actions || []).map((a, i) => `
    <tr>
      <td style="padding:11px 14px;border-bottom:1px solid #EDF2F7;">
        <span style="font-weight:700;font-size:13px;color:#1A1A2E;">${i + 1}. ${a.title}</span>
        ${badge(a.priority)}
      </td>
      <td style="padding:11px 14px;border-bottom:1px solid #EDF2F7;color:#718096;font-size:12px;">${a.owner}</td>
      <td style="padding:11px 14px;border-bottom:1px solid #EDF2F7;color:#718096;font-size:12px;">${a.timeline}</td>
      <td style="padding:11px 14px;border-bottom:1px solid #EDF2F7;color:#4A5568;font-size:12px;">${a.description}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#F7F9FC;font-family:'Helvetica Neue',Arial,sans-serif;color:#1A1A2E;">
  <div style="max-width:660px;margin:0 auto;padding:28px 16px;">

    <!-- Header -->
    <div style="background:#00C853;border-radius:14px 14px 0 0;padding:24px 28px;display:flex;align-items:center;gap:14px;">
      <div style="width:42px;height:42px;border-radius:10px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#fff;font-family:inherit;">G</div>
      <div>
        <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;color:rgba(255,255,255,0.85);text-transform:uppercase;">Groww Review Pulse</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.75);margin-top:2px;">${fmt(fromDate)} – ${fmt(toDate)}</div>
      </div>
    </div>

    <!-- Headline card -->
    <div style="background:#ffffff;border:1px solid #E2E8F0;border-top:none;padding:22px 28px;border-radius:0 0 0 0;">
      <h1 style="margin:0;font-size:19px;font-weight:800;line-height:1.35;color:#1A1A2E;letter-spacing:-0.02em;">${headline || "Weekly Review Summary"}</h1>
    </div>

    <!-- Stats row -->
    <table style="width:100%;border-collapse:separate;border-spacing:6px;margin:6px 0;" cellpadding="0" cellspacing="6">
      <tr>
        ${[["Total Reviews", stats.total, "#00C853"], ["Avg Rating", stats.avg + "★", "#00417A"], ["NPS Proxy", npsStr, "#00417A"], ["Negative", stats.neg, "#E53E3E"]].map(([l, v, c]) =>
          `<td style="background:#ffffff;border:1px solid #E2E8F0;border-radius:10px;padding:14px;text-align:center;"><div style="font-size:21px;font-weight:800;color:${c};">${v}</div><div style="font-size:11px;color:#718096;margin-top:3px;">${l}</div></td>`
        ).join("")}
      </tr>
    </table>

    <!-- Positive + Risk -->
    <table style="width:100%;border-collapse:separate;border-spacing:6px;margin:0 0 6px;" cellpadding="0" cellspacing="6">
      <tr>
        <td style="background:#F0FFF4;border:1px solid #9AE6B4;border-radius:10px;padding:16px;vertical-align:top;width:50%;">
          <div style="font-size:11px;font-weight:700;color:#276749;letter-spacing:0.06em;margin-bottom:6px;">✓ POSITIVE HIGHLIGHT</div>
          <div style="font-size:13px;color:#22543D;line-height:1.6;">${positiveHighlight || ""}</div>
        </td>
        <td style="background:#FFF5F5;border:1px solid #FEB2B2;border-radius:10px;padding:16px;vertical-align:top;width:50%;">
          <div style="font-size:11px;font-weight:700;color:#C53030;letter-spacing:0.06em;margin-bottom:6px;">⚠ RISK ALERT</div>
          <div style="font-size:13px;color:#742A2A;line-height:1.6;">${riskAlert || ""}</div>
        </td>
      </tr>
    </table>

    <!-- Themes -->
    <div style="background:#ffffff;border:1px solid #E2E8F0;border-radius:10px;margin-bottom:6px;overflow:hidden;">
      <div style="padding:14px 16px;border-bottom:1px solid #EDF2F7;background:#F7F9FC;">
        <span style="font-size:12px;font-weight:700;color:#718096;letter-spacing:0.07em;text-transform:uppercase;">Theme Breakdown</span>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#F7F9FC;">
            <th style="padding:8px 14px;font-size:11px;font-weight:700;color:#718096;text-align:left;letter-spacing:0.05em;">THEME</th>
            <th style="padding:8px 14px;font-size:11px;font-weight:700;color:#718096;text-align:left;letter-spacing:0.05em;">REVIEWS</th>
            <th style="padding:8px 14px;font-size:11px;font-weight:700;color:#718096;text-align:left;letter-spacing:0.05em;">AVG</th>
            <th style="padding:8px 14px;font-size:11px;font-weight:700;color:#718096;text-align:left;letter-spacing:0.05em;">CORE PAIN</th>
          </tr>
        </thead>
        <tbody>${themeRows}</tbody>
      </table>
    </div>

    <!-- Actions -->
    <div style="background:#ffffff;border:1px solid #E2E8F0;border-radius:10px;margin-bottom:20px;overflow:hidden;">
      <div style="padding:14px 16px;border-bottom:1px solid #EDF2F7;background:#F7F9FC;">
        <span style="font-size:12px;font-weight:700;color:#718096;letter-spacing:0.07em;text-transform:uppercase;">Action Roadmap</span>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#F7F9FC;">
            <th style="padding:8px 14px;font-size:11px;font-weight:700;color:#718096;text-align:left;letter-spacing:0.05em;">ACTION</th>
            <th style="padding:8px 14px;font-size:11px;font-weight:700;color:#718096;text-align:left;letter-spacing:0.05em;">OWNER</th>
            <th style="padding:8px 14px;font-size:11px;font-weight:700;color:#718096;text-align:left;letter-spacing:0.05em;">BY</th>
            <th style="padding:8px 14px;font-size:11px;font-weight:700;color:#718096;text-align:left;letter-spacing:0.05em;">DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>${actionRows}</tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="text-align:center;color:#A0AEC0;font-size:11px;padding:6px 0 12px;">
      Pulse Bot · Automated Digest · Groww Review Analyzer
    </div>

  </div>
</body></html>`;
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };

  let body;
  try { body = JSON.parse(event.body || "{}"); }
  catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid JSON" }) }; }

  const { to, subject, plain, themes, actions, stats, fromDate, toDate, positiveHighlight, riskAlert, headline } = body;

  const gmailUser = process.env.GMAIL_USER;
  const finalTo = to || process.env.TEAM_EMAILS || gmailUser;

  if (!finalTo) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "to is required and no default configured" }) };
  if (!subject) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "subject is required" }) };

  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "GMAIL_USER not set in .env" }) };
  if (!gmailPass) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "GMAIL_APP_PASSWORD not set in .env" }) };

  const recipients = finalTo.split(",").map(s => s.trim()).filter(Boolean);
  const html = htmlEmail({ headline, fromDate, toDate, stats: stats || { total: 0, avg: 0, nps: 0, neg: 0 }, themes: themes || [], actions: actions || [], positiveHighlight, riskAlert });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Groww Review Pulse" <${gmailUser}>`,
      to: recipients.join(", "),
      subject,
      html,
      text: plain || subject,
    });
    console.log("[email] sent:", info.messageId);
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true, id: info.messageId }) };
  } catch (e) {
    console.error("[email] error:", e.message);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
};
