export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/backtest', '/backtest/:path*', '/strategy/:path*'],
};
