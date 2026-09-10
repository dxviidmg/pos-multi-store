import React from 'react';
import type { Metadata } from 'next';
import { Providers } from '@/src/providers';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'SmartVenta - POS Multi-Tienda',
  description: 'Sistema de punto de venta para negocios con múltiples sucursales',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
