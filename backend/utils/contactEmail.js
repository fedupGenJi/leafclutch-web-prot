// Formats a contact-form submission into the email the admin receives.
// Kept separate from resend.js (transport) and contact.routes.js (HTTP
// layer + validation) so each piece can be tested/reused on its own.

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function buildContactEmail({ firstName, lastName, email, phone, message, interests }) {
  const name = `${firstName} ${lastName}`.trim();

  const rows = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone],
    interests && interests.length ? ['Interested in', interests.join(', ')] : null,
  ].filter(Boolean);

  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:4px 16px 4px 0;color:#667085;font-weight:600;white-space:nowrap;vertical-align:top;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:4px 0;color:#111827;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join('');

  const messageHtml = message
    ? `
      <p style="margin:20px 0 6px;font-weight:600;color:#667085;">Message</p>
      <p style="margin:0;white-space:pre-wrap;color:#111827;">${escapeHtml(message)}</p>`
    : '';

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:520px;">
      <h2 style="margin:0 0 16px;font-size:18px;">New message from the website contact form</h2>
      <table style="border-collapse:collapse;">${rowsHtml}</table>
      ${messageHtml}
    </div>`;

  return {
    subject: `New contact form message from ${name || 'website visitor'}`,
    html,
  };
}

module.exports = { buildContactEmail };