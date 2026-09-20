import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Resend } from "resend";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://your-production-domain.com",
];
const resend = new Resend(process.env.RESEND_API_KEY);
const requestsByIp = new Map();
const rateLimitWindow = 60 * 60 * 1000;
const maxRequestsPerWindow = 5;

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isRateLimited = (ip) => {
  const now = Date.now();
  const recentRequests = (requestsByIp.get(ip) || []).filter(
    (timestamp) => now - timestamp < rateLimitWindow
  );

  if (recentRequests.length >= maxRequestsPerWindow) {
    requestsByIp.set(ip, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestsByIp.set(ip, recentRequests);
  return false;
};

app.get("/", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/send-email", async (request, response) => {
  if (isRateLimited(request.ip)) {
    return response.status(429).json({
      success: false,
      error: "Слишком много запросов. Попробуйте позже.",
    });
  }

  const { name, email, projectType, message } = request.body || {};
  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedEmail = typeof email === "string" ? email.trim() : "";
  const trimmedProjectType = typeof projectType === "string" ? projectType.trim() : "";
  const trimmedMessage = typeof message === "string" ? message.trim() : "";

  if (trimmedName.length < 2) {
    return response.status(400).json({ success: false, error: "Введите имя." });
  }
  if (!isValidEmail(trimmedEmail)) {
    return response.status(400).json({ success: false, error: "Введите корректный email." });
  }
  if (!trimmedProjectType) {
    return response.status(400).json({ success: false, error: "Выберите тип проекта." });
  }
  if (trimmedMessage.length < 12) {
    return response.status(400).json({
      success: false,
      error: "Сообщение должно содержать минимум 12 символов.",
    });
  }

  const safeName = escapeHtml(trimmedName);
  const safeEmail = escapeHtml(trimmedEmail);
  const safeProjectType = escapeHtml(trimmedProjectType);
  const safeMessage = escapeHtml(trimmedMessage).replaceAll("\n", "<br />");
  const timestamp = new Date().toLocaleString("ru-RU", {
    dateStyle: "long",
    timeStyle: "short",
  });

  try {
    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: process.env.MY_EMAIL,
      replyTo: trimmedEmail,
      subject: `Новое сообщение от ${trimmedName} — ${trimmedProjectType}`,
      html: `
        <div style="background:#0a0a0a;color:#ffffff;font-family:Arial,sans-serif;padding:32px;line-height:1.6;">
          <h1 style="margin:0 0 24px;color:#ffffff;font-size:24px;">Новое сообщение с портфолио</h1>
          <p style="margin:8px 0;"><strong>Имя:</strong> ${safeName}</p>
          <p style="margin:8px 0;"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin:8px 0;"><strong>Тип проекта:</strong> ${safeProjectType}</p>
          <div style="margin-top:24px;padding:20px;border:1px solid #333;">
            <strong>Сообщение:</strong>
            <p style="margin:8px 0 0;">${safeMessage}</p>
          </div>
          <p style="margin:24px 0 0;color:#999;font-size:13px;">Отправлено: ${escapeHtml(timestamp)}</p>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message || "Resend не смог отправить письмо.");
    }

    return response.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Email sending failed:", error);
    return response.status(500).json({
      success: false,
      error: "Не удалось отправить сообщение.",
    });
  }
});

app.listen(port, () => {
  console.log(`Portfolio server listening on port ${port}`);
});
