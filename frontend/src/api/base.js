// Single source of truth for where the backend lives. In dev this is empty,
// so requests stay relative and go through the Vite proxy in vite.config.js.
// In production the frontend and backend are on different origins (e.g.
// static site vs. Render web service), so VITE_API_URL must be set at BUILD
// time to the backend's full URL (e.g. https://leafclutch-api.onrender.com).
// Vite only exposes env vars prefixed VITE_, and it bakes them in when you
// run `npm run build` — setting them after the fact does nothing.
export const API_BASE = import.meta.env.VITE_API_URL || '';

// For fetch() calls against JSON endpoints, e.g. apiUrl('/api/contact').
export function apiUrl(path) {
  return `${API_BASE}${path}`;
}

// For asset URLs the backend returns (e.g. '/assets/logo-hor.png'), which
// are relative and otherwise resolve against the frontend's own origin.
export function assetUrl(path) {
  if (!path) return path;
  return `${API_BASE}${path}`;
}
