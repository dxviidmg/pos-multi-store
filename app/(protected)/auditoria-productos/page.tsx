'use client';

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
  import('@/src/components/admin/ProductAudit/ProductAudit').then((m) => ({
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
