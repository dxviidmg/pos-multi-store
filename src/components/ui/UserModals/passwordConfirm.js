/** Estado de la confirmación: null (vacía), "match" o "mismatch". */
export const getConfirmState = (newPassword, confirmPassword) => {
  if (!confirmPassword) return null;
  return confirmPassword === newPassword ? "match" : "mismatch";
};

/** Props de TextField (error y texto de ayuda) según el estado de la confirmación. */
export const getConfirmFieldProps = (state) => {
  if (state === "mismatch") return { error: true, helperText: "Las contraseñas no coinciden" };
  if (state === "match") {
    return { helperText: "Las contraseñas coinciden", FormHelperTextProps: { sx: { color: "success.main" } } };
  }
  return {};
};
