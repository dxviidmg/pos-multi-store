# Análisis de oportunidades — Login

> Realizado: 9 de octubre de 2026

## Estado actual

El login (`src/components/layout/Login/Login.jsx`) es funcional pero tiene áreas de mejora tanto en UX como en diseño visual.

---

## 1. Oportunidades de UX

### 1.1 Indicador de carga durante login ✅ Hecho
**Problema:** El botón "Iniciar sesión" no tenía estado de carga. Un usuario podía hacer clic múltiples veces si la conexión era lenta, generando peticiones duplicadas.

**Impacto:** Solicitudes múltiples, confusión del usuario.

**Solución aplicada:**
- Se agregó `isLoading` al estado del componente.
- El botón se deshabilita y muestra un spinner (`CircularProgress`) con el texto "Iniciando sesión…" durante la petición.
- `handleSubmit` tiene guard (`if (state.isLoading) return`) para evitar dobles envíos.
- En éxito no se reinicia `isLoading` (el componente navega y se desmonta); en error sí, para permitir reintento.

---

### 1.2 Enter para enviar formulario ✅ Verificado
**Problema:** Dudas sobre si Enter dispara el submit en el campo de contraseña.

**Resultado:** El formulario ya es un `<Stack component="form" onSubmit={handleSubmit}>` con el botón `type="submit"`, tanto en desktop como en móvil. Por comportamiento nativo del navegador, al presionar Enter en cualquier input de un `<form>` con un botón submit se dispara `onSubmit`. **Funciona sin cambios**; no se agrega `onKeyDown` para no duplicar lógica.

---

### 1.3 Autocompletado y recuerda datos — ventajas y desventajas
**Estado:** Los campos ya usan `autoComplete="username"` y `autoComplete="current-password"`. El análisis es si conviene reforzarlo o cambiarlo.

**Ventajas de mantener el autocompletado del navegador:**
- Menos fricción: el usuario con contraseña guardada entra en un clic.
- Compatible con gestores de contraseñas (1Password, Bitwarden, llavero del SO), que dependen de estos atributos.
- Estándar de accesibilidad (WCAG 1.3.5 "Identify Input Purpose"): mejora para lectores de pantalla y autollenado asistido.
- Cero mantenimiento: es comportamiento nativo del navegador.

**Desventajas / riesgos:**
- En equipos compartidos (muy común en un POS de mostrador) el navegador puede ofrecer guardar o autollenar credenciales de otro usuario → riesgo de sesión equivocada.
- El navegador puede no sugerir nada en la primera visita (depende de que el usuario haya guardado antes); no es un problema del código.
- Un autollenado agresivo puede chocar visualmente con los labels flotantes de MUI (el fondo amarillo de Chrome), aunque aquí el input ya fuerza fondo blanco.

**Recomendación:** Mantener como está. Si se prioriza la seguridad en mostradores compartidos, evaluar `autoComplete="off"` solo en esos despliegues, asumiendo la pérdida de comodidad. No requiere cambio ahora.

---

## 2. Oportunidades de diseño visual

### 2.1 Botón de login con color inconsistente ✅ Hecho
**Problema:** El botón "Iniciar sesión" usaba ámbar (`colors.accent`) heredado del registro. Las demás acciones principales de la app usan navy (`colors.sidebar`).

**Solución aplicada:**
- Escritorio: botón navy (`colors.sidebar`), texto blanco, hover `colors.sidebarDark` (nuevo token exportado en `colors.js`).
- Móvil: como el fondo ya es navy, el botón primario es blanco con texto navy para que destaque. Mantiene la jerarquía "acción principal" sin perder contraste.
- Se agregó `colors.sidebarDark` a `colors.js` (antes solo existía como primitiva interna `SIDEBAR_DARK`).

---

### 2.2 Botón secundario poco diferenciado ✅ Hecho
**Problema:** "Crear mi negocio" (outlined) usaba `borderColor: "divider"` (gris), poco visible.

**Solución aplicada:**
- Escritorio: borde `primary.main`, texto `primary.main` y fill ligero `alpha(primary, 0.04)`; hover sube a `primary.dark` y `alpha(primary, 0.1)`.
- Móvil: borde blanco al 50 %, texto blanco y fill `alpha(white, 0.08)`; hover refuerza a blanco pleno y `alpha(white, 0.16)`.

---

### 2.3 Falta de indicador visual de validación ✅ Hecho
**Problema:** Sin validación en tiempo real; el formulario vacío solo fallaba al enviar.

**Solución aplicada:**
- `isFormEmpty` deshabilita el botón "Iniciar sesión" mientras usuario o contraseña estén vacíos.
- Guard en `handleSubmit`: si se intenta enviar sin datos, muestra el hint "Usuario y contraseña son obligatorios." en la alerta.
- Estilos `&.Mui-disabled` en ambos botones para que el estado deshabilitado se vea correcto sobre fondo claro (navy) y oscuro (blanco).

