/** Traduce un error de login a un mensaje en español según status y code del backend. */
export const mapLoginError = (error) => {
  const status = error.response?.status;
  const code = error.response?.data?.code;
  if (status === 403 && code === "tenant_inactive") {
    // Negocio cancelado: nadie entra, ni el dueño. La reactivación es por soporte.
    return "Este negocio está inactivo. Contacta a soporte.";
  }
  if (status === 403 && code === "subscription_expired") {
    return "La suscripción del negocio venció. Contacta al propietario para reactivarla.";
  }
  if (status === 400) {
    return "Usuario o contraseña incorrectos.";
  }
  return "No se pudo iniciar sesión. Intenta de nuevo.";
};
