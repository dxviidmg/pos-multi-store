import { mapLoginError } from "./loginErrors";

const error = (status, code) => ({ response: { status, data: { code } } });

describe("mapLoginError", () => {
  it("negocio inactivo: contactar a soporte", () => {
    expect(mapLoginError(error(403, "tenant_inactive"))).toBe("Este negocio está inactivo. Contacta a soporte.");
  });

  it("suscripción vencida: contactar al propietario", () => {
    expect(mapLoginError(error(403, "subscription_expired"))).toBe(
      "La suscripción del negocio venció. Contacta al propietario para reactivarla."
    );
  });

  it("400: credenciales incorrectas", () => {
    expect(mapLoginError(error(400))).toBe("Usuario o contraseña incorrectos.");
  });

  it("cualquier otro error, o sin respuesta, da el mensaje general", () => {
    expect(mapLoginError(error(500))).toBe("No se pudo iniciar sesión. Intenta de nuevo.");
    expect(mapLoginError(error(403, "otro"))).toBe("No se pudo iniciar sesión. Intenta de nuevo.");
    expect(mapLoginError(new Error("network"))).toBe("No se pudo iniciar sesión. Intenta de nuevo.");
  });
});
