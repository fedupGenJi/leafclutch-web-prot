// The site is being built ahead of its content, so anything not yet filled in
// renders the string '404' rather than an empty gap. Keeping this in one place
// means there is a single line to change when real content lands.
const MISSING = '404';

function orMissing(value) {
  if (value === null || value === undefined) return MISSING;
  const text = String(value).trim();
  return text === '' ? MISSING : text;
}

// Links behave differently: a missing link must NOT become the string '404',
// or it would render as a relative href. It becomes null, and the frontend
// decides whether to hide the element (socials) or fall back to /404.
function linkOrNull(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text === '' ? null : text;
}

module.exports = { MISSING, orMissing, linkOrNull };
