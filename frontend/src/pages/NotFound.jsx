import { PATHS } from '../config/nav.js';
import { navigateOnClick } from '../utils/navigate.js';

// Every unbuilt route currently lands here (see config/nav.js — links for
// pages that aren't live yet point at PLACEHOLDER_LINK until their path is
// added to LIVE_PATHS), so this doubles as both the true 404 and the
// "nothing here yet" placeholder.
// It shares the .homepage layout so it sits identically to the real
// placeholder, just with its own copy and a way back.
export default function NotFound() {
  return (
    <main className="homepage notfound">
      <span className="notfound-badge">Under development</span>
      <h1>This page isn&apos;t live yet</h1>
      <p>We're still building this part of the site — check back soon.</p>
      <a href={PATHS.home} className="notfound-home-link" onClick={navigateOnClick(PATHS.home)}>
        Back to home
      </a>
    </main>
  );
}