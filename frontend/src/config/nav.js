// Real route structure, defined now so the active-underline logic has
// something meaningful to match against.
//
// The pages don't exist yet, so every link still points at /404. Matching is
// done against the REAL path below, not the placeholder — flip
// USE_PLACEHOLDER_LINKS to false once the routes are live and the whole site
// starts navigating properly with no other change.
export const USE_PLACEHOLDER_LINKS = true;
export const PLACEHOLDER_LINK = '/404';

export const PATHS = {
  home: '/',
  about: '/about',
  services: '/services',
  products: '/products',
  contact: '/contact',
  training: '/training-internship',
  blogs: '/blogs',
  career: '/career',
  faq: '/faq',
  works: '/works',
  privacy: '/privacy-policy',
  terms: '/terms-of-service',
  admin: '/admin',
};

export function hrefFor(path) {
  return USE_PLACEHOLDER_LINKS ? PLACEHOLDER_LINK : path;
}

/**
 * True when `current` is `target` or sits underneath it.
 *
 * The prefix match is what keeps the underline lit on subpages: a visitor on
 * /career/jobs/frontend-engineer still highlights Career. Home is matched
 * exactly, since every path is technically "under" /.
 *
 * `exact` opts a single item out of prefix matching — "All Services" points at
 * /services and shouldn't stay lit while you're on /services/cybersecurity.
 */
export function isPathActive(current, target, exact = false) {
  if (!current || !target) return false;
  if (target === '/' || exact) return current === target;
  return current === target || current.startsWith(`${target}/`);
}

export function anyPathActive(current, items) {
  return items.some((item) => isPathActive(current, item.path, item.exact));
}
