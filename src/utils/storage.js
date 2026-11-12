/**
 * Acceso seguro a localStorage: nunca lanza (modo privado, cuota llena o JSON corrupto).
 */

export const readString = (key, fallback = null) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
};

export const writeString = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Almacenamiento no disponible; se ignora.
  }
};

export const readJSON = (key, fallback = null) => {
  const raw = readString(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  try {
    writeString(key, JSON.stringify(value));
  } catch {
    // Valor no serializable; se ignora.
  }
};

export const removeKey = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Almacenamiento no disponible; se ignora.
  }
};
