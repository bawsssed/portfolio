import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Resend } from "resend";

dotenv.config();

const PORT = process.env.PORT || 3001;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MY_EMAIL = process.env.MY_EMAIL;

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY is not set");
  process.exit(1);
}
if (!MY_EMAIL) {
  console.error("MY_EMAIL is not set");
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);
const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "10kb" }));

const requestsByIp = new Map();

const isRateLimited = (ip) => {
  const now = Date.now();
  const recent = (requestsByIp.get(ip) || []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requestsByIp.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestsByIp.set(ip, recent);
  return false;
};

setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of requestsByIp.entries()) {
    const recent = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) requestsByIp.delete(ip);
    else requestsByIp.set(ip, recent);
  }
}, 15 * 60 * 1000);

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const looksLikeSpam = (text) => {
  const urlMatches = text.match(/https?:\/\//gi);
  return urlMatches ? urlMatches.length > 5 : false;
};

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Portfolio server is running" });
});

app.post("/api/send-email", async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || "unknown";

    if (isRateLimited(ip)) {
      return res.status(429).json({
        success: false,
        error: "Слишком много запросов. Попробуйте позже.",
      });
    }

    const { name, email, projectType, message, website } = req.body || {};

    if (website && String(website).trim().length > 0) {
      return res.json({ success: true });
    }

    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const trimmedProjectType =
      typeof projectType === "string" ? projectType.trim() : "";
    const trimmedMessage =
      typeof message === "string" ? message.trim() : "";

    if (trimmedName.length < 2 || trimmedName.length > 80) {
      return res
        .status(400)
        .json({ success: false, error: "Введите корректное имя." });
    }

    if (!isValidEmail(trimmedEmail) || trimmedEmail.length > 120) {
      return res
        .status(400)
        .json({ success: false, error: "Введите корректный email." });
    }

    if (!trimmedProjectType || trimmedProjectType.length > 80) {
      return res
        .status(400)
        .json({ success: false, error: "Выберите тип проекта." });
    }

    if (trimmedMessage.length < 12 || trimmedMessage.length > 5000) {
      return res.status(400).json({
        success: false,
        error: "Сообщение должно содержать от 12 до 5000 символов.",
      });
    }

    if (looksLikeSpam(trimmedMessage)) {
      return res
        .status(400)
        .json({ success: false, error: "Сообщение отклонено." });
    }

    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeProjectType = escapeHtml(trimmedProjectType);
    const safeMessage = escapeHtml(trimmedMessage).replaceAll("\n", "<br />");
    const timestamp = new Date().toLocaleString("ru-RU", {
      dateStyle: "long",
      timeStyle: "short",
    });

    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: MY_EMAIL,
      replyTo: trimmedEmail,
      subject: `Новое сообщение от ${trimmedName} — ${trimmedProjectType}`,
      html: `
        <div style="background:#0a0a0a;color:#ffffff;font-family:Arial,sans-serif;padding:32px;line-height:1.6;max-width:640px;margin:0 auto;">
          <h1 style="margin:0 0 24px;color:#ffffff;font-size:22px;letter-spacing:2px;">
            НОВОЕ СООБЩЕНИЕ
          </h1>
          <div style="border-top:1px solid #222;padding:16px 0;">
            <p style="margin:0;color:#888;font-size:11px;letter-spacing:2px;">ИМЯ</p>
            <p style="margin:4px 0 0;color:#fff;font-size:16px;">${safeName}</p>
          </div>
          <div style="border-top:1px solid #222;padding:16px 0;">
            <p style="margin:0;color:#888;font-size:11px;letter-spacing:2px;">EMAIL</p>
            <p style="margin:4px 0 0;color:#fff;font-size:16px;">
              <a href="mailto:${safeEmail}" style="color:#4a9eff;text-decoration:none;">${safeEmail}</a>
            </p>
          </div>
          <div style="border-top:1px solid #222;padding:16px 0;">
            <p style="margin:0;color:#888;font-size:11px;letter-spacing:2px;">ТИП ПРОЕКТА</p>
            <p style="margin:4px 0 0;color:#fff;font-size:16px;">${safeProjectType}</p>
          </div>
          <div style="border-top:1px solid #222;padding:16px 0;">
            <p style="margin:0;color:#888;font-size:11px;letter-spacing:2px;">СООБЩЕНИЕ</p>
            <p style="margin:4px 0 0;color:#fff;font-size:14px;line-height:1.6;">${safeMessage}</p>
          </div>
          <div style="border-top:1px solid #222;margin-top:24px;padding-top:24px;color:#444;font-size:11px;">
            Отправлено с портфолио · ${escapeHtml(timestamp)}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({
        success: false,
        error: "Не удалось отправить сообщение.",
      });
    }

    return res.json({ success: true, id: data.id });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера.",
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

const server = app.listen(PORT, () => {
  console.log(`Portfolio server listening on port ${PORT}`);
});

const shutdown = (signal) => {
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));