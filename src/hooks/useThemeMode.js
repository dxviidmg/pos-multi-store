import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { readString, writeString } from '../utils/storage';

export const useThemeMode = () => {
  const [mode, setMode] = useState(() => readString(STORAGE_KEYS.THEME_MODE) || 'light');

  useEffect(() => {
    writeString(STORAGE_KEYS.THEME_MODE, mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { mode, toggleMode };
};
