import { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreen.jsx';
import brand from './brand.js';

// The intro is a brand moment, not a data wait — there is no longer an API call
// to block on. These are tuned against the animation itself: the logo entrance
// runs 700ms and the ripple sweeps the grid in RIPPLE_SWEEP_MS (1400ms), so the
// hold below lets one full pass complete instead of cutting it off mid-sweep.
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
  const [phase, setPhase] = useState('loading');

  useEffect(() => {
    applyTheme(brand.colors);
  }, []);

  useEffect(() => {
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
  }, []);

  return (
    <div className="site">
      {phase !== 'done' && <LoadingScreen leaving={phase === 'leaving'} />}
      {phase !== 'loading' && <Homepage />}
    </div>
  );
}

function Homepage() {
  return (
    <main className="homepage">
      <img src={brand.logo} alt="" className="homepage-logo" />
      <h1>{brand.siteName}</h1>
      <p>Homepage content coming soon.</p>
    </main>
  );
}
