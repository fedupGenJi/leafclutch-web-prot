import { useEffect, useState } from 'react';

/**
 * Current pathname, kept in sync with back/forward navigation.
 *
 * There is no router in the project yet, so this reads window.location
 * directly. When a router lands, this is the one file that changes — every
 * component reads the path through this hook.
 */
export function useCurrentPath() {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname
  );

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);

    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  return path;
}

export default useCurrentPath;
