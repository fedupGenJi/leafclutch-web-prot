// Backs the Settings section of the admin dashboard (which reuses the
// existing pages/BrandSettings.jsx). Referenced by that component but never
// added to the project — filled in here with the same assumed-contract
// pattern as the rest of src/api/.

import { authHeader, clearToken } from './auth.js';
import { navigate } from '../utils/navigate.js';
import { ADMIN_PATHS } from '../config/nav.js';

async function authedRequest(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { ...authHeader(), ...options.headers } });

  if (res.status === 401) {
    clearToken();
    navigate(ADMIN_PATHS.login);
    throw new Error('Session expired — please log in again');
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }

  return res.json();
}

export function updateBrand({ siteName, colors }) {
  return authedRequest('/api/admin/brand', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ siteName, colors }),
  });
}

export function uploadAssets({ logo, icon }) {
  const form = new FormData();
  if (logo) form.append('logo', logo);
  if (icon) form.append('icon', icon);

  return authedRequest('/api/admin/brand/assets', {
    method: 'POST',
    body: form,
  });
}
