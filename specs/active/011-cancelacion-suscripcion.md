# [011] Cancelación de suscripción (baja de plan)

> **Estado:** draft  
> **Fecha de creación:** 2026-09-08  
> **Última actualización:** 2026-09-08  
> **Autor:** David  

---

## Problema / Necesidad

Actualmente un dueño que contrató un plan de tipo suscripción (domiciliación, cobro recurrente vía MercadoPago) **no tiene forma de darse de baja por sí mismo**. Existe la creación de suscripción (`createSubscription`) y el listado (`getSubscriptions`), pero no hay endpoint ni UI para cancelar. Esto obliga a intervención manual y genera fricción/soporte.

Se necesita permitir que el dueño cancele su suscripción de forma autónoma, deteniendo el cobro recurrente, pero conservando el acceso hasta el final del periodo ya pagado.

---

## Solución Propuesta

Agregar en la pantalla **Mi Plan Actual** (`MyCurrentPlan.jsx`) una acción para **cancelar la suscripción**, visible **solo cuando**:

- El usuario es **Dueño**, y
- El plan actual es de tipo suscripción (`billing_type: "S"` / domiciliación activada).

Al pulsar, se abre un **modal de confirmación** que:

1. Explica que el acceso continúa hasta el fin del periodo pagado.
2. Pide un **motivo de cancelación** (para análisis).
3. Requiere confirmación explícita.

Al confirmar, el frontend llama a un nuevo endpoint (`cancelSubscription`). El **backend** detiene el cobro recurrente en MercadoPago y marca la suscripción como `cancelled`.

---

## Comportamiento Esperado

### Flujo feliz
1. El dueño entra a **Mi Plan Actual**.
2. Ve el chip "Domiciliación activada" y un botón/enlace **"Cancelar suscripción"**.
3. Pulsa → se abre el modal de confirmación.
4. Selecciona un **motivo** (obligatorio) y opcionalmente escribe un comentario.
5. Confirma con **"Sí, cancelar"**.
6. El sistema llama al backend; muestra spinner.
7. Al éxito:
   - Mensaje de éxito: "Tu suscripción fue cancelada. Tendrás acceso hasta el final de tu periodo pagado."
   - La UI actualiza el estado a **cancelada** (ya no muestra "Domiciliación activada"; muestra un aviso de "Suscripción cancelada — acceso hasta [fecha si está disponible]").
   - El botón "Cancelar suscripción" desaparece.
8. El cobro recurrente ya no se ejecuta en el siguiente ciclo (responsabilidad de backend).

### Flujo de error
- Si el backend responde error, mostrar `Alert` con el mensaje devuelto (`detail`/`error`) o uno genérico: "No se pudo cancelar la suscripción. Intenta de nuevo o contacta a soporte."
- El modal permanece abierto para reintentar.

### Reactivación
- Tras cancelar, **no hay auto-reactivación** desde la UI.
- Se muestra un texto indicando: "Para reactivar tu suscripción, contacta a soporte." (reutilizar el botón/enlace de WhatsApp de soporte si existe).

---

## Criterios de Aceptación

- [ ] El botón "Cancelar suscripción" solo es visible para el rol **Dueño**
- [ ] El botón solo aparece si el plan es de tipo suscripción (`billing_type: "S"`)
- [ ] Admin y Vendedor **no** ven ni pueden ejecutar la cancelación
- [ ] Al pulsar se abre un modal de confirmación
- [ ] El modal requiere seleccionar un **motivo** antes de poder confirmar
- [ ] El modal deja claro que el acceso sigue hasta el fin del periodo pagado
- [ ] Al confirmar, se llama a `cancelSubscription` con el motivo (y comentario opcional)
- [ ] Al éxito, la UI refleja el estado "cancelada" y oculta el botón
- [ ] Al error, se muestra el mensaje y el modal permanece abierto
- [ ] Se muestra el aviso de "contactar a soporte para reactivar"
- [ ] Mientras se procesa, se muestra spinner y el botón de confirmar queda deshabilitado
- [ ] No se realiza ningún cobro ni reembolso desde el frontend

---

## Diseño de UI

**Ubicación:** pantalla **Mi Plan Actual** — ruta `/mi-plan-actual/`, componente `MyCurrentPlan.jsx` (`App.js`). Esta ruta ya está restringida al rol **Dueño (Owner)**, lo que coincide con el requisito. El botón va en el bloque del plan actual (junto al chip "Domiciliación activada").

