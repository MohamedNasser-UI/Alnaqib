import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Exclude static files so Next.js can serve public/images, etc.
  matcher: ['/', '/(ar|en)/:path*', '/((?!_next|_vercel|api|assets|images).*)'],
};
