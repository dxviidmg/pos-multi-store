#!/usr/bin/env node

const fs = require('fs');
const pathModule = require('path');

// Mapeo de rutas a componentes
const routes = [
  { path: '/tiendas', component: 'StoreList', componentPath: 'features/admin/components/StoreList/StoreList' },
  { path: '/vender', component: 'SaleCreate', componentPath: 'features/sales/components/SaleCreate/SaleCreate' },
  { path: '/distribuir', component: 'SaleCreate', componentPath: 'features/sales/components/SaleCreate/SaleCreate' },
  { path: '/ventas', component: 'SaleList', componentPath: 'features/sales/components/SaleList/SaleList' },
  { path: '/apartados', component: 'ReservationList', componentPath: 'features/sales/components/ReservationList/ReservationList' },
  { path: '/importar-ventas', component: 'SaleImport', componentPath: 'features/sales/components/SaleImport/SaleImport' },
  { path: '/corte-caja', component: 'CashSummary', componentPath: 'features/sales/components/CashSummary/CashSummary' },
  { path: '/movimientos-caja', component: 'CashFlowList', componentPath: 'features/cashflow/components/CashFlowList/CashFlowList' },
  { path: '/distribuciones', component: 'DistributionList', componentPath: 'features/inventory/components/DistributionList/DistributionList' },
  { path: '/conversiones', component: 'ConversionList', componentPath: 'features/inventory/components/ConversionList/ConversionList' },
  { path: '/traspasos', component: 'TransferList', componentPath: 'features/inventory/components/TransferList/TransferList' },
  { path: '/solicitudes-ajustes-stock', component: 'StockUpdateRequestList', componentPath: 'features/inventory/components/StockUpdateRequestList/StockUpdateRequestList' },
  { path: '/historial-precios', component: 'PriceLogsList', componentPath: 'features/products/components/PriceLogsList/PriceLogsList' },
  { path: '/clientes', component: 'ClientList', componentPath: 'features/clients/components/ClientList/ClientList' },
  { path: '/productos', component: 'ProductList', componentPath: 'features/products/components/ProductList/ProductList' },
  { path: '/inventario', component: 'StoreProductList', componentPath: 'features/products/components/StoreProductList/StoreProductList' },
  { path: '/auditoria-inventario', component: 'ProductAuditList', componentPath: 'features/products/components/StoreProductAuditList/StoreProductAuditList' },
  { path: '/marcas', component: 'BrandList', componentPath: 'features/catalog/components/BrandList/BrandList' },
  { path: '/departamentos', component: 'DepartmentList', componentPath: 'features/catalog/components/DepartmentList/DepartmentList' },
  { path: '/historial-stock', component: 'LogList', componentPath: 'features/admin/components/LogList/LogList' },
  { path: '/pagos', component: 'TenantPaymentList', componentPath: 'features/tenant/components/TenantPaymentList/TenantPaymentList' },
  { path: '/suscripciones', component: 'SubscriptionList', componentPath: 'features/tenant/components/SubscriptionList/SubscriptionList' },
  { path: '/mi-plan-actual', component: 'MyCurrentPlan', componentPath: 'features/tenant/components/MyCurrentPlan/MyCurrentPlan' },
  { path: '/vendedores', component: 'SellerList', componentPath: 'features/catalog/components/SellerList/SellerList' },
  { path: '/servicios', component: 'ServiceList', componentPath: 'features/admin/components/ServiceList/ServiceList' },
  { path: '/tablero-ventas', component: 'Dashboard', componentPath: 'features/admin/components/Dashboard/Dashboard' },
  { path: '/tablero-ventas-ajustadas-cancelaciones', component: 'CancellationsDashboard', componentPath: 'features/admin/components/Dashboard/CancellationsDashboard' },
  { path: '/tablero-verificacion-stock', component: 'StockVerificationDashboard', componentPath: 'features/admin/components/Dashboard/StockVerificationDashboard' },
  { path: '/tablero-traspasos-pendientes', component: 'PendingTransfersDashboard', componentPath: 'features/admin/components/Dashboard/PendingTransfersDashboard' },
  { path: '/tablero-productos', component: 'ProductsDashboard', componentPath: 'features/admin/components/Dashboard/ProductsDashboard' },
  { path: '/reasignacion', component: 'ProductReassign', componentPath: 'features/products/components/ProductReassign/ProductReassign' },
  { path: '/importar-productos', component: 'ProductImport', componentPath: 'features/products/components/ProductImport/ProductImport' },
  { path: '/importar-inventario', component: 'StoreProductImport', componentPath: 'features/products/components/StoreProductImport/StoreProductImport' },
  { path: '/auditoria-transacciones', component: 'TransactionAudit', componentPath: 'features/admin/components/TransactionAudit/TransactionAudit' },
  { path: '/auditoria-productos', component: 'ProductAudit', componentPath: 'features/admin/components/ProductAudit/ProductAudit' },
  { path: '/sincronizar', component: 'RestartService', componentPath: 'features/admin/components/RestartService/RestartService' },
  { path: '/perfil', component: 'Profile', componentPath: 'features/admin/components/Profile/Profile' },
  { path: '/registrarme', component: 'Registration', componentPath: 'features/tenant/components/Registration/Registration', isPublic: true },
];

// Generar páginas
routes.forEach(({ path, component, componentPath, isPublic }) => {
  const baseDir = isPublic ? 'app' : 'app/(protected)';
  const pathParts = path.split('/').filter(Boolean);
  const routePath = pathParts.join('/');
  const fullPath = pathModule.join(baseDir, routePath, 'page.tsx');
  const pageDir = pathModule.dirname(fullPath);

  // Crear directorio si no existe
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  const template = `'use client';

import ${component} from '@/src/${componentPath}';

export default function Page() {
  return <${component} />;
}
`;

  fs.writeFileSync(fullPath, template);
  console.log(`✓ Generado: ${fullPath}`);
});

console.log(`\n✓ Se generaron ${routes.length} rutas`);
