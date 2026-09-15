// Minimal wrapper around Resend's HTTP API. Deliberately not using the
// `resend` npm package — it's a single POST request, and Node's built-in
// fetch (Node 18+) already covers it without adding a dependency. Swap this
// out for the official SDK later if you end up needing more of its surface
// (batching, attachments, etc.) — sendEmail()'s signature can stay the same.

const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * @param {object} opts
 * @param {string|string[]} opts.to
 * @param {string} opts.subject
 * @param {string} opts.html
 * @param {string} [opts.replyTo] - lets the admin hit "reply" and land in
 *   the visitor's inbox, since the email itself is always sent from
 *   RESEND_FROM_EMAIL (Resend requires a verified sender/domain).
 */
async function sendEmail({ to, subject, html, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  if (!from) throw new Error('RESEND_FROM_EMAIL is not set');

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    let detail = '';
    try {
      const data = await res.json();
      detail = data.message || JSON.stringify(data);
    } catch {
      detail = await res.text().catch(() => '');
    }
    throw new Error(`Resend request failed (${res.status}): ${detail}`);
  }

  return res.json();
}

module.exports = { sendEmail };