**Botón:**
- Texto: "Cancelar suscripción"
- Estilo discreto (no destacado): `variant="text"` o `outlined` en color `error`, tamaño `small`.
- Colocado de forma que no compita visualmente con acciones positivas (ej. debajo de los datos del plan, alineado a la derecha o en una zona secundaria).

**Modal de confirmación** (usar `CustomModal` + `useModal`, como el resto del componente):
- Título: "Cancelar suscripción"
- Cuerpo:
  - Párrafo explicativo: acceso hasta fin de periodo pagado, sin reembolsos, se detiene el cobro recurrente.
  - `Select` / grupo de opciones **Motivo de cancelación** (obligatorio).
  - `TextField` multilínea opcional: "Comentario (opcional)".
- Acciones:
  - Botón secundario: "No, mantener" (cierra el modal).
  - Botón primario (color `error`): "Sí, cancelar" — deshabilitado hasta elegir motivo; muestra estado de carga al enviar.

**Motivos sugeridos** (a confirmar con David):
- Muy caro / precio
- Ya no uso el sistema
- Me cambié a otra herramienta
- Faltan funcionalidades
- Problemas técnicos
- Cierre / pausa del negocio
- Otro (habilita comentario)

---

## Reglas de Negocio

- La cancelación **no es inmediata en términos de acceso**: el negocio sigue operando hasta el final del periodo ya pagado.
- La cancelación **sí es inmediata** en cuanto a detener el cobro recurrente futuro (no se cobra el siguiente ciclo).
- **Sin reembolsos** del periodo en curso.
- Solo aplica a planes `billing_type: "S"` (suscripción/domiciliación). Planes de otro tipo de facturación no muestran esta opción.
- Solo el **Dueño** puede ejecutar la acción.
- La reactivación es **manual vía soporte** (fuera del alcance de esta UI).

---

## Permisos / Roles

| Rol | Puede cancelar |
|-----|----------------|
| Dueño | ✅ Sí |
| Administrador | ❌ No |
| Vendedor | ❌ No |

La visibilidad del botón debe basarse en el rol del usuario del contexto de autenticación (mismo mecanismo que ya se usa para restringir vistas por rol).

---

## Datos / API

### Nuevo endpoint (frontend)
`src/api/subscriptions.js`:

```js
export const cancelSubscription = (data) =>
  httpClient.post(getApiUrl('subscriptions/cancel'), data);
```

**Payload propuesto:**
```json
{
  "reason": "price",          // clave del motivo seleccionado
  "comment": "texto opcional"  // opcional
}
```
> El backend identifica la suscripción activa del tenant a partir del token/tenant; no es necesario enviar el ID desde el frontend (a confirmar con backend).

**Respuesta esperada (éxito):** `200`/`201` con la suscripción actualizada (`status: "cancelled"`) y, de ser posible, la fecha hasta la que hay acceso.

### Estados de suscripción
El frontend ya contempla `active` / `paused` / `cancelled` en `SubscriptionList.jsx` (`statusMap`). Reutilizar esa nomenclatura.

---

## Qué pedir al Backend (contrato requerido)

Esta funcionalidad **no puede completarse solo en frontend**. Estas son las peticiones concretas para el equipo de backend:

### 1. Nuevo endpoint: cancelar suscripción

- **Método y ruta:** `POST /subscriptions/cancel`
- **Autenticación:** token del usuario (el backend identifica el tenant y su suscripción activa a partir del token; el frontend **no** enviará el ID de la suscripción).
- **Autorización:** solo el rol **Dueño**. El backend debe rechazar (403) si el usuario es Admin o Vendedor, aunque el frontend ya oculte el botón.
- **Request body:**
  ```json
  {
    "reason": "price",           // clave del motivo (ver lista de valores abajo)
    "comment": "texto opcional"  // string opcional, puede venir vacío o ausente
  }
  ```
- **Valores válidos de `reason`** (deben coincidir con la UI):
  `price`, `not_using`, `switched_tool`, `missing_features`, `technical_issues`, `business_closed`, `other`
- **Qué debe hacer el backend al recibirlo:**
  1. Detener el cobro recurrente en MercadoPago (cancelar el `preapproval` correspondiente).
  2. Marcar la suscripción como `cancelled`.
  3. Persistir `reason` y `comment` (para análisis posterior).
  4. **Mantener el acceso del tenant hasta el final del periodo ya pagado** (no cortar acceso de inmediato).
  5. **No** generar reembolso ni prorrateo.
