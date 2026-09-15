const jwt = require('jsonwebtoken');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// The frontend stores the token in memory (not a cookie) and sends it as
// `Authorization: Bearer <token>` on every admin request. Any 401 here makes
// the frontend auto-logout and redirect to /admin/login, so the message body
// is optional — only the status code matters to the client.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}

module.exports = { signToken, requireAuth };
