// /api/send.js
import nodemailer from 'nodemailer';

async function readBody(req) {
  if (req.headers['content-type']?.includes('application/json')) {
    return req.body || {};
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(raw));
  }
  try { return JSON.parse(raw); } catch { return {}; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  // Email env (same behavior you had)
  const SMTP_USER = process.env.NODEMAILER_USER || process.env.SMTP_USER;
  const SMTP_PASS = process.env.NODEMAILER_PASS || process.env.SMTP_PASS;
  const MAIL_TO   = process.env.NODEMAILER_TO || process.env.MAIL_TO || SMTP_USER;
  const FROM_NAME = process.env.MAIL_FROM || 'Lace & Lime Forms';

  if (!SMTP_USER || !SMTP_PASS) {
    console.error('ENV_DEBUG', { hasUser: !!SMTP_USER, hasPass: !!SMTP_PASS });
    return res.status(500).json({ ok: false, error: 'Server email not configured' });
  }

  // 🔒 Your reCAPTCHA **secret key** lives in the server env (never in HTML)
  const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

  let data = {};
  try {
    data = await readBody(req);
  } catch (e) {
    console.error('BODY_PARSE_ERROR', e);
    return res.status(400).json({ ok: false, error: 'Invalid body' });
  }

  // 🪤 Honeypot: if bots filled it, silently accept & stop
  if (data.hp_company) {
    return res.status(200).json({ ok: true });
  }

  // Form fields
  const firstName = (data.firstName || data.name || '').trim();
  const lastName  = (data.lastName  || '').trim();
  const email     = (data.email     || '').trim();
  const subject   = (data.subject   || '').trim();
  const message   = (data.message   || '').trim();

  if (!firstName || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  // 🔐 reCAPTCHA v2 Invisible: verify token sent by the widget
  const token = data['g-recaptcha-response'];
  if (!token) {
    return res.status(400).json({ ok: false, error: 'Missing reCAPTCHA token' });
  }
  if (!RECAPTCHA_SECRET_KEY) {
    console.error('RECAPTCHA_SECRET_KEY missing');
    return res.status(500).json({ ok: false, error: 'Server captcha not configured' });
  }

  try {
    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      '';

    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(RECAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(token)}&remoteip=${encodeURIComponent(ip)}`
    });

    const verdict = await resp.json();
    if (!verdict?.success) {
      console.error('RECAPTCHA_FAIL', verdict);
      return res.status(400).json({ ok: false, error: 'Failed reCAPTCHA check' });
    }
  } catch (err) {
    console.error('RECAPTCHA_ERROR', err);
    return res.status(500).json({ ok: false, error: 'Error validating reCAPTCHA' });
  }

  // 🗒️ Optional: Sheets logging (unchanged from your version)
  try {
    const url = process.env.SHEETS_WEBHOOK_URL;
    const token = process.env.SHEETS_WEBHOOK_TOKEN;
    if (url && token) {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, firstName, lastName, email, subject, message })
      });
      const j = await r.json().catch(() => null);
      if (!j?.ok) console.error('Sheets webhook error:', j);
    } else {
      console.warn('Sheets webhook not configured.');
    }
  } catch (err) {
    console.error('Sheets logging failed:', err);
  }

  // ✉️ Nodemailer (Gmail) — verify + send (same pattern you had)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  try {
    await transporter.verify();
  } catch (err) {
    console.error('SMTP_VERIFY_FAIL', err?.response || err?.message || err);
    return res.status(500).json({ ok: false, error: 'Email auth failed' });
  }

  try {
    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${SMTP_USER}>`,
      to: MAIL_TO,
      replyTo: email,
      subject: subject || 'New Contact Form Message',
      text: `Name: ${firstName}${lastName ? ' ' + lastName : ''}\nEmail: ${email}\n\n${message}`
    });
    console.log('MAIL_OK', info.messageId);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('MAIL_SEND_FAIL', err?.response || err?.message || err);
    return res.status(500).json({ ok: false, error: 'Could not send email' });
  }
}
