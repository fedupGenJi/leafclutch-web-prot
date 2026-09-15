import { useEffect, useMemo, useState } from 'react';
import Modal from './Modal.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import Switch from './Switch.jsx';
import Icon from '../Icon.jsx';
import { useToast } from '../../context/ToastContext.jsx';

function slugify(value) {
  return (value || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Every table in schema.sql that isn't the single-row hero_content follows
 * the same shape: a name-ish field, some content fields, sort_order and
 * is_active. This component drives the list + popup editor + confirmations
 * for all of them (services, socials, jobs, internships) from one place.
 */
export default function CrudManager({
  noun, // singular label, e.g. "service"
  nounPlural,
  description,
  fields, // [{ key, label, type, required, placeholder, hint, options }]
  api, // { list, create, update, remove }
  titleKey = 'name',
  titleFallbackKey = null,
  subtitleKey = null,
  subtitlePrefix = '',
  renderMeta, // (item) => node | null, extra line under the title
  autoSlugFrom = null, // field key to derive a slug suggestion from, or null
}) {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [editorItem, setEditorItem] = useState(null); // null = closed, {} = new, object = editing
  const [draft, setDraft] = useState({});
  const [formError, setFormError] = useState(null);

  const [pendingSave, setPendingSave] = useState(false);
  const [saving, setSaving] = useState(false);

  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [togglingId, setTogglingId] = useState(null);

  function emptyDraft() {
    const base = { sort_order: items.length, is_active: true };
    fields.forEach((f) => {
      base[f.key] = f.type === 'number' ? 0 : '';
    });
    return base;
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .list()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setItems(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function displayTitle(item) {
    if (!item) return '';
    return item[titleKey] || (titleFallbackKey && item[titleFallbackKey]) || '';
  }

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [items]
  );

  function openNew() {
    setDraft(emptyDraft());
    setFormError(null);
    setEditorItem({});
  }

  function openEdit(item) {
    setDraft({ ...item });
    setFormError(null);
    setEditorItem(item);
  }

  function closeEditor() {
    setEditorItem(null);
    setPendingSave(false);
  }

  function setField(key, value) {
    setDraft((prev) => {
      const next = { ...prev, [key]: value };
      if (autoSlugFrom === key && !prev._slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    for (const f of fields) {
      if (f.required && !String(draft[f.key] ?? '').trim()) {
        setFormError(`${f.label} is required.`);
        return;
      }
    }
    setFormError(null);
    setPendingSave(true);
  }

  const isNew = editorItem && !editorItem.id;

  async function confirmSave() {
    setSaving(true);
    try {
      const payload = { ...draft };
      delete payload._slugTouched;
      if (isNew) {
        const created = await api.create(payload);
        setItems((prev) => [...prev, created || payload]);
      } else {
        const updated = await api.update(editorItem.id, payload);
        setItems((prev) => prev.map((it) => (it.id === editorItem.id ? { ...it, ...(updated || payload) } : it)));
      }
      showToast({ type: 'success', message: `${cap(noun)} ${isNew ? 'added' : 'updated'}.` });
      setPendingSave(false);
      closeEditor();
    } catch (err) {
      showToast({ type: 'error', message: err.message });
      setPendingSave(false);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await api.delete(pendingDelete.id);
      setItems((prev) => prev.filter((it) => it.id !== pendingDelete.id));
      showToast({ type: 'success', message: `${cap(noun)} deleted.` });
      setPendingDelete(null);
    } catch (err) {
      showToast({ type: 'error', message: err.message });
    } finally {
      setDeleting(false);
    }
  }

  async function toggleActive(item) {
    setTogglingId(item.id);
    const nextActive = !item.is_active;
    try {
      const updated = await api.update(item.id, { ...item, is_active: nextActive });
      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, ...(updated || { is_active: nextActive }) } : it)));
      showToast({ type: 'info', message: `${cap(noun)} ${nextActive ? 'shown on' : 'hidden from'} the site.` });
    } catch (err) {
      showToast({ type: 'error', message: err.message });
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <section className="admin-section">
      <header className="admin-section-header">
        <div>
          <h1>{cap(nounPlural)}</h1>
          <p>{description}</p>
        </div>
        <button type="button" className="admin-save-btn admin-add-btn" onClick={openNew}>
          <Icon name="plus" size={16} />
          Add {noun}
        </button>
      </header>

      {loadError && <p className="admin-status is-error">{loadError}</p>}

      {loading ? (
        <div className="admin-skeleton-list">
          <div className="admin-skeleton-row" />
          <div className="admin-skeleton-row" />
          <div className="admin-skeleton-row" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="admin-empty-state">
          <p>No {nounPlural} yet.</p>
          <button type="button" className="admin-save-btn" onClick={openNew}>
            <Icon name="plus" size={16} />
            Add your first {noun}
          </button>
        </div>
      ) : (
        <ul className="admin-list">
          {sorted.map((item) => (
            <li key={item.id} className={`admin-list-row ${item.is_active ? '' : 'is-inactive'}`}>
              <div className="admin-list-main">
                <div className="admin-list-heading">
                  <strong>{displayTitle(item) || '(untitled)'}</strong>
                  {subtitleKey && item[subtitleKey] && (
                    <span className="admin-list-meta">
                      {subtitlePrefix}
                      {item[subtitleKey]}
                    </span>
                  )}
                  {!item.is_active && <span className="admin-tag admin-tag-muted">Hidden</span>}
                </div>
                {renderMeta && renderMeta(item)}
              </div>

              <div className="admin-list-actions">
                <Switch
                  checked={item.is_active}
                  disabled={togglingId === item.id}
                  onChange={() => toggleActive(item)}
                  label="Active"
                />
                <button type="button" className="admin-icon-btn" onClick={() => openEdit(item)} aria-label={`Edit ${displayTitle(item)}`}>
                  <Icon name="pencil" size={15} />
                </button>
                <button
                  type="button"
                  className="admin-icon-btn is-danger"
                  onClick={() => setPendingDelete(item)}
                  aria-label={`Delete ${displayTitle(item)}`}
                >
                  <Icon name="trash" size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ---------------------------------------------------------- Editor */}
      <Modal
        open={!!editorItem}
        onClose={closeEditor}
        title={isNew ? `Add ${noun}` : `Edit ${noun}`}
        subtitle={isNew ? `Create a new ${noun} entry.` : `Editing “${displayTitle(editorItem)}”.`}
      >
        {editorItem && (
          <form className="admin-form" onSubmit={handleSubmit} id="crud-editor-form">
            {fields.map((f) => (
              <label key={f.key} className={`admin-field ${f.span === 'full' ? 'is-full' : ''}`}>
                <span>
                  {f.label}
                  {f.required && <em className="req-mark">*</em>}
                </span>
                {f.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    value={draft[f.key] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                ) : f.type === 'select' ? (
                  <select value={draft[f.key] ?? ''} onChange={(e) => setField(f.key, e.target.value)}>
                    <option value="" disabled>
                      Choose…
                    </option>
                    {f.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type === 'url' ? 'url' : f.type === 'email' ? 'email' : f.type === 'number' ? 'number' : 'text'}
                    value={draft[f.key] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => {
                      setField(f.key, e.target.value);
                      if (f.key === 'slug') setDraft((prev) => ({ ...prev, _slugTouched: true }));
                    }}
                  />
                )}
                {f.hint && <small className="field-hint">{f.hint}</small>}
              </label>
            ))}

            <label className="admin-field is-full">
              <span>Sort order</span>
              <input
                type="number"
                value={draft.sort_order ?? 0}
                onChange={(e) => setField('sort_order', Number(e.target.value))}
              />
              <small className="field-hint">Lower numbers appear first.</small>
            </label>

            <div className="admin-field is-full admin-active-row">
              <Switch checked={draft.is_active} onChange={(v) => setField('is_active', v)} label="Visible on the site" />
            </div>

            {formError && <p className="admin-status is-error">{formError}</p>}
          </form>
        )}
        <div className="admin-modal-footer" style={{ marginTop: 4 }}>
          <button type="button" className="admin-cancel-btn" onClick={closeEditor}>
            Cancel
          </button>
          <button type="submit" form="crud-editor-form" className="admin-save-btn">
            {isNew ? 'Add' : 'Save changes'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={pendingSave}
        title={isNew ? `Add this ${noun}?` : `Save changes?`}
        message={
          isNew
            ? `“${displayTitle(draft) || 'This entry'}” will be added and, if visible, will appear on the live site right away.`
            : `Changes to “${displayTitle(draft) || displayTitle(editorItem) || 'this entry'}” will be saved and reflected on the live site right away.`
        }
        confirmLabel={isNew ? 'Add' : 'Save'}
        busy={saving}
        onConfirm={confirmSave}
        onCancel={() => setPendingSave(false)}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        tone="danger"
        title={`Delete this ${noun}?`}
        message={`“${displayTitle(pendingDelete)}” will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}