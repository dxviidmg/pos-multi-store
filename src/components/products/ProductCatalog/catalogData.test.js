import { IMAGE_POLICY, buildCatalogRows, filterCatalogProducts, getCatalogFileName, getImageCoverage, getImagePolicy, getZeroStockCoverage, getCatalogHead, getWholesaleCoverage, isValidUntilDate } from "./catalogData";

describe("getCatalogFileName", () => {
  it("quita acentos y símbolos y agrega la fecha", () => {
    expect(getCatalogFileName("Ñandú & Café", new Date(2026, 9, 18))).toBe("catalogo-nandu-cafe-2026-10-18.pdf");
  });

  it("usa un nombre genérico si el título queda vacío", () => {
    expect(getCatalogFileName("***", new Date(2026, 0, 5))).toBe("catalogo-productos-2026-01-05.pdf");
  });
});

describe("buildCatalogRows", () => {
  it("devuelve código, nombre y precio con formato de moneda", () => {
    expect(buildCatalogRows([{ code: "A1", name: "Leche", unit_price: 1234 }])).toEqual([["A1", "Leche", "$1,234.00"]]);
  });

  it("con mayoreo agrega precio y mínimo; sin mayoreo en el producto pone guiones", () => {
    const products = [
      { code: "A1", name: "Leche", unit_price: 20, apply_wholesale: true, wholesale_price: 18, min_wholesale_quantity: "6.00" },
      { code: "B2", name: "Pan", unit_price: 5, apply_wholesale: false, wholesale_price: null, min_wholesale_quantity: null },
    ];
    expect(buildCatalogRows(products, true)).toEqual([
      ["A1", "Leche", "$20.00", "$18.00", "6"],
      ["B2", "Pan", "$5.00", "—", "—"],
    ]);
  });
});

describe("filterCatalogProducts", () => {
  const products = [{ id: 1, stock: 3 }, { id: 2, stock: 0 }];

  it("omite los productos sin stock por defecto", () => {
    expect(filterCatalogProducts(products, false)).toEqual([{ id: 1, stock: 3 }]);
  });

  it("los conserva con includeZeroStock", () => {
    expect(filterCatalogProducts(products, true)).toHaveLength(2);
  });
});

describe("getImageCoverage", () => {
  it("cuenta productos con imagen y redondea el porcentaje", () => {
    expect(getImageCoverage([{ image: "a" }, { image: null }, { image: "" }])).toEqual({ withImage: 1, total: 3, percent: 33 });
  });

  it("devuelve 0 sin productos", () => {
    expect(getImageCoverage([])).toEqual({ withImage: 0, total: 0, percent: 0 });
  });
});

describe("getImagePolicy", () => {
  it.each([[0, IMAGE_POLICY.NEVER], [24, IMAGE_POLICY.NEVER], [25, IMAGE_POLICY.OPTIONAL], [75, IMAGE_POLICY.OPTIONAL], [76, IMAGE_POLICY.ALWAYS], [100, IMAGE_POLICY.ALWAYS]])(
    "%i %% -> %s", (percent, policy) => expect(getImagePolicy(percent)).toBe(policy)
  );
});

describe("getZeroStockCoverage", () => {
  it("cuenta productos sin stock y redondea el porcentaje", () => {
    expect(getZeroStockCoverage([{ stock: 0 }, { stock: 2 }, { stock: 0 }])).toEqual({ zeroStock: 2, total: 3, percent: 67 });
  });

  it("devuelve 0 sin productos", () => {
    expect(getZeroStockCoverage([])).toEqual({ zeroStock: 0, total: 0, percent: 0 });
  });
});

describe("getCatalogHead", () => {
  it("agrega las columnas de mayoreo solo si se piden", () => {
    expect(getCatalogHead(false)).toEqual(["Código", "Producto", "Precio unitario"]);
    expect(getCatalogHead(true)).toEqual(["Código", "Producto", "Precio unitario", "Precio mayoreo", "Cantidad mínima mayoreo"]);
  });
});

describe("isValidUntilDate", () => {
  it("exige fecha y que no sea anterior a hoy", () => {
    expect(isValidUntilDate("", "2026-10-18")).toBe(false);
    expect(isValidUntilDate("2026-10-17", "2026-10-18")).toBe(false);
    expect(isValidUntilDate("2026-10-18", "2026-10-18")).toBe(true);
    expect(isValidUntilDate("2026-11-30", "2026-10-18")).toBe(true);
  });
});

describe("getWholesaleCoverage", () => {
  it("cuenta productos con mayoreo y redondea el porcentaje", () => {
    expect(getWholesaleCoverage([{ apply_wholesale: true }, { apply_wholesale: false }, { apply_wholesale: false }]))
      .toEqual({ withWholesale: 1, total: 3, percent: 33 });
  });

  it("devuelve 0 sin productos", () => {
    expect(getWholesaleCoverage([])).toEqual({ withWholesale: 0, total: 0, percent: 0 });
  });
});
