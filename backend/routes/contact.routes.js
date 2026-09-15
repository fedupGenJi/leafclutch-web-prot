const express = require('express');
const { sendEmail } = require('../utils/resend');
const { buildContactEmail } = require('../utils/contactEmail');

const router = express.Router();

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(value) {
  return typeof value === 'string' && /^\S+@\S+\.\S+$/.test(value.trim());
}

// Mirrors the validation the contact form already does client-side. Re-run
// here since the request body isn't trustworthy just because it came from
// the site's own form — anything can POST to this endpoint.
function validate(body) {
  const errors = {};
  if (!isNonEmptyString(body.firstName)) errors.firstName = 'Required';
  if (!isNonEmptyString(body.lastName)) errors.lastName = 'Required';
  if (!isValidEmail(body.email)) errors.email = 'Enter a valid email';
  if (!isNonEmptyString(body.phone)) errors.phone = 'Required';
  return errors;
}

// Mounted at /api (same place as content.routes.js), so this responds at
// POST /api/contact — matching what the frontend's api/contact.js calls.
router.post('/contact', async (req, res, next) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      // A missing env var is a deploy/config problem, not the visitor's
      // fault — log it for whoever's on call, but don't leak env details
      // back in the response.
      console.error('ADMIN_EMAIL is not set — contact form submissions have nowhere to go.');
      return res
        .status(500)
        .json({ message: "Sorry, the contact form isn't set up yet. Please email us directly." });
    }

    const body = req.body || {};
    const errors = validate(body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Please check the highlighted fields.', errors });
    }

    const { firstName, lastName, email, phone } = body;
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const interests = Array.isArray(body.interests)
      ? body.interests.filter((i) => typeof i === 'string')
      : [];

    const { subject, html } = buildContactEmail({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message,
      interests,
    });

    try {
      await sendEmail({ to: adminEmail, subject, html, replyTo: email.trim() });
    } catch (sendErr) {
      console.error('Resend send failed:', sendErr);
      return res
        .status(502)
        .json({ message: "Sorry, we couldn't send your message right now. Please try again shortly." });
    }

    res.status(200).json({ message: 'Message sent.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;