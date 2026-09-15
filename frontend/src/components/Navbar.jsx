import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import RollingTextButton from './RollingTextButton.jsx';
import { useSite } from '../context/SiteContext.jsx';
import { useCurrentPath } from '../hooks/useCurrentPath.js';
import { PATHS, hrefFor, isPathActive, anyPathActive } from '../config/nav.js';

const MOBILE_BREAKPOINT = 1024;
// Grace period when the pointer crosses the gap between a trigger and its
// panel, so the menu doesn't snap shut mid-reach.
const HOVER_CLOSE_DELAY = 140;

const OTHERS_ITEMS = [
  { label: 'Training & Internship', path: PATHS.training },
  { label: 'Blogs', path: PATHS.blogs },
  { label: 'Career', path: PATHS.career },
  { label: 'FAQ', path: PATHS.faq },
  { label: 'Our Works', path: PATHS.works },
];

export default function Navbar() {
  const { assets, services } = useSite();
  const currentPath = useCurrentPath();

  const [openMenu, setOpenMenu] = useState(null); // 'services' | 'others' | null
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const closeTimer = useRef(null);

  // "All Services" is exact-matched so it doesn't stay lit on a service
  // subpage; the individual services prefix-match their own detail routes.
  const serviceItems = [
    { key: 'all', label: 'All Services', path: PATHS.services, exact: true },
    ...services.map((s) => ({
      key: s.slug || s.id,
      label: s.name,
      path: `${PATHS.services}/${s.slug}`,
    })),
  ];

  const servicesActive = anyPathActive(currentPath, serviceItems);
  const othersActive = anyPathActive(currentPath, OTHERS_ITEMS);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Pointer devices open on hover; touch and keyboard still use click, which
  // is why the trigger stays a real <button> rather than a hover-only target.
  function canHover() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      window.innerWidth > MOBILE_BREAKPOINT
    );
  }

  function handleHoverOpen(menu) {
    if (!canHover()) return;
    clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  }

  function handleHoverClose() {
    if (!canHover()) return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), HOVER_CLOSE_DELAY);
  }

  useEffect(() => {
    if (!openMenu) return undefined;

    const onPointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openMenu]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Navbar logo returns to the top of the current page rather than navigating.
  function handleLogoClick(e) {
    e.preventDefault();
    setMobileOpen(false);
    setOpenMenu(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggle(menu) {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  }

  return (
    <header className="navbar" ref={navRef}>
      <div className="navbar-inner">
        <a
          href="#top"
          className="navbar-logo"
          onClick={handleLogoClick}
          aria-label="Leafclutch Technologies — back to top"
        >
          <img src={assets.logoHorizontal} alt="Leafclutch Technologies" />
        </a>

        <nav className="navbar-links" aria-label="Main">
          <NavLink label="Home" path={PATHS.home} currentPath={currentPath} />
          <NavLink label="About Us" path={PATHS.about} currentPath={currentPath} />

          <Dropdown
            label="Services"
            items={serviceItems}
            currentPath={currentPath}
            isActive={servicesActive}
            isOpen={openMenu === 'services'}
            onToggle={() => toggle('services')}
            onHoverOpen={() => handleHoverOpen('services')}
            onHoverClose={handleHoverClose}
            onNavigate={() => setOpenMenu(null)}
          />

          <NavLink label="Our Products" path={PATHS.products} currentPath={currentPath} />

          <Dropdown
            label="Others"
            items={OTHERS_ITEMS}
            currentPath={currentPath}
            isActive={othersActive}
            isOpen={openMenu === 'others'}
            onToggle={() => toggle('others')}
            onHoverOpen={() => handleHoverOpen('others')}
            onHoverClose={handleHoverClose}
            onNavigate={() => setOpenMenu(null)}
          />
        </nav>

        <div className="navbar-actions">
          <RollingTextButton href={hrefFor(PATHS.contact)} label="Contact Us" />

          <button
            type="button"
            className="navbar-toggle"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${mobileOpen ? 'is-open' : ''}`} hidden={!mobileOpen}>
        <nav className="mobile-nav" aria-label="Mobile">
          <MobileLink label="Home" path={PATHS.home} currentPath={currentPath} />
          <MobileLink label="About Us" path={PATHS.about} currentPath={currentPath} />

          <MobileGroup
            label="Services"
            items={serviceItems}
            currentPath={currentPath}
            isActive={servicesActive}
            isOpen={openMenu === 'services'}
            onToggle={() => toggle('services')}
          />

          <MobileLink label="Our Products" path={PATHS.products} currentPath={currentPath} />

          <MobileGroup
            label="Others"
            items={OTHERS_ITEMS}
            currentPath={currentPath}
            isActive={othersActive}
            isOpen={openMenu === 'others'}
            onToggle={() => toggle('others')}
          />

          <RollingTextButton
            href={hrefFor(PATHS.contact)}
            label="Contact Us"
            className="mobile-contact"
          />
        </nav>
      </div>
    </header>
  );
}

function NavLink({ label, path, currentPath }) {
  const active = isPathActive(currentPath, path);
  return (
    <a
      className={`nav-link ${active ? 'is-current' : ''}`}
      href={hrefFor(path)}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </a>
  );
}

function Dropdown({
  label,
  items,
  currentPath,
  isActive,
  isOpen,
  onToggle,
  onHoverOpen,
  onHoverClose,
  onNavigate,
}) {
  return (
    <div
      className={`nav-dropdown ${isOpen ? 'is-open' : ''}`}
      onMouseEnter={onHoverOpen}
      onMouseLeave={onHoverClose}
    >
      <button
        type="button"
        className={`nav-link nav-dropdown-trigger ${isActive ? 'is-current' : ''}`}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        {label}
        <Icon name="chevronDown" size={16} className="nav-caret" />
      </button>

      <ul className="nav-dropdown-panel" role="menu">
        {items.map((item) => {
          const active = isPathActive(currentPath, item.path, item.exact);
          return (
            <li key={item.key || item.label} role="none">
              <a
                role="menuitem"
                href={hrefFor(item.path)}
                className={active ? 'is-current' : ''}
                aria-current={active ? 'page' : undefined}
                onClick={onNavigate}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MobileLink({ label, path, currentPath }) {
  const active = isPathActive(currentPath, path);
  return (
    <a
      className={`mobile-link ${active ? 'is-current' : ''}`}
      href={hrefFor(path)}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </a>
  );
}

function MobileGroup({ label, items, currentPath, isActive, isOpen, onToggle }) {
  return (
    <div className={`mobile-group ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className={`mobile-link mobile-group-trigger ${isActive ? 'is-current' : ''}`}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        {label}
        <Icon name="chevronDown" size={18} className="nav-caret" />
      </button>

      <ul className="mobile-sublist">
        {items.map((item) => {
          const active = isPathActive(currentPath, item.path, item.exact);
          return (
            <li key={item.key || item.label}>
              <a
                href={hrefFor(item.path)}
                className={active ? 'is-current' : ''}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
