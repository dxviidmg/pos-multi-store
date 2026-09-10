export const getErrorMessage = (error, fallback = "Error de conexión") =>
  error.response?.data?.message || error.message || fallback;
