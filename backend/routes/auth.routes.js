const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const { signToken, cookieOptions, requireAuth, COOKIE_NAME } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { rows } = await pool.query(
      'SELECT id, email, password_hash FROM admin WHERE email = $1',
      [email]
    );
    const admin = rows[0];

    // Same generic error whether the email doesn't exist or the password is
    // wrong — don't leak which one it was.
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken({ id: admin.id, email: admin.email });
    res.cookie(COOKIE_NAME, token, cookieOptions());
    res.json({ ok: true, email: admin.email });
  } catch (err) {
    next(err);
  }
});

// Lets the frontend check "am I still logged in?" on page load without
// resending credentials — the cookie does that work.
router.get('/me', requireAuth, (req, res) => {
  res.json({ email: req.admin.email });
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions());
  res.json({ ok: true });
});

module.exports = router;
