import { useState } from 'react';
import ColorField from '../components/ColorField.jsx';
import AssetUploader from '../components/AssetUploader.jsx';
import { updateBrand, uploadAssets } from '../api/brand.js';

const COLOR_FIELDS = [
  { key: 'primary', label: 'Primary', hint: 'Navigation, headers, primary actions' },
  { key: 'secondary', label: 'Secondary', hint: 'Supporting accents' },
  { key: 'accent', label: 'Accent', hint: 'Links and active states' },
  { key: 'background', label: 'Background', hint: 'Page background' },
  { key: 'surface', label: 'Surface', hint: 'Cards and panels' },
  { key: 'text', label: 'Text', hint: 'Body copy and headings' },
];

export default function BrandSettings({ brand, onBrandUpdate }) {
  const [colors, setColors] = useState(brand.colors);
  const [siteName, setSiteName] = useState(brand.siteName);
  const [pendingLogo, setPendingLogo] = useState(null);
  const [pendingIcon, setPendingIcon] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  function setColor(key, value) {
    setColors((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      let next = await updateBrand({ siteName, colors });
      if (pendingLogo || pendingIcon) {
        next = await uploadAssets({ logo: pendingLogo, icon: pendingIcon });
      }
      onBrandUpdate(next);
      setPendingLogo(null);
      setPendingIcon(null);
      setStatus({ type: 'success', message: 'Brand settings saved' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="brand-page">
      <header className="brand-header">
        <h1>Brand</h1>
        <p>Set the logo, icon and color palette used across the site.</p>
      </header>

      <div className="brand-layout">
        <div className="brand-form">
          <section className="brand-section">
            <h2>Site name</h2>
            <input
              type="text"
              className="site-name-input"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </section>

          <section className="brand-section">
            <h2>Logo &amp; icon</h2>
            <div className="asset-grid">
              <AssetUploader
                label="Logo"
                hint="Shown in the admin sidebar and site header"
                currentSrc={brand.logo}
                onFileSelect={setPendingLogo}
              />
              <AssetUploader
                label="Icon"
                hint="Used as the browser favicon"
                currentSrc={brand.icon}
                onFileSelect={setPendingIcon}
              />
            </div>
          </section>

          <section className="brand-section">
            <h2>Color palette</h2>
            <div className="color-field-list">
              {COLOR_FIELDS.map((field) => (
                <ColorField
                  key={field.key}
                  label={field.label}
                  hint={field.hint}
                  value={colors[field.key]}
                  onChange={(value) => setColor(field.key, value)}
                />
              ))}
            </div>
          </section>

          <div className="brand-save-row">
            <button type="button" className="btn-save" disabled={saving} onClick={handleSave}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {status && (
              <span className={`brand-status is-${status.type}`}>{status.message}</span>
            )}
          </div>
        </div>

        <PreviewPanel colors={colors} siteName={siteName} logoSrc={pendingLogo ? URL.createObjectURL(pendingLogo) : brand.logo} />
      </div>
    </div>
  );
}

function PreviewPanel({ colors, siteName, logoSrc }) {
  return (
    <div className="preview-panel">
      <span className="preview-label">Live preview</span>
      <div className="preview-frame" style={{ backgroundColor: colors.background }}>
        <div className="preview-topbar" style={{ backgroundColor: colors.primary }}>
          <img src={logoSrc} alt="" className="preview-logo" />
          <span style={{ color: colors.surface }}>{siteName}</span>
        </div>
        <div className="preview-body">
          <div className="preview-card" style={{ backgroundColor: colors.surface }}>
            <span className="preview-eyebrow" style={{ color: colors.secondary }}>
              Card title
            </span>
            <p style={{ color: colors.text }}>
              Body copy renders in the text color against the surface color of a card.
            </p>
            <button
              type="button"
              className="preview-btn"
              style={{ backgroundColor: colors.accent, color: colors.primary }}
            >
              Primary action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
