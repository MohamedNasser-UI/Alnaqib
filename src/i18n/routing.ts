import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/about': '/about',
    '/contact': '/contact',
    '/refund-policy': '/refund-policy',
    '/privacy-policy': '/privacy-policy',
    '/cart': '/cart',
    '/checkout': '/checkout',
    '/order/success': '/order/success',
    '/order/cancel': '/order/cancel',
  },
});
