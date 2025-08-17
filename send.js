// /api/send.js — Vercel serverless function (Node + Nodemailer)
import nodemailer from 'nodemailer';

// helper to parse the request body
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

  const SMTP_USER = process.env.SMTP_USER;   // Gmail address
  const SMTP_PASS = process.env.SMTP_PASS;   // 16-char Gmail App Password (no spaces)
  const MAIL_TO   = process.env.MAIL_TO || SMTP_USER;
  const FROM_NAME = process.env.MAIL_FROM || 'Lace & Lime Forms';

  if (!SMTP_USER || !SMTP_PASS) {
    console.error('MISSING_ENV', { hasUser: !!SMTP_USER, hasPass: !!SMTP_PASS });
    return res.status(500).json({ ok: false, error: 'Server email not configured' });
  }

  let data = {};
  try { data = await readBody(req); }
  catch (e) {
    console.error('BODY_PARSE_ERROR', e);
    return res.status(400).json({ ok: false, error: 'Invalid body' });
  }

  const firstName = (data.firstName || data.name || '').trim();
  const lastName  = (data.lastName  || '').trim();
  const email     = (data.email     || '').trim();
  const subject   = (data.subject   || '').trim();
  const message   = (data.message   || '').trim();

  if (!firstName || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  try { await transporter.verify(); }
  catch (err) {
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
