// Real route structure, defined now so the active-underline logic has
// something meaningful to match against.
//
// Most pages don't exist yet, so most links still point at /404. Matching is
// done against the REAL path below, not the placeholder — add a path to
// LIVE_PATHS once its page ships and the link starts navigating there with
// no other change.
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

// Pages that are real and live right now. Everything else — Our Products,
// Training & Internship, Blogs, Career, FAQ, Our Works — still routes to the
// /404 placeholder until its page ships.
const LIVE_PATHS = new Set([PATHS.home, PATHS.about, PATHS.services]);

export function isLivePath(path) {
  // Individual service pages (e.g. /services/cybersecurity) are live too,
  // since ServiceDetail renders for any path under /services.
  return LIVE_PATHS.has(path) || path.startsWith(`${PATHS.services}/`);
}

export function hrefFor(path) {
  return isLivePath(path) ? path : PLACEHOLDER_LINK;
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

/**
 * Admin routes. Unlike the marketing paths above, these are real and live
 * behind auth — they never go through hrefFor()/PLACEHOLDER_LINK.
 */
export const ADMIN_PATHS = {
  root: '/admin',
  login: '/admin/login',
  dashboard: '/admin/dashboard',
};

// Order here is the order the dashboard nav renders in.
export const ADMIN_SECTIONS = [
  { key: 'hero-content', label: 'Hero Content', path: `${ADMIN_PATHS.dashboard}/hero-content` },
  { key: 'services', label: 'Services', path: `${ADMIN_PATHS.dashboard}/services` },
  { key: 'socials', label: 'Socials', path: `${ADMIN_PATHS.dashboard}/socials` },
  { key: 'jobs-internships', label: 'Jobs & Internships', path: `${ADMIN_PATHS.dashboard}/jobs-internships` },
];

export const ADMIN_SETTINGS_SECTION = {
  key: 'settings',
  label: 'Settings',
  path: `${ADMIN_PATHS.dashboard}/settings`,
};

export const DEFAULT_ADMIN_SECTION = ADMIN_SECTIONS[0];

export function findAdminSection(path) {
  const all = [...ADMIN_SECTIONS, ADMIN_SETTINGS_SECTION];
  return all.find((section) => isPathActive(path, section.path, true)) || null;
}