// Inline SVGs rather than an icon package: it keeps the dependency list at
// react/react-dom, and the social icons need to be addressable by the icon_key
// string stored in the socials table.

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const PATHS = {
  mail: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" {...stroke} />
      <path d="M3 7l9 6 9-6" {...stroke} />
    </>
  ),
  phone: (
    <path
      d="M6.5 3h3l1.5 4-2 1.5a12 12 0 006.5 6.5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17.5 17.5 0 014.5 5.2 2 2 0 016.5 3z"
      {...stroke}
    />
  ),
  mapPin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" {...stroke} />
      <circle cx="12" cy="10" r="2.5" {...stroke} />
    </>
  ),
  chevronDown: <path d="M5 9l7 7 7-7" {...stroke} />,
  menu: <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" {...stroke} />,
  close: <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" {...stroke} />,
  check: <path d="M4.5 12.5l5 5 10-11" {...stroke} />,
  alert: (
    <>
      <path d="M12 3.5l9.5 16.5h-19L12 3.5z" {...stroke} />
      <path d="M12 10v4.5" {...stroke} />
      <circle cx="12" cy="17.3" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V5a1.5 1.5 0 011.5-1.5h2A1.5 1.5 0 0114.5 5v2" {...stroke} />
      <path d="M6.5 7l1 12.5A2 2 0 009.5 21.5h5a2 2 0 002-2L17.5 7" {...stroke} />
      <path d="M10 11v6M14 11v6" {...stroke} />
    </>
  ),
  pencil: (
    <path
      d="M4 20l.7-3.6L15.9 5.2a1.7 1.7 0 012.4 0l1.5 1.5a1.7 1.7 0 010 2.4L8.6 20.3 4 21l1-1z"
      {...stroke}
    />
  ),
  plus: <path d="M12 4.5v15M4.5 12h15" {...stroke} />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {...stroke} />
      <circle cx="12" cy="12" r="3" {...stroke} />
    </>
  ),
  eyeOff: (
    <>
      <path d="M3.5 3.5l17 17" {...stroke} />
      <path d="M10.6 5.7A10.6 10.6 0 0112 5.5c6 0 9.5 6.5 9.5 6.5a15.6 15.6 0 01-3.2 4M7 6.9C4.2 8.7 2.5 12 2.5 12S6 18.5 12 18.5a9.7 9.7 0 004-.85" {...stroke} />
      <path d="M9.9 10a3 3 0 004.1 4.1" {...stroke} />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.2" {...stroke} />
      <path d="M8 10.5V7.5a4 4 0 018 0v3" {...stroke} />
      <circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  arrowUpRight: <path d="M7 17L17 7M8.5 7H17v8.5" {...stroke} />,

  list: (
    <>
      <circle cx="4.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="17.5" r="1" fill="currentColor" stroke="none" />
      <path d="M8.5 6.5h11M8.5 12h11M8.5 17.5h11" {...stroke} />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" {...stroke} />
      <path
        d="M19.4 13.5a7.6 7.6 0 000-3l1.9-1.5-2-3.4-2.3.7a7.6 7.6 0 00-2.6-1.5L14 2.5h-4l-.4 2.3a7.6 7.6 0 00-2.6 1.5l-2.3-.7-2 3.4L4.6 10.5a7.6 7.6 0 000 3l-1.9 1.5 2 3.4 2.3-.7a7.6 7.6 0 002.6 1.5l.4 2.3h4l.4-2.3a7.6 7.6 0 002.6-1.5l2.3.7 2-3.4-1.9-1.5z"
        {...stroke}
      />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5.5a2 2 0 01-2-2V5a2 2 0 012-2H9" {...stroke} />
      <path d="M16 17l5-5-5-5M21 12H9" {...stroke} />
    </>
  ),

  facebook: (
    <path
      fill="currentColor"
      d="M14.5 8.8V7.3c0-.7.5-.9.9-.9h2.2V3.1h-3c-3.3 0-4 2.4-4 4v1.7H8.4v3.3h2.2V21h3.9v-8.9h2.7l.3-3.3h-3z"
    />
  ),
  x: (
    <path
      fill="currentColor"
      d="M17.2 3h3.3l-7.2 8.2L21.8 21h-6.6l-5.2-6.7L3.9 21H.6l7.7-8.8L.4 3H7l4.7 6.2L17.2 3zm-1.2 16h1.8L6.1 4.9H4.2L16 19z"
    />
  ),
  linkedin: (
    <>
      <path
        fill="currentColor"
        d="M4.9 8.9h3.3V21H4.9V8.9zm1.6-5.4a1.9 1.9 0 110 3.8 1.9 1.9 0 010-3.8z"
      />
      <path
        fill="currentColor"
        d="M10.4 8.9h3.2v1.7h.1a3.5 3.5 0 013.1-1.7c3.3 0 3.9 2.2 3.9 5V21h-3.3v-5.4c0-1.3 0-3-1.8-3s-2 1.4-2 2.9V21h-3.2V8.9z"
      />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" {...stroke} />
      <circle cx="12" cy="12" r="4" {...stroke} />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" {...stroke} />
      <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none" />
    </>
  ),
  tiktok: (
    <path
      fill="currentColor"
      d="M16.3 3c.3 2.1 1.5 3.4 3.7 3.6v2.5c-1.3.1-2.5-.2-3.8-1v5.6c0 4.7-4.4 6.9-7.6 4.8-2.1-1.4-2.7-4.4-1.4-6.6 1.1-1.8 3.2-2.6 5.3-2.2v2.6c-.3-.1-.6-.2-.9-.2-1.3-.1-2.3.8-2.4 2-.1 1.3.9 2.4 2.2 2.4 1.2 0 2.2-1 2.2-2.3V3h2.7z"
    />
  ),
  discord: (
    <path
      fill="currentColor"
      d="M19.3 5.6A16.4 16.4 0 0015.4 4.4l-.2.4a13 13 0 00-6.4 0l-.2-.4A16.4 16.4 0 004.7 5.6C2.3 9.1 1.7 12.5 2 15.9a16.6 16.6 0 004.9 2.5l.6-1.1a11 11 0 01-1.9-.9l.5-.4a11.8 11.8 0 0011.8 0l.5.4c-.6.4-1.2.7-1.9.9l.6 1.1a16.6 16.6 0 004.9-2.5c.4-3.9-.6-7.3-2.7-10.3zM9 14c-.9 0-1.6-.8-1.6-1.8S8.1 10.4 9 10.4s1.6.8 1.6 1.8S9.9 14 9 14zm6 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8S15.9 14 15 14z"
    />
  ),
  whatsapp: (
    <path
      fill="currentColor"
      d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.78h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26C2.16 6.45 6.6 2 12.05 2c2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c0 5.45-4.44 9.89-9.88 9.89zm8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.15 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.23-6.16-3.48-8.42z"
    />
  ),
};

export default function Icon({ name, size = 20, className = '', title }) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      className={`icon ${className}`}
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

export const ICON_KEYS = Object.keys(PATHS);