- **Respuesta esperada (éxito, 200/201):**
  ```json
  {
    "status": "cancelled",
    "access_until": "2026-10-08T00:00:00Z"  // fecha hasta la que el tenant tiene acceso
  }
  ```
- **Respuesta de error:** JSON con `detail` o `error` (string legible), y código HTTP apropiado (400/403/409/500). El frontend lo mostrará tal cual.

### 2. Exponer la fecha de "acceso hasta" / fin de periodo

Hoy el endpoint `tenant-dates` devuelve `tenant_created_at`, `active_subscription_date` y `first_payment_date`, pero **no** una fecha de fin de periodo pagado ni de próximo cobro.

- **Petición:** agregar un campo tipo `access_until` (o `current_period_end` / `next_payment_date`) que indique hasta cuándo el tenant conserva acceso tras cancelar.
- **Dónde:** idealmente en la respuesta de `subscriptions/cancel` (arriba) y/o en `tenant-dates` / `getCurrentPlan`, para poder mostrar el mensaje "Tendrás acceso hasta [fecha]".
- Si backend **no** puede proporcionar esta fecha, el frontend mostrará el mensaje **sin** fecha concreta ("hasta el final de tu periodo pagado"), pero es preferible tenerla.

### 3. Reflejar el estado cancelado en las consultas de plan

- `getCurrentPlan` (y/o `getSubscriptions`) debe reflejar que la suscripción quedó `cancelled`, para que al recargar la pantalla el frontend muestre el estado correcto y oculte el botón de cancelar.

### 4. Retención / respaldo de datos (responsabilidad de backend)

- Definir y ejecutar en backend la política de conservación de datos del tenant (productos, ventas, inventario) tras la cancelación y para una eventual reactivación por soporte. Fuera del alcance del frontend, pero se documenta como dependencia.

---

## Impacto en Código Existente

- `src/api/subscriptions.js`:
  - Agregar `cancelSubscription`.

- `src/components/tenant/MyCurrentPlan/MyCurrentPlan.jsx`:
  - Mostrar botón "Cancelar suscripción" (solo Dueño + `billing_type: "S"`).
  - Nuevo `useModal` para el modal de cancelación.
  - Estado local: `cancelReason`, `cancelComment`, `cancelling`, `cancelResult`.
  - Handler `handleCancelSubscription` que llama a `cancelSubscription` y actualiza el estado del plan al éxito.
  - Mostrar aviso "contactar a soporte para reactivar" cuando la suscripción esté cancelada.

- (Opcional) `src/constants/` o el propio componente: definir la lista de **motivos** de cancelación como constante reutilizable.

- (Opcional) `src/constants/helpTexts.js`: agregar texto de ayuda contextual para la sección.

---

## Fuera de Alcance

- Auto-reactivación de la suscripción desde la UI (se hace vía soporte).
- Reembolsos o prorrateos.
- Cancelación por parte de Admin/Vendedor.
- Manejo del cobro recurrente en MercadoPago (lo hace backend).
- Retención/eliminación/respaldo de datos del tenant (lo hace backend).
- Downgrade/cambio de plan (esta spec es solo baja total).

---

## Checklist de Implementación

- [ ] Agregar `cancelSubscription` en `src/api/subscriptions.js`
- [ ] Definir constante de motivos de cancelación
- [ ] En `MyCurrentPlan.jsx`, detectar rol Dueño + `billing_type: "S"`
- [ ] Agregar botón "Cancelar suscripción" (discreto, color error)
- [ ] Crear modal con `CustomModal` + `useModal`
- [ ] Añadir `Select` de motivo (obligatorio) y comentario opcional
- [ ] Deshabilitar "Sí, cancelar" hasta elegir motivo
- [ ] Implementar `handleCancelSubscription` con estados de carga/éxito/error
- [ ] Al éxito: actualizar estado del plan a cancelado y ocultar botón
- [ ] Mostrar aviso "contactar a soporte para reactivar"
- [ ] Mostrar "acceso hasta [fecha]" si backend expone la fecha
- [ ] Verificar que Admin/Vendedor no ven la opción
- [ ] Probar flujo de éxito y de error
