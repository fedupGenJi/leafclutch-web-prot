// Shown when the API is unreachable. Matches the backend's rule: anything
// without content reads '404' rather than collapsing to an empty element.
export const FALLBACK_SITE = {
  assets: {
    logoHorizontal: '/assets/logo-hor.png',
    logoVertical: '/assets/logo-ver.png',
    icon: '/assets/icon.png',
  },
  heroContent: {
    desc: '404',
    email: '404',
    emailSecondary: null,
    contactNumber: '404',
    contactNumberSecondary: null,
    address: '404',
    mapLink: null,
  },
  socials: [],
  services: [],
};

export async function fetchSite() {
  const res = await fetch('/api/site');
  if (!res.ok) throw new Error('Failed to load site content');
  const data = await res.json();

  return {
    assets: { ...FALLBACK_SITE.assets, ...(data.assets || {}) },
    heroContent: { ...FALLBACK_SITE.heroContent, ...(data.heroContent || {}) },
    // Defensive filter: the public endpoint is *supposed* to only return
    // active rows, but if a backend query ever forgets `is_active = true`
    // (e.g. filtering socials by `url` presence only), an inactive row
    // slipping through the API shouldn't still render on the live site.
    // `is_active === false` is the only thing that hides a row — rows
    // where the field is simply absent are treated as active.
    socials: Array.isArray(data.socials) ? data.socials.filter((s) => s.is_active !== false) : [],
    services: Array.isArray(data.services) ? data.services.filter((s) => s.is_active !== false) : [],
  };
}
