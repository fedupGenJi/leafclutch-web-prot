import { useState } from 'react';
import Icon from '../../../components/Icon.jsx';
import brand from '../../../brand.js';
import { useAdminAuth } from '../../../context/AdminAuthContext.jsx';
import { changePassword } from '../../../api/admin.js';
import { checkPassword, strengthLabel } from '../../../config/password.js';

// Brand identity is shown here read-only for reference. There's no editor —
// it's managed elsewhere (brand.js is the single source of truth per its own
// header comment) — so this section only surfaces it, at fixed sizes, next
// to the one thing an admin actually changes here: their password.
const COLOR_FIELDS = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
  { key: 'background', label: 'Background' },
  { key: 'surface', label: 'Surface' },
  { key: 'text', label: 'Text' },
];

export default function SettingsSection() {
  return (
    <section className="admin-section admin-section-settings">
      <header className="admin-section-header">
        <h1>Settings</h1>
        <p>Your account and password, plus the brand identity used across the site.</p>
      </header>

      <div className="settings-grid">
        <div className="settings-area-account">
          <AccountCard />
        </div>
        <div className="settings-area-password">
          <PasswordCard />
        </div>
        <div className="settings-area-brand">
          <BrandCard />
        </div>
      </div>
    </section>
  );
}

function AccountCard() {
  const { user } = useAdminAuth();

  return (
    <div className="settings-card">
      <div className="settings-card-head">
        <Icon name="settings" size={18} />
        <h2>Account</h2>
      </div>
      <p className="settings-card-sub">Signed in as</p>
      <div className="settings-readonly-field">
        <span>{user?.username || '—'}</span>
      </div>
    </div>
  );
}

function PasswordCard() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const strength = checkPassword(newPassword);
  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;

  function reset() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (!currentPassword) {
      setStatus({ type: 'error', message: 'Enter your current password.' });
      return;
    }
    if (!strength.isStrong) {
      setStatus({ type: 'error', message: 'New password does not meet the requirements below.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      reset();
      setStatus({ type: 'success', message: 'Password updated.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="settings-card">
      <div className="settings-card-head">
        <Icon name="lock" size={18} />
        <h2>Change password</h2>
      </div>
      <p className="settings-card-sub">Choose a strong password you don't use anywhere else.</p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label className="admin-field is-full">
          <span>Current password</span>
          <div className="password-input-row">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              autoComplete="current-password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-visibility-toggle"
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
              onClick={() => setShowCurrent((v) => !v)}
            >
              <Icon name={showCurrent ? 'eyeOff' : 'eye'} size={17} />
            </button>
          </div>
        </label>

        <label className="admin-field is-full">
          <span>New password</span>
          <div className="password-input-row">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              autoComplete="new-password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-visibility-toggle"
              aria-label={showNew ? 'Hide password' : 'Show password'}
              onClick={() => setShowNew((v) => !v)}
            >
              <Icon name={showNew ? 'eyeOff' : 'eye'} size={17} />
            </button>
          </div>
        </label>

        <div className="admin-field is-full password-strength-block">
          <div className={`strength-bar strength-${newPassword ? strength.score : 0}`}>
            {strength.results.map((r) => (
              <span key={r.key} />
            ))}
          </div>
          <span className="strength-label">
            {newPassword ? strengthLabel(strength.score) : 'Enter a new password'}
          </span>
          <ul className="password-rules">
            {strength.results.map((r) => (
              <li key={r.key} className={r.passed ? 'is-met' : ''}>
                <Icon name="check" size={13} />
                {r.label}
              </li>
            ))}
          </ul>
        </div>

        <label className="admin-field is-full">
          <span>Confirm new password</span>
          <input
            type={showNew ? 'text' : 'password'}
            value={confirmPassword}
            autoComplete="new-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmMismatch && <small className="field-hint">Passwords don't match.</small>}
        </label>

        <div className="admin-form-actions">
          <button type="submit" className="admin-save-btn" disabled={saving}>
            {saving ? 'Saving…' : 'Update password'}
          </button>
          {status && <span className={`admin-status is-${status.type}`}>{status.message}</span>}
        </div>
      </form>
    </div>
  );
}

function BrandCard() {
  return (
    <div className="settings-card">
      <div className="settings-card-head">
        <h2>Brand</h2>
      </div>
      <p className="settings-card-sub">Reference only — the site's brand identity isn't editable here.</p>

      <div className="brand-readonly">
        <img src={brand.logo} alt="" className="brand-readonly-logo" />
        <strong>{brand.siteName}</strong>
      </div>

      <div className="brand-swatch-grid">
        {COLOR_FIELDS.map((field) => (
          <div className="brand-swatch" key={field.key}>
            <span className="brand-swatch-color" style={{ background: brand.colors[field.key] }} />
            <div>
              <strong>{field.label}</strong>
              <span>{brand.colors[field.key]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
