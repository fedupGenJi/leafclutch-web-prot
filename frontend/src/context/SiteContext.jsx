import { createContext, useContext, useEffect, useState } from 'react';
import { fetchSite, FALLBACK_SITE } from '../api/site.js';

const SiteContext = createContext(FALLBACK_SITE);

// Navbar and footer both need services and assets. Fetching once at the top
// and sharing through context avoids two identical requests per page load.
export function SiteProvider({ children }) {
  const [site, setSite] = useState(FALLBACK_SITE);

  useEffect(() => {
    let cancelled = false;

    fetchSite()
      .then((data) => {
        if (!cancelled) setSite(data);
      })
      .catch((err) => {
        // Not fatal: the chrome still renders with '404' placeholders, which
        // is exactly what it should show when content is unavailable.
        console.warn('Site content unavailable, using placeholders:', err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}
