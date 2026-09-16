// Admin auth. The token lives in localStorage so it survives a refresh —
// verifySession() is what makes that safe, since a stale/forged value stored
// there is worthless without the backend confirming it on every load.
//
// NOTE ON THE BACKEND CONTRACT: these endpoint paths and payload shapes are
// this project's assumed contract for the admin API. If the real backend
// differs, this file (plus api/admin.js and api/brand.js, which reuse
// authHeader()) is the only place that needs to change.

import { apiUrl } from './base.js';

const TOKEN_KEY = 'lc_admin_token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

// Spread into a fetch's headers wherever a request needs to be authenticated.
export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Asks the backend whether the locally saved JWT is still good.
 * Returns the admin user object when it is, or null when there's no token or
 * the backend rejects it (in which case the bad token is cleared).
 */
export async function verifySession() {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(apiUrl('/api/admin/session'), {
      headers: { ...authHeader() },
    });

    if (!res.ok) {
      clearToken();
      return null;
    }

    const data = await res.json();
    return data.user || data || null;
  } catch (err) {
    // Network/backend unreachable: treat as "not verified" rather than
    // wiping a token that might still be valid once the backend is back.
    console.warn('Admin session check failed:', err.message);
    return null;
  }
}

export async function login(email, password) {
  const res = await fetch(apiUrl('/api/admin/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let message = res.status === 401 ? 'Incorrect email or password' : 'Login failed';
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // response wasn't JSON — keep the default message
    }
    throw new Error(message);
  }

  const data = await res.json();
  if (!data.token) throw new Error('Server did not return a token');

  setToken(data.token);
  return data.user || null;
}

export async function logout() {
  const token = getToken();
  clearToken();
  if (!token) return;

  try {
    await fetch(apiUrl('/api/admin/logout'), {
      method: 'POST',
      headers: { ...authHeader() },
    });
  } catch {
    // Best-effort — the token is already cleared locally either way.
  }
}