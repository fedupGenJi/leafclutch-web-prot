import { useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { ToastProvider } from '../../context/ToastContext.jsx';
import { useCurrentPath } from '../../hooks/useCurrentPath.js';
import { navigate } from '../../utils/navigate.js';
import { ADMIN_PATHS, isPathActive } from '../../config/nav.js';
import AdminLogin from './AdminLogin.jsx';
import AdminDashboard from './AdminDashboard.jsx';

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <AdminRoutes />
      </ToastProvider>
    </AdminAuthProvider>
  );
}

function AdminRoutes() {
  const currentPath = useCurrentPath();

  if (isPathActive(currentPath, ADMIN_PATHS.login)) return <AdminLogin />;
  if (isPathActive(currentPath, ADMIN_PATHS.dashboard)) return <AdminDashboard />;
  // Bare "/admin" and any other unrecognized /admin/* path both fall through
  // to the gate, which routes on to login or the dashboard as appropriate.
  return <AdminGate />;
}

// Bare "/admin" (and any unrecognized /admin/* path): asks the backend
// whether the saved JWT is still valid and forwards to the dashboard or the
// login page. Renders nothing lasting — it's a redirect, not a page.
function AdminGate() {
  const { status } = useAdminAuth();

  useEffect(() => {
    if (status === 'checking') return;
    navigate(status === 'authed' ? ADMIN_PATHS.dashboard : ADMIN_PATHS.login, { replace: true });
  }, [status]);

  return (
    <div className="admin-login-screen">
      <div className="admin-splash">Checking your session…</div>
    </div>
  );
}