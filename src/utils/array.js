/**
 * Reemplaza el elemento con el mismo id o lo agrega al final si no existe.
 */
export const upsertById = (list, item) =>
  list.some((el) => el.id === item.id)
    ? list.map((el) => (el.id === item.id ? item : el))
    : [...list, item];
