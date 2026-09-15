const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'admin_token';

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// Same options must be used to set and to clear the cookie, or the browser
// treats them as different cookies and the clear silently fails.
function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches default JWT_EXPIRES_IN
  };
}

// Protects admin-only routes. Reads the JWT from the httpOnly cookie set at
// login, so the browser never has to resend the password — the cookie
// persists across requests (and page reloads) until it expires or is cleared.
function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

module.exports = { signToken, cookieOptions, requireAuth, COOKIE_NAME };
