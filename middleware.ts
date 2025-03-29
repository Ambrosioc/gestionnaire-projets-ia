// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const PUBLIC_ROUTES = ['/', '/login', '/register'];

// export async function middleware(request: NextRequest) {
//   const res = NextResponse.next();
//   const supabase = createMiddlewareClient({ req: request, res });
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   const isPublicRoute = PUBLIC_ROUTES.includes(request.nextUrl.pathname);
//   const isAuthRoute = ['/login', '/register'].includes(request.nextUrl.pathname);

//   if (!session && !isPublicRoute) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   if (session && isAuthRoute) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   return res;
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };