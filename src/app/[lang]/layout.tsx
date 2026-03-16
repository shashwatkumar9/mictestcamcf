import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PrivacyBanner } from '@/components/PrivacyBanner';
import { getDictionary } from '@/lib/getDictionary';
import { locales, type Locale } from '@/lib/i18n';

const inter = Inter({ subsets: ['latin'] });

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  const baseUrl = 'https://mictestcam.com';

  return {
    title: {
      default: dictionary.meta.home.title,
      template: '%s | MicTestCam',
    },
    description: dictionary.meta.home.description,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}/${locale}`])
      ),
    },
    openGraph: {
      title: dictionary.meta.home.title,
      description: dictionary.meta.home.description,
      url: `${baseUrl}/${lang}`,
      siteName: 'MicTestCam',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.meta.home.title,
      description: dictionary.meta.home.description,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/safari-pinned-tab.svg',
          color: '#1e3a8a',
        },
      ],
    },
    manifest: '/site.webmanifest',
    themeColor: '#1e3a8a',
    applicationName: 'MicTestCam',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'MicTestCam',
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <head>
        {locales.map((locale) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={`https://mictestcam.com/${locale}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://mictestcam.com/en" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased" suppressHydrationWarning>
        <PrivacyBanner dictionary={dictionary} />
        <Header dictionary={dictionary} />
        <main>{children}</main>
        <Footer dictionary={dictionary} lang={lang} />
      </body>
    </html>
  );
}
