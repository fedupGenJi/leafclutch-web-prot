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
  arrowUpRight: <path d="M7 17L17 7M8.5 7H17v8.5" {...stroke} />,

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
