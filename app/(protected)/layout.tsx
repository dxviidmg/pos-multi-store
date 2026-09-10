'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';
import MainLayout from '@/src/shared/layout/MainLayout/MainLayout';
import LoadingFallback from '@/src/shared/ui/LoadingFallback';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Esperar a que se resuelva la sesión desde localStorage antes de decidir.
    if (isLoading) return;
    if (!user) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  // Mientras carga la sesión o si no hay usuario (redirigiendo), mostrar loader.
  if (isLoading || !user) {
    return <LoadingFallback />;
  }

  return (
    <MainLayout toggleTheme={() => {}} themeMode="light" onLoginSuccess={() => {}}>
      {children}
    </MainLayout>
  );
}
