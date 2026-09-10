import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtener el usuario del localStorage desde la cookie o header
  // En Next.js, el middleware en el servidor no puede acceder a localStorage del cliente
  // Por lo que usamos cookies como alternativa
  
  const user = request.cookies.get('user');
  const pathname = request.nextUrl.pathname;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/registrarme', '/'];

  // Si no hay usuario y está intentando acceder a ruta protegida, redirigir a login
  if (!user && !publicRoutes.includes(pathname) && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Nota: si hay usuario en '/', dejamos que la propia página decida a dónde
  // redirigir según el rol (owner -> /tiendas, vendedor -> /vender, etc.).
  // No forzamos la redirección aquí para no sobreescribir esa lógica.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
