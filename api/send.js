// /api/send.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  // --- ENVIRONMENT VARIABLES ---
  const SMTP_USER = process.env.SMTP_USER || process.env.NODEMAILER_USER;
  const SMTP_PASS = process.env.SMTP_PASS || process.env.NODEMAILER_PASS;
  const MAIL_TO = process.env.MAIL_TO || process.env.NODEMAILER_TO || SMTP_USER;
  const FROM_NAME = process.env.MAIL_FROM || "Lace & Lime Forms";
  const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

  if (!SMTP_USER || !SMTP_PASS) {
    console.error("Email environment variables missing");
    return res.status(500).json({ ok: false, error: "Server email not configured" });
  }

  // --- READ BODY (JSON ONLY) ---
  let data;
  try {
    data = req.body;
  } catch (e) {
    console.error("BODY_PARSE_ERROR", e);
    return res.status(400).json({ ok: false, error: "Invalid request" });
  }

  const firstName = (data.firstName || "").trim();
  const lastName = (data.lastName || "").trim();
  const email = (data.email || "").trim();
  const subject = (data.subject || "").trim();
  const message = (data.message || "").trim();
  const recaptchaToken = data["g-recaptcha-response"];

  // --- REQUIRED FIELDS ---
  if (!firstName || !email || !subject || !message) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }

  // --- CAPTCHA VERIFY ---
  try {
    const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}`,
    }).then((r) => r.json());

    if (!verify.success) {
      console.error("RECAPTCHA_FAIL", verify);
      return res.status(400).json({ ok: false, error: "Captcha verification failed" });
    }
  } catch (err) {
    console.error("RECAPTCHA_ERROR", err);
    return res.status(500).json({ ok: false, error: "Captcha service error" });
  }

  // --- EMAIL SEND ---
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${SMTP_USER}>`,
      to: MAIL_TO,
      replyTo: email,
      subject: subject || "New Contact Form Message",
      text: `Name: ${firstName}${lastName ? " " + lastName : ""}
Email: ${email}
Subject: ${subject}

${message}`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("MAIL_SEND_FAIL", err?.message || err);
    return res.status(500).json({ ok: false, error: "Could not send email" });
  }
}
