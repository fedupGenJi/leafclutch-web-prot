// Shared client-side password strength rules. The backend is the source of
// truth on save, but checking here means the admin sees exactly why a
// password isn't strong enough before they hit submit, not after.

export const PASSWORD_RULES = [
  { key: 'length', label: 'At least 10 characters', test: (v) => v.length >= 10 },
  { key: 'lower', label: 'A lowercase letter', test: (v) => /[a-z]/.test(v) },
  { key: 'upper', label: 'An uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'number', label: 'A number', test: (v) => /[0-9]/.test(v) },
  { key: 'symbol', label: 'A symbol (!@#$…)', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export function checkPassword(value) {
  const pass = value || '';
  const results = PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(pass) }));
  const score = results.filter((r) => r.passed).length;
  return { results, score, isStrong: score === PASSWORD_RULES.length };
}

export function strengthLabel(score) {
  if (score <= 1) return 'Very weak';
  if (score === 2) return 'Weak';
  if (score === 3) return 'Fair';
  if (score === 4) return 'Good';
  return 'Strong';
}