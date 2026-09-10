'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';
import Login from '@/src/components/layout/Login/Login';
import LoadingFallback from '@/src/shared/ui/LoadingFallback';

export const dynamic = 'force-dynamic';

function PageContent() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const isLoggedIn = !!user;

  useEffect(() => {
    if (isLoading || !isLoggedIn) return;

    // Redirigir a la sección adecuada según el estado/rol del usuario.
    if (user?.access_blocked) {
      router.replace('/mi-plan-actual');
    } else if (user?.role === 'owner') {
      router.replace('/tiendas');
    } else {
      router.replace('/vender');
    }
  }, [isLoading, isLoggedIn, user?.role, user?.access_blocked, router]);

  // Mientras se resuelve la sesión, o si ya hay sesión (redirigiendo), mostrar loader.
  if (isLoading || isLoggedIn) {
    return <LoadingFallback />;
  }

  return <Login onLogin={() => {}} />;
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PageContent />
    </Suspense>
  );
}
