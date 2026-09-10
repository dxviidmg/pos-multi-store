'use client';

import { lazy, Suspense } from 'react';
import LoadingFallback from '@/src/components/ui/LoadingFallback';
import ErrorBoundary from '@/src/components/ui/ErrorBoundary';

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

// Lazy load components
const SaleCreate = lazyRetry(() =>
  import('@/src/components/sales/SaleCreate/SaleCreate').then((m) => ({
    default: m.default,
  }))
);
const SaleList = lazyRetry(() =>
  import('@/src/components/sales/SaleList/SaleList').then((m) => ({
    default: m.default,
  }))
);
const StoreList = lazyRetry(() =>
  import('@/src/components/admin/StoreList/StoreList').then((m) => ({
    default: m.default,
  }))
);

// Mapa de rutas → componente
export const routeComponents: Record<string, any> = {
  '/tiendas': StoreList,
  '/vender': SaleCreate,
  '/ventas': SaleList,
};

export const LazyWrapper = Lazy;
