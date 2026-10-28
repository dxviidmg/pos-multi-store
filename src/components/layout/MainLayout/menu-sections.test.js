import { SECTIONS, getAccessibleTabs, getSectionByPath } from "./menu-sections";

const user = (overrides) => ({ role: "admin", store_type: "T", multistore: true, ...overrides });

const ADMIN_STORE = user({});
const SELLER_STORE = user({ role: "seller" });
const ADMIN_WAREHOUSE = user({ store_type: "A" });
const OWNER_GENERAL = user({ role: "owner", store_type: null });

describe("getSectionByPath", () => {
  it("encuentra la sección de una ruta, con o sin diagonal final", () => {
    expect(getSectionByPath(ADMIN_STORE, "/ventas/").id).toBe("sales");
    expect(getSectionByPath(ADMIN_STORE, "/apartados").id).toBe("sales");
    expect(getSectionByPath(ADMIN_STORE, "/corte-caja/").id).toBe("cash");
  });

  it("devuelve null para rutas fuera de una sección", () => {
    expect(getSectionByPath(ADMIN_STORE, "/vender/")).toBeNull();
    expect(getSectionByPath(ADMIN_STORE, "/clientes/")).toBeNull();
  });

  it("una misma ruta pertenece a otra sección según la vista", () => {
    expect(getSectionByPath(ADMIN_STORE, "/conversiones/")).toBeNull();
    expect(getSectionByPath(OWNER_GENERAL, "/conversiones/").id).toBe("products");
    expect(getSectionByPath(ADMIN_STORE, "/historial-precios/").id).toBe("history");
    expect(getSectionByPath(OWNER_GENERAL, "/historial-precios/").id).toBe("products");
  });

  it("la vista general no tiene sección de inventario ni de historial", () => {
    expect(getSectionByPath(OWNER_GENERAL, "/inventario/")).toBeNull();
    expect(getSectionByPath(OWNER_GENERAL, "/historial-stock/")).toBeNull();
  });
});

describe("getAccessibleTabs", () => {
  it("deja solo las pestañas que el rol puede abrir", () => {
    expect(getAccessibleTabs(ADMIN_STORE, SECTIONS.cash).map((tab) => tab.label)).toEqual(["Corte de caja", "Movimientos"]);
    expect(getAccessibleTabs(SELLER_STORE, SECTIONS.cash).map((tab) => tab.label)).toEqual(["Movimientos"]);
  });

  it("oculta las pestañas de varias sucursales cuando solo hay una", () => {
    const single = { ...ADMIN_STORE, multistore: false };
    expect(getAccessibleTabs(single, SECTIONS.transfers)).toEqual([]);
    expect(getAccessibleTabs(ADMIN_STORE, SECTIONS.transfers)).toHaveLength(2);
  });

  it("en almacén incluye inventario, ajustes y por verificar", () => {
    const labels = getAccessibleTabs(ADMIN_WAREHOUSE, SECTIONS.inventory).map((tab) => tab.label);
    expect(labels).toEqual(["Inventario", "Ajustes", "Por verificar"]);
  });

  it("cada ruta pertenece a una sola sección por vista", () => {
    ["T", "A", "G"].forEach((view) => {
      const hrefs = Object.values(SECTIONS)
        .filter(({ views }) => !views || views.includes(view))
        .flatMap(({ tabs }) => tabs.map((tab) => tab.href));
      expect(new Set(hrefs).size).toBe(hrefs.length);
    });
  });
});
