import { useState, useEffect } from 'react';

export const useThemeMode = () => {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleMode = () => {
    localStorage.setItem('hasSeenUpdates', 'true');
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { mode, toggleMode };
};
