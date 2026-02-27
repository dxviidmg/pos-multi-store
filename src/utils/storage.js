export const getStorage = (name) => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(name);
  return data ? JSON.parse(data) : [];
};

export const setStorage = (name, data) => {
  localStorage.setItem(name, JSON.stringify(data));
};
