import {
  LEGACY_ROUTES,
  canAccessRoute,
  getHomeRoute,
  getViewType,
  isSalesDashboardRestricted,
} from "./routeAccess";

const user = (overrides) => ({ role: "owner", store_type: null, multistore: true, ...overrides });

const OWNER_GENERAL = user({});
const OWNER_STORE = user({ store_type: "T" });
const ADMIN_STORE = user({ role: "admin", store_type: "T" });
const SELLER_STORE = user({ role: "seller", store_type: "T" });
const ADMIN_WAREHOUSE = user({ role: "admin", store_type: "A" });

describe("getViewType", () => {
  it("distingue tienda, almacén y vista general", () => {
    expect(getViewType(user({ store_type: "T" }))).toBe("T");
    expect(getViewType(user({ store_type: "A" }))).toBe("A");
    expect(getViewType(user({ store_type: null }))).toBe("G");
    expect(getViewType(null)).toBe("G");
  });
});

describe("canAccessRoute", () => {
  it("no deja entrar sin usuario o sin ruta", () => {
    expect(canAccessRoute(null, "/ventas/")).toBe(false);
    expect(canAccessRoute(OWNER_STORE, "")).toBe(false);
  });

  it("una ruta que no está en el mapa no abre para nadie", () => {
    expect(canAccessRoute(OWNER_GENERAL, "/no-existe/")).toBe(false);
  });

  it("acepta rutas con o sin diagonal final", () => {
    expect(canAccessRoute(OWNER_GENERAL, "/tiendas")).toBe(true);
    expect(canAccessRoute(OWNER_GENERAL, "/tiendas/")).toBe(true);
  });

  it("separa los permisos por rol", () => {
    expect(canAccessRoute(SELLER_STORE, "/ventas/")).toBe(true);
    expect(canAccessRoute(SELLER_STORE, "/productos/")).toBe(false);
    expect(canAccessRoute(ADMIN_STORE, "/productos/")).toBe(true);
    expect(canAccessRoute(ADMIN_STORE, "/tiendas/")).toBe(false);
    expect(canAccessRoute(OWNER_GENERAL, "/tiendas/")).toBe(true);
  });

  it("separa los permisos por vista", () => {
    expect(canAccessRoute(OWNER_GENERAL, "/inventario/")).toBe(false);
    expect(canAccessRoute(ADMIN_STORE, "/inventario/")).toBe(true);
    expect(canAccessRoute(ADMIN_WAREHOUSE, "/vender/")).toBe(false);
    expect(canAccessRoute(ADMIN_WAREHOUSE, "/distribuir/")).toBe(true);
  });

  it("exige varias sucursales en las rutas multistore", () => {
    expect(canAccessRoute(ADMIN_STORE, "/traspasos/")).toBe(true);
    expect(canAccessRoute({ ...ADMIN_STORE, multistore: false }, "/traspasos/")).toBe(false);
  });

  it("cualquier rol distinto de owner y seller se trata como administrador", () => {
    expect(canAccessRoute({ ...ADMIN_STORE, role: "manager" }, "/productos/")).toBe(true);
  });
});

describe("getHomeRoute", () => {
  it("manda a cada vista a su pantalla de inicio", () => {
    expect(getHomeRoute(ADMIN_WAREHOUSE)).toBe("/distribuir/");
    expect(getHomeRoute(SELLER_STORE)).toBe("/vender/");
    expect(getHomeRoute(OWNER_GENERAL)).toBe("/tiendas/");
    expect(getHomeRoute(user({ role: "admin" }))).toBe("/perfil/");
  });
});

describe("LEGACY_ROUTES", () => {
  const profiles = [OWNER_GENERAL, OWNER_STORE, ADMIN_STORE, ADMIN_WAREHOUSE, SELLER_STORE];

  it("cada ruta nueva existe en el mapa de permisos", () => {
    Object.values(LEGACY_ROUTES).forEach((target) => {
      expect(profiles.some((profile) => canAccessRoute(profile, target))).toBe(true);
    });
  });

  it("las rutas viejas ya no abren por sí mismas", () => {
    Object.keys(LEGACY_ROUTES).forEach((legacy) => {
      expect(profiles.some((profile) => canAccessRoute(profile, legacy))).toBe(false);
    });
  });
});

describe("isSalesDashboardRestricted", () => {
  afterEach(() => jest.useRealTimers());

  const at = (hour) => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 9, 13, hour, 0, 0));
  };

  it("restringe entre las 10:00 y las 20:59 con varias sucursales", () => {
    at(12);
    expect(isSalesDashboardRestricted(OWNER_GENERAL)).toBe(true);
    at(9);
    expect(isSalesDashboardRestricted(OWNER_GENERAL)).toBe(false);
    at(21);
    expect(isSalesDashboardRestricted(OWNER_GENERAL)).toBe(false);
  });

  it("no restringe con una sola sucursal ni en el tenant demo", () => {
    at(12);
    expect(isSalesDashboardRestricted({ ...OWNER_GENERAL, multistore: false })).toBe(false);
    expect(isSalesDashboardRestricted({ ...OWNER_GENERAL, tenant_short_name: "demo" })).toBe(false);
  });
});
