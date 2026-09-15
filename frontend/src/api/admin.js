// Content-management calls for the admin dashboard sections. Same assumed
// backend contract note as api/auth.js — adjust the paths below if the real
// backend names these differently.

import { authHeader, clearToken } from './auth.js';
import { navigate } from '../utils/navigate.js';
import { ADMIN_PATHS } from '../config/nav.js';

async function authedFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...authHeader(),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Token expired or was revoked server-side mid-session — bounce back to
    // login rather than let the section render on stale/failed data.
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

  if (res.status === 204) return null;
  return res.json();
}

// Method shape (list/create/update/delete) matches what CrudManager.jsx
// calls on `api`.
function createCrudApi(basePath) {
  return {
    list: () => authedFetch(basePath),
    create: (payload) =>
      authedFetch(basePath, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    update: (id, payload) =>
      authedFetch(`${basePath}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    delete: (id) => authedFetch(`${basePath}/${id}`, { method: 'DELETE' }),
  };
}

// ---------------------------------------------------------------- Hero content

export function getHeroContent() {
  return authedFetch('/api/admin/hero-content');
}

export function updateHeroContent(payload) {
  return authedFetch('/api/admin/hero-content', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// --------------------------------------------------------------------- Services

export const servicesApi = createCrudApi('/api/admin/services');

// Kept for ServicesSection.jsx, which imports these individually rather than
// via servicesApi. Just thin wrappers around the same factory so there's one
// source of truth for the paths/methods.
export const listServices = servicesApi.list;
export const createService = servicesApi.create;
export const updateService = servicesApi.update;
export const deleteService = servicesApi.delete;

// ------------------------------------------------------------ Jobs & internships

export const jobsApi = createCrudApi('/api/admin/jobs');
export const internshipsApi = createCrudApi('/api/admin/internships');

// --------------------------------------------------------------------- Socials

export const socialsApi = createCrudApi('/api/admin/socials');

// ----------------------------------------------------------------- Password

export function changePassword(payload) {
  return authedFetch('/api/admin/password', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}