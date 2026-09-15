import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon.jsx';
import { useSite } from '../../context/SiteContext.jsx';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { useCurrentPath } from '../../hooks/useCurrentPath.js';
import { navigate, navigateOnClick } from '../../utils/navigate.js';
import { PATHS, ADMIN_SECTIONS, ADMIN_SETTINGS_SECTION, isPathActive } from '../../config/nav.js';

export default function AdminTopbar() {
  const { assets } = useSite();
  const { logout } = useAdminAuth();
  const currentPath = useCurrentPath();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const topbarRef = useRef(null);

  // Close the mobile drawer on outside click, Escape, or a resize back to
  // desktop width — mirrors the pattern the public Navbar already uses.
  useEffect(() => {
    if (!drawerOpen) return undefined;

    function onPointerDown(e) {
      if (topbarRef.current && !topbarRef.current.contains(e.target)) setDrawerOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen]);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 900) setDrawerOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  async function handleLogout() {
    setDrawerOpen(false);
    await logout();
    navigate(PATHS.admin);
  }

  return (
    <header className="admin-topbar" ref={topbarRef}>
      <div className="admin-topbar-inner">
        <a
          href={PATHS.home}
          className="admin-logo"
          onClick={navigateOnClick(PATHS.home)}
          aria-label="Back to homepage"
        >
          <img src={assets.logoHorizontal} alt="" />
        </a>

        <nav className="admin-nav" aria-label="Dashboard sections">
          {ADMIN_SECTIONS.map((section) => (
            <SectionLink key={section.key} section={section} currentPath={currentPath} />
          ))}
        </nav>

        <div className="admin-topbar-actions">
          <SectionLink
            section={ADMIN_SETTINGS_SECTION}
            currentPath={currentPath}
            className="admin-settings-btn"
            icon="settings"
          />
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <Icon name="logout" size={18} />
            <span>Log out</span>
          </button>

          <button
            type="button"
            className="admin-drawer-toggle"
            aria-expanded={drawerOpen}
            aria-controls="admin-drawer"
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <Icon name={drawerOpen ? 'close' : 'list'} size={22} />
          </button>
        </div>
      </div>

      <div id="admin-drawer" className={`admin-drawer ${drawerOpen ? 'is-open' : ''}`} hidden={!drawerOpen}>
        <nav className="admin-drawer-nav" aria-label="Dashboard sections">
          {[...ADMIN_SECTIONS, ADMIN_SETTINGS_SECTION].map((section) => (
            <SectionLink
              key={section.key}
              section={section}
              currentPath={currentPath}
              className="admin-drawer-link"
              onNavigate={() => setDrawerOpen(false)}
            />
          ))}
          <button type="button" className="admin-drawer-link admin-drawer-logout" onClick={handleLogout}>
            <Icon name="logout" size={18} />
            <span>Log out</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

function SectionLink({ section, currentPath, className = '', icon, onNavigate }) {
  const active = isPathActive(currentPath, section.path, true);
  return (
    <a
      href={section.path}
      className={`admin-nav-link ${active ? 'is-active' : ''} ${className}`}
      aria-current={active ? 'page' : undefined}
      onClick={(e) => {
        navigateOnClick(section.path)(e);
        onNavigate?.();
      }}
    >
      {icon && <Icon name={icon} size={17} />}
      {section.label}
    </a>
  );
}
