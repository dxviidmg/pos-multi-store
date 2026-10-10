/**
 * Archivo de re-exportación para backward compatibility.
 * Las implementaciones están en:
 * - store-products.js — Funciones de punto de venta
 * - catalog-products.js — Funciones de catálogo/admin
 * - products-common.js — Funciones compartidas
 * 
 * Importado desde: components, hooks
 */

// Store products
export {
  getStoreProducts,
  getStoreProductSuggestions,
  updateStoreProduct,
  getStoreProductLogs,
  getStoreProductLogsChoices,
  importStoreProductsValidation,
  importStoreProducts,
  getImportCanIncludeQuantity,
} from './store-products';

// Catalog products
export {
  getProducts,
  createProduct,
  updateProduct,
  addProducts,
  importProductsValidation,
  importProducts,
  deleteProducts,
  updatePricesProducts,
  upperCodeProducts,
  reassignProducts,
} from './catalog-products';

// Common products
export {
  getTaskResult,
  getStockOtherStores,
  getProductPriceLogs,
  getCreateProductsOnSale,
} from './products-common';
