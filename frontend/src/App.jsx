import { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreen.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { SiteProvider } from './context/SiteContext.jsx';
import { useCurrentPath } from './hooks/useCurrentPath.js';
import { PATHS } from './config/nav.js';
import brand from './brand.js';

// The intro is a brand moment, not a data wait. These are tuned against the
// animation itself: the logo entrance runs 700ms and the ripple sweeps the grid
// in 1400ms, so the hold below lets one full pass complete rather than cutting
// it off mid-sweep.
const HOLD_MS = 1800;
const HOLD_MS_REDUCED = 600;
const LEAVE_TRANSITION_MS = 450;

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function applyTheme(colors) {
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
}

export default function App() {
  const currentPath = useCurrentPath();

  // The intro plays on the homepage only. Anywhere else it would sit between
  // the visitor and the content they navigated to, so subpages mount straight
  // into the page. Read once on mount rather than from currentPath, so a later
  // client-side navigation back to / doesn't replay it.
  const [isIntroRoute] = useState(() =>
    typeof window === 'undefined' ? true : window.location.pathname === PATHS.home
  );

  const [phase, setPhase] = useState(isIntroRoute ? 'loading' : 'done');

  useEffect(() => {
    applyTheme(brand.colors);
  }, []);

  useEffect(() => {
    if (!isIntroRoute) return undefined;

    const hold = prefersReducedMotion() ? HOLD_MS_REDUCED : HOLD_MS;
    let leaveTimer = null;

    const holdTimer = setTimeout(() => {
      setPhase('leaving');
      leaveTimer = setTimeout(() => setPhase('done'), LEAVE_TRANSITION_MS);
    }, hold);

    return () => {
      clearTimeout(holdTimer);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [isIntroRoute]);

  return (
    // The provider sits outside the loading gate so the single /api/site
    // request runs during the intro instead of after it.
    <SiteProvider>
      <div className="site">
        {phase !== 'done' && <LoadingScreen leaving={phase === 'leaving'} />}

        {phase !== 'loading' && (
          <>
            <Navbar />
            <Page currentPath={currentPath} />
            <Footer />
          </>
        )}
      </div>
    </SiteProvider>
  );
}

// Placeholder until real pages exist. Every route currently lands here.
function Page({ currentPath }) {
  const isHome = currentPath === PATHS.home;

  return (
    <main className="homepage">
      <h1>{isHome ? brand.siteName : currentPath}</h1>
      <p>Page content coming soon.</p>
    </main>
  );
}
