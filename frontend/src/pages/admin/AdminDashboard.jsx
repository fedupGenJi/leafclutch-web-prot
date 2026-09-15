import { useEffect } from 'react';
import AdminTopbar from '../../components/admin/AdminTopbar.jsx';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { useCurrentPath } from '../../hooks/useCurrentPath.js';
import { navigate } from '../../utils/navigate.js';
import { ADMIN_PATHS, DEFAULT_ADMIN_SECTION, findAdminSection } from '../../config/nav.js';
import HeroContentSection from './sections/HeroContentSection.jsx';
import ServicesSection from './sections/ServicesSection.jsx';
import SocialsSection from './sections/SocialsSection.jsx';
import JobsInternshipsSection from './sections/JobsInternshipsSection.jsx';
import SettingsSection from './sections/SettingsSection.jsx';

const SECTION_COMPONENTS = {
  'hero-content': HeroContentSection,
  services: ServicesSection,
  socials: SocialsSection,
  'jobs-internships': JobsInternshipsSection,
  settings: SettingsSection,
};

export default function AdminDashboard() {
  const { status } = useAdminAuth();
  const currentPath = useCurrentPath();

  const section = findAdminSection(currentPath);

  // No recognized subsection (bare /admin/dashboard, or a typo'd path) — land
  // on the default section and keep the URL in sync with what's rendered.
  useEffect(() => {
    if (status === 'authed' && !section) {
      navigate(DEFAULT_ADMIN_SECTION.path, { replace: true });
    }
  }, [status, section]);

  // Not authenticated (session check finished and failed, or a direct visit
  // to /admin/dashboard with no saved token) — send to login, remembering
  // where the visitor was headed.
  useEffect(() => {
    if (status === 'guest') {
      const redirect = encodeURIComponent(currentPath);
      navigate(`${ADMIN_PATHS.login}?redirect=${redirect}`, { replace: true });
    }
  }, [status, currentPath]);

  if (status !== 'authed') {
    return (
      <div className="admin-login-screen">
        <div className="admin-splash">
          {status === 'checking' ? 'Checking your session…' : 'Redirecting to sign in…'}
        </div>
      </div>
    );
  }

  const SectionComponent = section ? SECTION_COMPONENTS[section.key] : null;

  return (
    <div className="admin-dashboard">
      <AdminTopbar />
      <main className="admin-content">{SectionComponent && <SectionComponent />}</main>
    </div>
  );
}