import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/i18n';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Skip built-in Next.js metadata routes, API routes, admin, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/sitemap') || // /sitemap.xml and /sitemap/*
    pathname === '/robots.txt' ||
    pathname.includes('.') // static files (images, fonts, etc.)
  ) {
    return NextResponse.next();
  }

  // Detect user's preferred language from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  let detectedLocale = defaultLocale;

  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().substring(0, 2).toLowerCase());

    for (const preferredLocale of preferredLocales) {
      if (locales.includes(preferredLocale as typeof locales[number])) {
        detectedLocale = preferredLocale as typeof locales[number];
        break;
      }
    }
  }

  // Redirect to the detected locale
  return NextResponse.redirect(
    new URL(`/${detectedLocale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\.).*)'],
};
