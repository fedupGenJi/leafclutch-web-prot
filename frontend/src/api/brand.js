const BASE = '/api/brand';

export async function fetchBrand() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to load brand settings');
  return res.json();
}

export async function updateBrand({ siteName, colors }) {
  const res = await fetch(BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ siteName, colors }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to save colors');
  }
  return res.json();
}

export async function uploadAssets({ logo, icon }) {
  const form = new FormData();
  if (logo) form.append('logo', logo);
  if (icon) form.append('icon', icon);

  const res = await fetch(`${BASE}/assets`, { method: 'POST', body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload assets');
  }
  return res.json();
}