---

### 2.4 Alerta de error sin icon ✅ Hecho
**Problema:** El `<Alert severity="error">` usaba el ícono por defecto de MUI.

**Solución aplicada:** Se pasa `icon={<ErrorOutlineIcon fontSize="small" />}` en ambas alertas (escritorio y móvil) para una señal visual explícita y consistente.

---

### 2.5 Contraste y accesibilidad de los labels ✅ Hecho
**Problema:** Los labels (`Usuario`, `Contraseña`) en gris sobre la tarjeta clara de escritorio tenían contraste bajo (WCAG AA borderline).

**Solución aplicada:** Constante `desktopLabelSx` que pone el label en `text.primary` con `fontWeight: 500`, aplicada a ambos campos de escritorio. En móvil los campos ya tienen fondo blanco con texto oscuro, así que no requieren cambio.

---

### 2.6 Panel de marca con poco contexto en móvil ✅ Hecho
**Problema:** En móvil se oculta el panel de marca y el formulario quedaba sin textura de marca.

**Solución aplicada:** El contenedor móvil del login ya mostraba logo y "Bienvenido" sobre navy; se le agregó la misma textura del panel de marca de escritorio (brillo radial + trama de puntos) solo en `xs`, y el panel del formulario se hizo transparente en móvil para que la textura se vea completa.

---

## 3. Oportunidades de código

### 3.1 Estado con demasiadas responsabilidades ✅ Hecho
**Problema:** El estado manejaba `formData`, `alertData`, `showPassword` e `isLoading` en un único objeto, lo que obligaba a hacer spread anidado en cada actualización.

**Solución aplicada:** Se separó en hooks independientes: `formData`, `error` (string), `showPassword` e `isLoading`. La alerta ahora depende solo de que `error` tenga texto (se eliminó `alertData.shown`). Los toggles y actualizaciones quedaron más directos (`setShowPassword`, `setError`, `setIsLoading`).

---

### 3.2 Manejo de errores verboso ✅ Hecho
**Problema:** El `try/catch` encadenaba varios casos (403/tenant_inactive, 403/subscription_expired, 400, default) dentro del componente.

**Solución aplicada:** Se extrajo un helper puro a nivel de módulo `mapLoginError(error)` que devuelve el mensaje en español según `status` y `code`. El `catch` ahora es `setError(mapLoginError(err))`.

---

### 3.3 Estilos del botón secundario inline ✅ Hecho
**Problema:** Los botones (principal y secundario) definían sus estilos inline en el JSX, duplicados entre escritorio y móvil.

**Solución aplicada:** Se creó `Login.styles.js` co-locado con el componente, con los estilos reutilizables: `desktopLabelSx`, `mobileInputSx`, `desktopPrimaryButtonSx`, `mobilePrimaryButtonSx`, `desktopSecondaryButtonSx` y `mobileSecondaryButtonSx`. El JSX quedó limpio (sin `sx` inline largos). Se eligió un archivo propio junto a `Login` (y no `Registration.styles.js`) porque el login vive en `layout/`, no en el dominio `tenant/`.

---

## 4. Oportunidades de producto

### 4.1 Link a "¿Necesitas ayuda?" ❌ Descartado
No se implementará: se decidió no agregar el link de soporte en la página de login.

---

## 5. Priorización recomendada

| Prioridad | Oportunidad | Esfuerzo | Impacto |
|---|---|---|---|
| ✅ Hecho | Unificar botón login a navy | Bajo | Alto (consistencia visual) |
| ✅ Hecho | Validación de campos vacíos | Bajo | Medio (UX) |
| ✅ Hecho | Indicador de carga | Bajo | Bajo (prevención dobles clicks) |
| ✅ Hecho | Mejorar botón "Crear cuenta" | Bajo | Bajo (visibilidad) |
| ✅ Hecho | Refactor de estado | Medio | Bajo (mantenibilidad) |
| ✅ Hecho | Helper de errores | Bajo | Bajo (código limpio) |
| ✅ Hecho | Estilos del botón en archivo aparte | Bajo | Bajo (código limpio) |
| ❌ Descartado | Ayuda/soporte link | — | — |

---

## Resumen

**Sección 2 (diseño visual): completada.** Botón navy, botón secundario diferenciado, validación de campos vacíos, ícono en alertas, contraste de labels y textura de marca en móvil.

**Sección 3 (código): completada.** Estado dividido en hooks independientes, helper `mapLoginError` y estilos de botones/inputs extraídos a `Login.styles.js`.

**Pendiente:** solo la sección 4 (producto) — link de soporte y badge de API en desarrollo.

**Las 3 cosas más importantes:**
1. **Cambiar botón login a navy** — una línea, unifica con el resto de la app.
2. **Validar campos vacíos** — 2 líneas, mejora UX.
3. **Mejorar botón "Crear cuenta"** — más visibilidad para usuarios nuevos.
