'use client';

import { lazy, Suspense } from 'react';
import LoadingFallback from '@/src/shared/ui/LoadingFallback';
import ErrorBoundary from '@/src/shared/ui/ErrorBoundary';

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
  import('@/src/components/tenant/MyCurrentPlan/MyCurrentPlan').then((m) => ({
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
