// Feature: products — API pública (componentes)

export { default as ProductList } from './components/ProductList/ProductList';
export { default as ProductModal } from './components/ProductModal/ProductModal';
export { default as ProductImport } from './components/ProductImport/ProductImport';
export { default as ProductReassign } from './components/ProductReassign/ProductReassign';
export { default as ProductCarousel } from './components/ProductCarousel/ProductCarousel';
export { default as ProductCard } from './components/ProductCarousel/ProductCard';
export { default as SearchProduct } from './components/SearchProduct/SearchProduct';
export { default as StoreProductList } from './components/StoreProductList/StoreProductList';
export { default as StoreProductAuditList } from './components/StoreProductAuditList/StoreProductAuditList';
export { default as StoreProductImport } from './components/StoreProductImport/StoreProductImport';
export { default as StoreProductLogsModal } from './components/StoreProductLogsModal/StoreProductLogsModal';
export { default as PriceLogsList } from './components/PriceLogsList/PriceLogsList';
export { default as PriceLogsModal } from './components/PriceLogsModal/PriceLogsModal';
export { default as PriceUpdateModal } from './components/PriceUpdateModal/PriceUpdateModal';

// Hooks
export { useProducts } from './hooks/useProducts';
export { useCreateProduct, useUpdateProduct } from './hooks/useProductMutations';
export * from './hooks/useProductSearch';

// API
export * from './api/products';

