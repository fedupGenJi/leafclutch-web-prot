import { useEffect, useState } from 'react';
import { useSite } from '../../../context/SiteContext.jsx';
import { getHeroContent, updateHeroContent } from '../../../api/admin.js';

const FIELDS = [
  { key: 'desc', label: 'Description', type: 'textarea' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'emailSecondary', label: 'Secondary email', type: 'email' },
  { key: 'contactNumber', label: 'Contact number', type: 'text' },
  { key: 'contactNumberSecondary', label: 'Secondary contact number', type: 'text' },
  { key: 'address', label: 'Address', type: 'text' },
  {
    key: 'mapLink',
    label: 'Map link',
    type: 'url',
    hint:
      'For the full place card (rating, reviews, name) on the Contact page, paste the src ' +
      'from Google Maps → search your business → Share → Embed a map → Copy HTML (use the ' +
      'link inside src="..."). A plain address or shared place link only shows a bare pin.',
  },
];

export default function HeroContentSection() {
  const { heroContent } = useSite();
  const [form, setForm] = useState(heroContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getHeroContent()
      .then((data) => {
        if (!cancelled && data) setForm((prev) => ({ ...prev, ...data }));
      })
      .catch((err) => {
        if (!cancelled) setStatus({ type: 'error', message: err.message });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const next = await updateHeroContent(form);
      if (next) setForm((prev) => ({ ...prev, ...next }));
      setStatus({ type: 'success', message: 'Hero content saved' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-section">
      <header className="admin-section-header">
        <h1>HeroContent</h1>
        <p>The description and contact details shown across the homepage and footer.</p>
      </header>

      {loading ? (
        <p className="admin-section-loading">Loading…</p>
      ) : (
        <form className="admin-form" onSubmit={handleSave}>
          {FIELDS.map((field) => (
            <label key={field.key} className="admin-field">
              <span>{field.label}</span>
              {field.type === 'textarea' ? (
                <textarea
                  rows={4}
                  value={form[field.key] ?? ''}
                  onChange={(e) => setField(field.key, e.target.value)}
                />
              ) : (
                <input
                  type={field.type}
                  value={form[field.key] ?? ''}
                  onChange={(e) => setField(field.key, e.target.value)}
                />
              )}
              {field.hint && <small className="field-hint">{field.hint}</small>}
            </label>
          ))}

          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {status && <span className={`admin-status is-${status.type}`}>{status.message}</span>}
          </div>
        </form>
      )}
    </section>
  );
}
