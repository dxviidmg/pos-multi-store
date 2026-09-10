#!/usr/bin/env node

const fs = require('fs');
const pathModule = require('path');

// Mapeo de rutas a componentes
const routes = [
  { path: '/tiendas', component: 'StoreList', componentPath: 'admin/StoreList/StoreList' },
  { path: '/vender', component: 'SaleCreate', componentPath: 'sales/SaleCreate/SaleCreate' },
  { path: '/distribuir', component: 'SaleCreate', componentPath: 'sales/SaleCreate/SaleCreate' },
  { path: '/ventas', component: 'SaleList', componentPath: 'sales/SaleList/SaleList' },
  { path: '/apartados', component: 'ReservationList', componentPath: 'sales/ReservationList/ReservationList' },
  { path: '/importar-ventas', component: 'SaleImport', componentPath: 'sales/SaleImport/SaleImport' },
  { path: '/corte-caja', component: 'CashSummary', componentPath: 'sales/CashSummary/CashSummary' },
  { path: '/movimientos-caja', component: 'CashFlowList', componentPath: 'cashflow/CashFlowList/CashFlowList' },
  { path: '/distribuciones', component: 'DistributionList', componentPath: 'inventory/DistributionList/DistributionList' },
  { path: '/conversiones', component: 'ConversionList', componentPath: 'inventory/ConversionList/ConversionList' },
  { path: '/traspasos', component: 'TransferList', componentPath: 'inventory/TransferList/TransferList' },
  { path: '/solicitudes-ajustes-stock', component: 'StockUpdateRequestList', componentPath: 'inventory/StockUpdateRequestList/StockUpdateRequestList' },
  { path: '/historial-precios', component: 'PriceLogsList', componentPath: 'products/PriceLogsList/PriceLogsList' },
  { path: '/clientes', component: 'ClientList', componentPath: 'clients/ClientList/ClientList' },
  { path: '/productos', component: 'ProductList', componentPath: 'products/ProductList/ProductList' },
  { path: '/inventario', component: 'StoreProductList', componentPath: 'products/StoreProductList/StoreProductList' },
  { path: '/auditoria-inventario', component: 'ProductAuditList', componentPath: 'products/StoreProductAuditList/StoreProductAuditList' },
  { path: '/marcas', component: 'BrandList', componentPath: 'catalog/BrandList/BrandList' },
  { path: '/departamentos', component: 'DepartmentList', componentPath: 'catalog/DepartmentList/DepartmentList' },
  { path: '/historial-stock', component: 'LogList', componentPath: 'admin/LogList/LogList' },
  { path: '/pagos', component: 'TenantPaymentList', componentPath: 'tenant/TenantPaymentList/TenantPaymentList' },
  { path: '/suscripciones', component: 'SubscriptionList', componentPath: 'tenant/SubscriptionList/SubscriptionList' },
  { path: '/mi-plan-actual', component: 'MyCurrentPlan', componentPath: 'tenant/MyCurrentPlan/MyCurrentPlan' },
  { path: '/vendedores', component: 'SellerList', componentPath: 'catalog/SellerList/SellerList' },
  { path: '/servicios', component: 'ServiceList', componentPath: 'admin/ServiceList/ServiceList' },
  { path: '/tablero-ventas', component: 'Dashboard', componentPath: 'admin/Dashboard/Dashboard' },
  { path: '/tablero-ventas-ajustadas-cancelaciones', component: 'CancellationsDashboard', componentPath: 'admin/Dashboard/CancellationsDashboard' },
  { path: '/tablero-verificacion-stock', component: 'StockVerificationDashboard', componentPath: 'admin/Dashboard/StockVerificationDashboard' },
  { path: '/tablero-traspasos-pendientes', component: 'PendingTransfersDashboard', componentPath: 'admin/Dashboard/PendingTransfersDashboard' },
  { path: '/tablero-productos', component: 'ProductsDashboard', componentPath: 'admin/Dashboard/ProductsDashboard' },
  { path: '/reasignacion', component: 'ProductReassign', componentPath: 'products/ProductReassign/ProductReassign' },
  { path: '/importar-productos', component: 'ProductImport', componentPath: 'products/ProductImport/ProductImport' },
  { path: '/importar-inventario', component: 'StoreProductImport', componentPath: 'products/StoreProductImport/StoreProductImport' },
  { path: '/auditoria-transacciones', component: 'TransactionAudit', componentPath: 'admin/TransactionAudit/TransactionAudit' },
  { path: '/auditoria-productos', component: 'ProductAudit', componentPath: 'admin/ProductAudit/ProductAudit' },
  { path: '/sincronizar', component: 'RestartService', componentPath: 'admin/RestartService/RestartService' },
  { path: '/perfil', component: 'Profile', componentPath: 'admin/Profile/Profile' },
  { path: '/registrarme', component: 'Registration', componentPath: 'tenant/Registration/Registration', isPublic: true },
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

import { lazy, Suspense } from 'react';
import LoadingFallback from '@/src/components/ui/LoadingFallback';
import ErrorBoundary from '@/src/components/ui/ErrorBoundary';

export const dynamic = 'force-dynamic';

const lazyRetry = (importFn: () => Promise<any>) =>
  lazy(() =>
    importFn().catch(() => {
      window.location.reload();
      return new Promise(() => {});
    })
  );

const Lazy = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
  </ErrorBoundary>
);

const Component = lazyRetry(() =>
  import('@/src/components/${componentPath}').then((m) => ({
    default: m.default,
  }))
);

export default function Page() {
  return (
    <Lazy>
      <Component />
    </Lazy>
  );
}
`;

  fs.writeFileSync(fullPath, template);
  console.log(`✓ Generado: ${fullPath}`);
});

console.log(`\n✓ Se generaron ${routes.length} rutas`);
