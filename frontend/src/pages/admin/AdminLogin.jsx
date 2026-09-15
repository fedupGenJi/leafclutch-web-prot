import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { useSite } from '../../context/SiteContext.jsx';
import { navigate, navigateOnClick } from '../../utils/navigate.js';
import { ADMIN_PATHS, PATHS } from '../../config/nav.js';
import Icon from '../../components/Icon.jsx';

function redirectTarget() {
  if (typeof window === 'undefined') return ADMIN_PATHS.dashboard;
  const params = new URLSearchParams(window.location.search);
  const to = params.get('redirect');
  // Only ever redirect back into the admin app — never off-site.
  return to && to.startsWith('/admin') ? to : ADMIN_PATHS.dashboard;
}

export default function AdminLogin() {
  const { status, login } = useAdminAuth();
  const { assets } = useSite();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Already logged in (e.g. came back to /admin/login with a valid saved
  // token) — skip the form entirely.
  useEffect(() => {
    if (status === 'authed') navigate(redirectTarget(), { replace: true });
  }, [status]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(redirectTarget(), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (status === 'checking' || status === 'authed') {
    return (
      <div className="admin-login-screen">
        <HomeButton />
        <div className="admin-splash">Checking your session…</div>
      </div>
    );
  }

  return (
    <div className="admin-login-screen">
      <HomeButton />
      <div className="admin-login-card">
        <a href={PATHS.home} className="admin-login-logo" onClick={navigateOnClick(PATHS.home)}>
          <img src={assets.logoHorizontal} alt="" />
        </a>

        <h1>Admin sign in</h1>
        <p className="admin-login-sub">Sign in to manage site content.</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Username</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </label>

          <label className="admin-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="admin-login-error" role="alert">{error}</p>}

          <button type="submit" className="admin-login-submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

function HomeButton() {
  return (
    <a
      href={PATHS.home}
      className="admin-login-home-btn"
      onClick={navigateOnClick(PATHS.home)}
    >
      <Icon name="chevronDown" size={16} className="admin-login-home-icon" />
      Home
    </a>
  );
}
