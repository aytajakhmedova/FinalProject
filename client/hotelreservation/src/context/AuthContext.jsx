import React, { createContext, useContext, useMemo, useState } from 'react';
import { clearAuthSession, getAuthToken, saveAuthSession } from '../api/auth';

const AuthContext = createContext();

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const token = getAuthToken();
  const [user, setUser] = useState(() => (token ? readStoredUser() : null));

  const applySession = (auth, options) => {
    saveAuthSession(auth, options);
    setUser(readStoredUser());
    return auth;
  };

  const login = (auth, options) => applySession(auth, options);

  const logout = () => {
    clearAuthSession();
    setUser(null);
  };

  const register = (auth, options) => applySession(auth, options);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(getAuthToken()),
      login,
      logout,
      register,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
