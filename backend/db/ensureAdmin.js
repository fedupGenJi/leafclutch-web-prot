const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');
const { pool } = require('./index');

const SALT_ROUNDS = 12;

// URL-safe, no ambiguous padding chars — 24 random bytes is well beyond a
// brute-forceable strength and still comfortable to read if someone ever
// has to type it in manually.
function generatePassword() {
  return crypto.randomBytes(24).toString('base64url');
}

async function sendPasswordEmail(email, password) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    // Don't crash the boot over a missing mail config — but make this
    // impossible to miss in the logs, since it's the only place the
    // password will ever be visible.
    console.warn(
      'RESEND_API_KEY or RESEND_FROM_EMAIL not set — skipping admin password email.'
    );
    console.warn(`Generated admin password (save this now): ${password}`);
    return;
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: 'Your admin account password',
    html: `
      <p>An admin account was just created for you.</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>This password was generated automatically and is only shown here —
      it is not stored anywhere in plaintext. Log in and change it if your
      admin panel supports that, or keep it somewhere safe (a password
      manager).</p>
    `,
  });

  if (error) {
    // Same reasoning as above: log it as a fallback so the account is still
    // usable even if the email provider had an outage.
    console.error('Failed to send admin password email via Resend:', error);
    console.warn(`Generated admin password (save this now): ${password}`);
  } else {
    console.log(`Admin password emailed to ${email}`);
  }
}

/**
 * Runs once on every boot. If ADMIN_EMAIL already has a row in `admin`,
 * this is a no-op. If not, it generates a random password, stores only the
 * bcrypt hash, and emails the plaintext password to the admin — that email
 * is the only place the plaintext ever exists.
 */
async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL;

  if (!email) {
    console.warn('ADMIN_EMAIL not set in .env — skipping admin account setup.');
    return;
  }

  const { rows } = await pool.query(
    'SELECT id FROM admin WHERE email = $1',
    [email]
  );

  if (rows.length) {
    return; // already exists, nothing to do
  }

  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await pool.query(
    'INSERT INTO admin (email, password_hash) VALUES ($1, $2)',
    [email, passwordHash]
  );

  console.log(`Created admin account for ${email}`);
  await sendPasswordEmail(email, password);
}

module.exports = { ensureAdmin };
