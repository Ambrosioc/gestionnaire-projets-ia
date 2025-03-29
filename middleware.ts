import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const PUBLIC_ROUTES = ['/', '/login', '/register'];

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  const handleI18n = intlMiddleware(request);
  
  // Si la route est une ressource statique ou une API, on laisse passer
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api')
  ) {
    return handleI18n;
  }

  // Redirection vers la locale par défaut si aucune n'est spécifiée
  if (!request.nextUrl.pathname.startsWith('/fr') && !request.nextUrl.pathname.startsWith('/en')) {
    const locale = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'fr';
    return NextResponse.redirect(
      new URL(`/${locale}${request.nextUrl.pathname}`, request.url)
    );
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isPublicRoute = PUBLIC_ROUTES.includes(request.nextUrl.pathname.replace(/^\/[a-z]{2}/, ''));
  const isAuthRoute = ['/login', '/register'].includes(request.nextUrl.pathname.replace(/^\/[a-z]{2}/, ''));

  if (!session && !isPublicRoute) {
    const locale = request.nextUrl.pathname.split('/')[1];
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (session && isAuthRoute) {
    const locale = request.nextUrl.pathname.split('/')[1];
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return handleI18n;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};