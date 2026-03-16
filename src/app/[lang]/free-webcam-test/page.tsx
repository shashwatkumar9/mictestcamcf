import type { Metadata } from 'next';
import { getDictionary } from '@/lib/getDictionary';
import { locales, type Locale } from '@/lib/i18n';
import { WebcamTester } from '@/components/WebcamTester/WebcamTester';
import { WebcamSEOContent } from '@/components/seo/WebcamSEOContent';
import { AdSlot } from '@/components/ads/AdSlot';
import { AD_SLOT_NAMES } from '@/config/ads';

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
    title: dictionary.meta.webcam.title,
    description: dictionary.meta.webcam.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/free-webcam-test`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}/${locale}/free-webcam-test`])
      ),
    },
    openGraph: {
      title: dictionary.meta.webcam.title,
      description: dictionary.meta.webcam.description,
      url: `${baseUrl}/${lang}/free-webcam-test`,
      siteName: 'MicTestCam',
      type: 'website',
    },
  };
}

export default async function WebcamTestPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `https://mictestcam.com/${lang}/free-webcam-test/#webapp`,
    name: 'Webcam Test Tool',
    description: 'Free webcam test tool - instantly check if your camera is working. Test webcam with live preview, filters, quality settings & recording.',
    url: `https://mictestcam.com/${lang}/free-webcam-test`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Live webcam preview',
      'Video recording up to 8K resolution',
      'Multiple camera support',
      'Side-by-side camera comparison mode',
      '9+ video filters and effects',
      'Quality settings (240p to 8K)',
      'Mirror mode for selfies',
      'Digital zoom (1x-3x)',
      'Brightness & contrast controls',
      'Grid overlay (Rule of Thirds)',
      'Real-time motion detection',
      'Face detection and tracking',
      'Real-time video metrics & histogram',
      'Snapshot capture',
      'Local storage',
      'Background blur',
      'Advanced camera controls',
    ],
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Test Your Webcam',
    description: 'Test your webcam online in 3 easy steps',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Click Test Camera',
        text: 'Click the "Test Camera" button to begin testing your webcam.',
      },
      {
        '@type': 'HowToStep',
        name: 'Grant Permission',
        text: 'Allow your browser to access your camera when prompted.',
      },
      {
        '@type': 'HowToStep',
        name: 'View, Test, and Record',
        text: 'See your live video feed, apply filters, adjust settings. Click "Record" button to start recording clips whenever you need.',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {dictionary.webcam.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {dictionary.webcam.subtitle}
            </p>
          </div>

          <WebcamTester dictionary={dictionary} />

          {/* Below Tool Ad */}
          <div className="my-12">
            <AdSlot slot={AD_SLOT_NAMES.WEBCAM_BELOW_TOOL} label="Advertisement" />
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <WebcamSEOContent lang={lang} dictionary={dictionary} />

      {/* Above Footer Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <AdSlot slot={AD_SLOT_NAMES.WEBCAM_ABOVE_FOOTER} label="Advertisement" />
      </div>
    </>
  );
}
