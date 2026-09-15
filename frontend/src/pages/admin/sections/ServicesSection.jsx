import { useEffect, useState } from 'react';
import { useSite } from '../../../context/SiteContext.jsx';
import { listServices, createService, updateService, deleteService } from '../../../api/admin.js';

const EMPTY = { name: '', slug: '', description: '' };

export default function ServicesSection() {
  const { services: initialServices } = useSite();
  const [services, setServices] = useState(initialServices);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listServices()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setServices(data);
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

  function startEdit(service) {
    setEditingId(service.id || service.slug);
    setDraft({ name: service.name || '', slug: service.slug || '', description: service.description || '' });
  }

  function startNew() {
    setEditingId('__new__');
    setDraft(EMPTY);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(EMPTY);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      if (editingId === '__new__') {
        const created = await createService(draft);
        setServices((prev) => [...prev, created || draft]);
      } else {
        const updated = await updateService(editingId, draft);
        setServices((prev) =>
          prev.map((s) => ((s.id || s.slug) === editingId ? { ...s, ...(updated || draft) } : s))
        );
      }
      setStatus({ type: 'success', message: 'Service saved' });
      cancelEdit();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(service) {
    const id = service.id || service.slug;
    setStatus(null);
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => (s.id || s.slug) !== id));
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  }

  return (
    <section className="admin-section">
      <header className="admin-section-header">
        <h1>Services</h1>
        <p>Manage the services listed in the site navigation and footer.</p>
        {editingId === null && (
          <button type="button" className="admin-save-btn" onClick={startNew}>
            Add service
          </button>
        )}
      </header>

      {status && <p className={`admin-status is-${status.type}`}>{status.message}</p>}

      {editingId !== null && (
        <form className="admin-form admin-inline-form" onSubmit={handleSave}>
          <label className="admin-field">
            <span>Name</span>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </label>
          <label className="admin-field">
            <span>Slug</span>
            <input
              type="text"
              value={draft.slug}
              onChange={(e) => setDraft((prev) => ({ ...prev, slug: e.target.value }))}
              required
            />
          </label>
          <label className="admin-field">
            <span>Description</span>
            <textarea
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
            />
          </label>
          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="admin-cancel-btn" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="admin-section-loading">Loading…</p>
      ) : services.length === 0 ? (
        <p className="admin-empty">No services yet.</p>
      ) : (
        <ul className="admin-list">
          {services.map((service) => (
            <li key={service.id || service.slug} className="admin-list-row">
              <div>
                <strong>{service.name}</strong>
                <span className="admin-list-meta">/{service.slug}</span>
                {service.description && <p className="admin-list-desc">{service.description}</p>}
              </div>
              <div className="admin-list-actions">
                <button type="button" onClick={() => startEdit(service)}>
                  Edit
                </button>
                <button type="button" className="is-danger" onClick={() => handleDelete(service)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
