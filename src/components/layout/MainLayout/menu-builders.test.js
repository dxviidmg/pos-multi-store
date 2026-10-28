import { buildMenu } from "./menu-builders";

const user = (overrides) => ({ role: "admin", store_type: "T", multistore: true, ...overrides });

const labels = (items) => items.map((item) => item.label);
const find = (items, label) => items.find((item) => item.label === label);

describe("buildMenu", () => {
  it("vendedor con una sola sucursal ve solo lo que puede abrir, sin submenús de un ítem", () => {
    const menu = buildMenu(user({ role: "seller", multistore: false }));
    expect(labels(menu)).toEqual(["Vender", "Ventas y apartados", "Movimientos en caja"]);
    expect(menu.every((item) => !item.dropdown)).toBe(true);
  });

  it("vendedor con varias sucursales también ve traspasos", () => {
    expect(labels(buildMenu(user({ role: "seller" })))).toEqual(["Vender", "Ventas y apartados", "Movimientos en caja", "Traspasos"]);
  });

  it("administrador de tienda ve el menú completo en su orden", () => {
    expect(labels(buildMenu(user({})))).toEqual([
      "Vender", "Ventas y apartados", "Caja", "Clientes", "Movimientos", "Productos",
      "Inventario", "Historial",
    ]);
  });

  it("Ventas y Productos son submenús con sus pantallas", () => {
    const menu = buildMenu(user({}));
    expect(labels(find(menu, "Ventas y apartados").dropdown)).toEqual(["Ventas y apartados", "Importar ventas"]);
    expect(labels(find(menu, "Productos").dropdown)).toEqual([
      "Productos", "Importar", "Marcas y departamentos",
    ]);
  });

  it("las entradas de sección abren su primera pestaña y marcan su sección", () => {
    const menu = buildMenu(user({}));
    expect(find(menu, "Caja")).toMatchObject({ href: "/corte-caja/", sectionId: "cash" });
    expect(find(menu, "Movimientos")).toMatchObject({ href: "/distribuciones/", sectionId: "transfers" });
  });

  it("con una sola sucursal desaparecen los movimientos entre sucursales", () => {
    expect(labels(buildMenu(user({ multistore: false })))).not.toContain("Movimientos");
  });

  it("almacén no tiene ventas, caja ni clientes", () => {
    expect(labels(buildMenu(user({ store_type: "A" })))).toEqual([
      "Distribuir", "Movimientos", "Productos", "Inventario", "Historial",
    ]);
  });

  it("vista general del dueño: tableros, equipo, facturación y servicios", () => {
    const menu = buildMenu(user({ role: "owner", store_type: null }));
    expect(labels(menu)).toEqual([
      "Tableros", "Tiendas", "Vendedores", "Clientes", "Productos",
      "Auditoría", "Facturación", "Servicios", "Sincronizar",
    ]);
    expect(labels(find(menu, "Productos").dropdown)).toEqual([
      "Productos", "Importar productos", "Ajustes de inventario", "Marcas y departamentos",
    ]);
  });

  it("dueño con varias sucursales dentro de una tienda ve el selector de sucursal", () => {
    const stores = [{ id: 1, name: "Principal" }];
    const menu = buildMenu(user({ role: "owner" }), { stores });
    expect(menu[0].label).toBe("Tienda");
    expect(menu[0].dropdown).toEqual([{ label: "Principal", storeId: 1 }]);
  });

  it("dueño con una sola sucursal ve 'Regresar' en lugar del selector", () => {
    const menu = buildMenu(user({ role: "owner", store_type: "T", multistore: false }));
    expect(menu[0]).toMatchObject({ label: "Regresar", action: "go-back" });
  });
});
