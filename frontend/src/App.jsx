import { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreen.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import NotFound from './pages/NotFound.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import AdminApp from './pages/admin/AdminApp.jsx';
import { SiteProvider } from './context/SiteContext.jsx';
import { useCurrentPath } from './hooks/useCurrentPath.js';
import { PATHS, isPathActive } from './config/nav.js';
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
  const isAdminRoute = isPathActive(currentPath, PATHS.admin);

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

  // Every client-side navigation (including between Privacy Policy and
  // Terms of Service, which otherwise render at whatever scroll position the
  // previous page was left at) should land at the top of the new page —
  // matching how a real page load behaves. Anchor jumps within a page (e.g.
  // the legal pages' "On this page" links) only change the hash, not the
  // pathname, so they're untouched by this.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

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

  // The admin app is a separate shell entirely — no marketing navbar/footer,
  // no intro. It still sits inside SiteProvider so it can read the same
  // logo/site data as the public site (e.g. the topbar logo).
  if (isAdminRoute) {
    return (
      <SiteProvider>
        <div className="site">
          <AdminApp />
        </div>
      </SiteProvider>
    );
  }

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

// Home gets its own light placeholder; Privacy Policy, Terms of Service, and
// Contact are real and live. Every other route — including /404, which is
// where every other link currently points (see config/nav.js) — renders
// NotFound instead.
function Page({ currentPath }) {
  const isHome = currentPath === PATHS.home;

  if (currentPath === PATHS.privacy) {
    return <PrivacyPolicy />;
  }

  if (currentPath === PATHS.terms) {
    return <TermsOfService />;
  }

  if (currentPath === PATHS.contact) {
    return <Contact />;
  }

  if (currentPath === PATHS.about) {
    return <About />;
  }

  if (!isHome) {
    return <NotFound />;
  }

  return (
    <main className="homepage">
      <h1>{brand.siteName}</h1>
      <p>Page content coming soon.</p>
    </main>
  );
}