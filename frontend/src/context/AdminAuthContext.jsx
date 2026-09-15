import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { verifySession, login as loginRequest, logout as logoutRequest } from '../api/auth.js';

const AdminAuthContext = createContext(null);

// 'checking' | 'authed' | 'guest'
export function AdminAuthProvider({ children }) {
  const [status, setStatus] = useState('checking');
  const [user, setUser] = useState(null);

  const recheck = useCallback(async () => {
    setStatus('checking');
    const sessionUser = await verifySession();
    if (sessionUser) {
      setUser(sessionUser);
      setStatus('authed');
    } else {
      setUser(null);
      setStatus('guest');
    }
    return sessionUser;
  }, []);

  useEffect(() => {
    recheck();
  }, [recheck]);

  const login = useCallback(async (username, password) => {
    const loggedInUser = await loginRequest(username, password);
    setUser(loggedInUser);
    setStatus('authed');
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
    setStatus('guest');
  }, []);

  return (
    <AdminAuthContext.Provider value={{ status, user, login, logout, recheck }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
