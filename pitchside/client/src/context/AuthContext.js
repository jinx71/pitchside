import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiLogin, apiRegister, apiMe, apiUpdateFavorites } from '../api/auth';

// Token in localStorage for portfolio simplicity.
// NOTE: production should prefer httpOnly cookies to mitigate XSS.
const TOKEN_KEY = 'pitchside_token';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    apiMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (creds) => {
    const { user: u, token } = await apiLogin(creds);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (creds) => {
    const { user: u, token } = await apiRegister(creds);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const updateFavorites = useCallback(async (payload) => {
    const u = await apiUpdateFavorites(payload);
    setUser(u);
    return u;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateFavorites }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
