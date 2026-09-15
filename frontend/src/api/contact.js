// Public contact-form submission. Unlike api/admin.js this needs no auth
// header — it's the same unauthenticated shape as api/site.js's fetchSite.
// The backend is expected to take this payload and send it on as an email
// to the team, rather than the form building a WhatsApp deep link itself.
export async function sendContactMessage(payload) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = 'Failed to send your message. Please try again.';
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}
