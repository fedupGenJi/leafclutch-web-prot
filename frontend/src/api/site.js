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
    socials: Array.isArray(data.socials) ? data.socials : [],
    services: Array.isArray(data.services) ? data.services : [],
  };
}
