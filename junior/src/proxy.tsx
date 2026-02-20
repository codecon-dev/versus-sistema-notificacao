import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect' },
  { path: '/', whenAuthenticated: 'next' },
];

const proxy = (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);
  const authToken = request.cookies.get('sb-access-token');
  const refreshToken = request.cookies.get('sb-refresh-token');

  if (!authToken && !publicRoute) {
    if (refreshToken) return NextResponse.next();
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === 'redirect'
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
};

export const config: MiddlewareConfig = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo).*)'],
};

export { proxy };
