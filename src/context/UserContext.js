import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { readJSON, removeKey, writeJSON } from '../utils/storage';

const UserContext = createContext(null);

const getStoredUser = () => readJSON(STORAGE_KEYS.USER);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const login = useCallback((userData) => {
    writeJSON(STORAGE_KEYS.USER, userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    removeKey(STORAGE_KEYS.USER);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      writeJSON(STORAGE_KEYS.USER, updated);
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, updateUser }),
    [user, login, logout, updateUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};
