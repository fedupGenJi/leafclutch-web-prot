import { useState } from 'react';

const HEX_RE = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export default function ColorField({ label, hint, value, onChange }) {
  const [draft, setDraft] = useState(value);
  const valid = HEX_RE.test(draft);

  function commit(next) {
    setDraft(next);
    if (HEX_RE.test(next)) onChange(next);
  }

  return (
    <div className="color-field">
      <div className="color-field-info">
        <span className="color-field-label">{label}</span>
        <span className="color-field-hint">{hint}</span>
      </div>

      <div className="color-field-controls">
        <label className="color-swatch" style={{ backgroundColor: valid ? draft : value }}>
          <input
            type="color"
            value={valid ? draft : value}
            onChange={(e) => commit(e.target.value)}
          />
        </label>
        <input
          type="text"
          className={`color-hex ${valid ? '' : 'is-invalid'}`}
          value={draft}
          spellCheck={false}
          onChange={(e) => commit(e.target.value)}
        />
      </div>
    </div>
  );
}
