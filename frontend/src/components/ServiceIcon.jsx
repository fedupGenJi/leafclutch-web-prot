// Dedicated icon set for the services pages. Kept separate from
// components/Icon.jsx because these are subject-specific illustrations
// (a browser window, a phone, a chip, etc.) rather than generic UI glyphs —
// mixing the two sets would make Icon.jsx's PATHS harder to scan.
//
// Referenced from data/services.js by key (service.icon), so the data file
// stays plain data and never imports JSX itself.

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const PATHS = {
  // Web Development — browser window with a code snippet
  webDev: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.2" {...stroke} />
      <path d="M2.5 8.5h19" {...stroke} />
      <circle cx="5.3" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="7.3" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      <path d="M8.5 13l-2 2 2 2M15.5 13l2 2-2 2M13 12l-2 6" {...stroke} />
    </>
  ),

  // Mobile App Development — phone with an app grid
  mobileApp: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.4" {...stroke} />
      <path d="M10.7 18.3h2.6" {...stroke} />
      <rect x="9" y="6" width="2.6" height="2.6" rx="0.5" {...stroke} />
      <rect x="12.4" y="6" width="2.6" height="2.6" rx="0.5" {...stroke} />
      <rect x="9" y="9.4" width="2.6" height="2.6" rx="0.5" {...stroke} />
      <rect x="12.4" y="9.4" width="2.6" height="2.6" rx="0.5" {...stroke} />
    </>
  ),

  // UI/UX Design — pen nib over a layout frame
  uiUx: (
    <>
      <rect x="2.8" y="4" width="14" height="16" rx="1.8" {...stroke} />
      <path d="M2.8 8.4h14M6 8.4V20" {...stroke} />
      <path
        d="M15 15.5l5-5a1.4 1.4 0 000-2l-.5-.5a1.4 1.4 0 00-2 0l-5 5-.7 3.2 3.2-.7z"
        {...stroke}
      />
    </>
  ),

  // Custom Software Development — layered gear
  customSoftware: (
    <>
      <circle cx="12" cy="12" r="3.2" {...stroke} />
      <path
        d="M12 3.5v2.3M12 18.2v2.3M20.5 12h-2.3M5.8 12H3.5M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6M17.7 17.7l-1.6-1.6M7.9 7.9L6.3 6.3"
        {...stroke}
      />
    </>
  ),

  // AI & Machine Learning — network / chip nodes
  aiMl: (
    <>
      <rect x="8.5" y="8.5" width="7" height="7" rx="1.4" {...stroke} />
      <circle cx="4.5" cy="6" r="1.6" {...stroke} />
      <circle cx="19.5" cy="6" r="1.6" {...stroke} />
      <circle cx="4.5" cy="18" r="1.6" {...stroke} />
      <circle cx="19.5" cy="18" r="1.6" {...stroke} />
      <path d="M6 7l3 2M18 7l-3 2M6 17l3-2M18 17l-3-2" {...stroke} />
    </>
  ),

  // Cloud & DevOps — cloud with sync arrows
  cloudDevops: (
    <>
      <path
        d="M7.5 17.5a4.2 4.2 0 01-.6-8.35A5.5 5.5 0 0117.8 10a3.9 3.9 0 01-.8 7.5H7.5z"
        {...stroke}
      />
      <path d="M9.5 13.2a2.6 2.6 0 014.6-1.6M14.5 15.3a2.6 2.6 0 01-4.6 1.6" {...stroke} />
      <path d="M13.6 11l1 .4-.4 1M10.4 16.9l-1-.4.4-1" {...stroke} />
    </>
  ),

  // Cybersecurity — shield with a lock
  cybersecurity: (
    <>
      <path
        d="M12 2.7l7.3 2.9v5.2c0 4.8-3.1 8.7-7.3 10.5-4.2-1.8-7.3-5.7-7.3-10.5V5.6L12 2.7z"
        {...stroke}
      />
      <rect x="9.4" y="11.5" width="5.2" height="4.2" rx="0.9" {...stroke} />
      <path d="M10.4 11.5v-1.4a1.6 1.6 0 013.2 0v1.4" {...stroke} />
    </>
  ),

  // Digital Marketing & SEO — megaphone with a growth chart
  digitalMarketing: (
    <>
      <path d="M3 10v4h2.6L11 17.5V6.5L5.6 10H3z" {...stroke} />
      <path d="M13.5 8.5a4 4 0 010 7" {...stroke} />
      <path d="M6.5 14.4l.7 3.5a1.3 1.3 0 001.28 1.05H9.3a1 1 0 00.98-1.2l-.53-2.7" {...stroke} />
      <path d="M16.5 5l1.5 1.5M19.5 12h2M16.5 19l1.5-1.5" {...stroke} />
    </>
  ),
};

export default function ServiceIcon({ name, size = 26, className = '', title }) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      className={`service-icon ${className}`}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role={title ? 'img' : 'presentation'}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {path}
    </svg>
  );
}

export const SERVICE_ICON_KEYS = Object.keys(PATHS);
