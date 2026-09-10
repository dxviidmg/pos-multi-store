import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const UserContext = createContext(null);

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// El middleware corre en el servidor y no ve localStorage.
// Guardamos una cookie mínima (sin datos sensibles) para que el
// middleware sepa que hay una sesión activa.
const SESSION_COOKIE = "user";

const setSessionCookie = () => {
  if (typeof document === "undefined") return;
  // Sin datos sensibles: solo un flag de presencia de sesión.
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

const clearSessionCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
};

export const UserProvider = ({ children }) => {
  // Start with null so server render and first client render match,
  // then hydrate from localStorage after mount to avoid hydration mismatch.
  const [user, setUser] = useState(null);
  // isLoading = todavía no hemos leído localStorage. Sirve para no
  // tratar "aún no cargado" como "no autenticado".
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    // Mantener la cookie sincronizada con localStorage al cargar.
    if (stored) {
      setSessionCookie();
    } else {
      clearSessionCookie();
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setSessionCookie();
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    clearSessionCookie();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};
