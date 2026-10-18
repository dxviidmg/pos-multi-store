import { formatCurrency } from "../../../utils/utils";

/** Nombre de archivo: `catalogo-<titulo-sin-acentos>-AAAA-MM-DD.pdf`. */
export const getCatalogFileName = (title, date = new Date()) => {
  const slug = title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const day = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
  return `catalogo-${slug || "productos"}-${day}.pdf`;
};

/** Cantidad mínima para el precio de mayoreo; "—" si el producto no tiene mayoreo. */
export const formatWholesaleMin = (product) =>
  product.apply_wholesale ? String(Number(product.min_wholesale_quantity)) : "—";

/** Precio de mayoreo con formato de moneda; "—" si el producto no tiene mayoreo. */
export const formatWholesalePrice = (product) =>
  product.apply_wholesale ? formatCurrency(product.wholesale_price) : "—";

/** Encabezados de la tabla del PDF (sin la columna de imagen). */
export const getCatalogHead = (withWholesale) =>
  ["Código", "Producto", "Precio unitario", ...(withWholesale ? ["Precio mayoreo", "Cantidad mínima mayoreo"] : [])];

/** Filas de la tabla del PDF: código, nombre, precio público y, con `withWholesale`, mayoreo y mínimo. */
export const buildCatalogRows = (products, withWholesale = false) =>
  products.map((product) => [
    product.code,
    product.name,
    formatCurrency(product.unit_price),
    ...(withWholesale ? [formatWholesalePrice(product), formatWholesaleMin(product)] : []),
  ]);

/** El catálogo es válido hasta `validUntil` ("AAAA-MM-DD") y esa fecha no puede ser anterior a `today`. */
export const isValidUntilDate = (validUntil, today) => Boolean(validUntil) && validUntil >= today;

export const IMAGE_POLICY = { NEVER: "never", ALWAYS: "always", OPTIONAL: "optional" };
const MIN_IMAGE_PERCENT = 25;
const MAX_IMAGE_PERCENT = 75;

/** Productos que entran al catálogo; sin `includeZeroStock` se omiten los que no tienen stock. */
export const filterCatalogProducts = (products, includeZeroStock) =>
  includeZeroStock ? products : products.filter((product) => product.stock > 0);

/** Cuántos productos tienen imagen y qué porcentaje es (entero, 0 sin productos). */
export const getImageCoverage = (products) => {
  const withImage = products.filter((product) => product.image).length;
  const percent = products.length ? Math.round((withImage / products.length) * 100) : 0;
  return { withImage, total: products.length, percent };
};

/** Menos del 25 % de imágenes: no se incluyen; más del 75 %: se incluyen; en medio decide el usuario. */
export const getImagePolicy = (percent) => {
  if (percent < MIN_IMAGE_PERCENT) return IMAGE_POLICY.NEVER;
  if (percent > MAX_IMAGE_PERCENT) return IMAGE_POLICY.ALWAYS;
  return IMAGE_POLICY.OPTIONAL;
};

/** Cuántos productos tienen stock 0 y qué porcentaje es (entero, 0 sin productos). */
export const getZeroStockCoverage = (products) => {
  const zeroStock = products.filter((product) => !(product.stock > 0)).length;
  const percent = products.length ? Math.round((zeroStock / products.length) * 100) : 0;
  return { zeroStock, total: products.length, percent };
};

/** Cuántos productos tienen precio de mayoreo y qué porcentaje es (entero, 0 sin productos). */
export const getWholesaleCoverage = (products) => {
  const withWholesale = products.filter((product) => product.apply_wholesale).length;
  const percent = products.length ? Math.round((withWholesale / products.length) * 100) : 0;
  return { withWholesale, total: products.length, percent };
};
