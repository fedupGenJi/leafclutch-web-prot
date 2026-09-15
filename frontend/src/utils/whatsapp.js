// Shared with Contact.jsx's approach: wa.me needs a country code ahead of the
// number, and the CMS stores Nepali mobile numbers as 10 digits, so anything
// that short gets "977" prefixed; a number that's already longer is assumed
// to include one already.

function digitsOnly(value) {
  return (value || '').replace(/\D/g, '');
}

export function buildWhatsAppLink(phone, message) {
  const digits = digitsOnly(phone);
  if (!digits) return null;
  const withCountryCode = digits.length <= 10 ? `977${digits}` : digits;
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${withCountryCode}${query}`;
}

export default buildWhatsAppLink;
