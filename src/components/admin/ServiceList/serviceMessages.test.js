import {
  branchesLabel,
  buildConsultMessage,
  buildStoreUpdateMessage,
  storesLabel,
  warehousesLabel,
  wantsMoreBranches,
} from "./serviceMessages";

describe("etiquetas con plural", () => {
  it("usa singular con 1 y plural con cualquier otra cantidad", () => {
    expect(storesLabel(1)).toBe("1 tienda");
    expect(storesLabel(0)).toBe("0 tiendas");
    expect(warehousesLabel(1)).toBe("1 almacén");
    expect(warehousesLabel(3)).toBe("3 almacenes");
    expect(branchesLabel(1)).toBe("1 sucursal");
    expect(branchesLabel(4)).toBe("4 sucursales");
  });
});

describe("wantsMoreBranches", () => {
  const current = { currentStores: 2, currentWarehouses: 1 };

  it("es falso si no pide más de ningún tipo", () => {
    expect(wantsMoreBranches({ stores: 2, warehouses: 1, ...current })).toBe(false);
    expect(wantsMoreBranches({ stores: 1, warehouses: 0, ...current })).toBe(false);
  });

  it("es verdadero si pide más tiendas o más almacenes", () => {
    expect(wantsMoreBranches({ stores: 3, warehouses: 1, ...current })).toBe(true);
    expect(wantsMoreBranches({ stores: 2, warehouses: 2, ...current })).toBe(true);
  });
});

describe("mensajes de WhatsApp", () => {
  it("arma el mensaje de ampliación con los totales", () => {
    const message = buildStoreUpdateMessage({ stores: 3, warehouses: 1, currentStores: 1, currentWarehouses: 0 });
    expect(message).toBe(
      "Hola, actualmente tengo 1 tienda y 0 almacenes. "
      + "Por lo que ahora quiero tener 3 tiendas y 1 almacén, dando un total de 4 sucursales."
    );
  });

  it("arma el mensaje de consulta con el servicio y el texto", () => {
    expect(buildConsultMessage("Integración con terceros", "¿Cuánto cuesta?")).toBe(
      "Hola, me gustaría solicitar cambios en Integración con terceros: ¿Cuánto cuesta?"
    );
  });
});
