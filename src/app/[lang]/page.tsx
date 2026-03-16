import Link from 'next/link';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/getDictionary';
import { locales, type Locale } from '@/lib/i18n';
import { FAQSection } from '@/components/FAQSection';
import { HomeSEOContent } from '@/components/seo/HomeSEOContent';
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
    title: dictionary.meta.home.title,
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
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'MicTestCam - Free Webcam & Microphone Test',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.meta.home.title,
      description: dictionary.meta.home.description,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://mictestcam.com/#website',
        url: 'https://mictestcam.com/',
        name: 'MicTestCam',
        description: 'Free online webcam and microphone testing tools',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://mictestcam.com/?s={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'MicTestCam - Webcam & Microphone Tester',
        operatingSystem: 'Web Browser',
        applicationCategory: 'UtilitiesApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '50000',
        },
        featureList: [
          'Webcam Testing',
          'Microphone Testing',
          'Audio Level Monitoring',
          'Video Recording',
          'Privacy Protected',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is this webcam and microphone test free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, our webcam and microphone tester is completely free with no hidden fees or subscriptions.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you store my recordings?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No, all testing happens locally in your browser. We never receive or store your recordings.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which browsers are supported?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our tool works with Chrome, Firefox, Safari, Edge, and all modern browsers.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-indigo-50 via-white to-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {dictionary.home.hero.title}
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              {dictionary.home.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${lang}/free-webcam-test`}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {dictionary.home.hero.webcamCta}
              </Link>
              <Link
                href={`/${lang}/free-microphone-test`}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:text-indigo-600 transition-all hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {dictionary.home.hero.microphoneCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{dictionary.home.trust.tests}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{dictionary.home.trust.apps}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{dictionary.home.trust.browsers}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {dictionary.home.features.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              title={dictionary.home.features.privacy.title}
              description={dictionary.home.features.privacy.description}
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title={dictionary.home.features.simple.title}
              description={dictionary.home.features.simple.description}
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              title={dictionary.home.features.professional.title}
              description={dictionary.home.features.professional.description}
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              }
              title={dictionary.home.features.universal.title}
              description={dictionary.home.features.universal.description}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {dictionary.home.howItWorks.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number={1}
              title={dictionary.home.howItWorks.step1.title}
              description={dictionary.home.howItWorks.step1.description}
            />
            <StepCard
              number={2}
              title={dictionary.home.howItWorks.step2.title}
              description={dictionary.home.howItWorks.step2.description}
            />
            <StepCard
              number={3}
              title={dictionary.home.howItWorks.step3.title}
              description={dictionary.home.howItWorks.step3.description}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection dictionary={dictionary} />

      {/* SEO Content Section */}
      <HomeSEOContent lang={lang} dictionary={dictionary} />

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {dictionary.cta.title}
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            {dictionary.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${lang}/free-webcam-test`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all"
            >
              {dictionary.cta.webcamButton}
            </Link>
            <Link
              href={`/${lang}/free-microphone-test`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/50 hover:bg-white/10 transition-all"
            >
              {dictionary.cta.microphoneButton}
            </Link>
          </div>
        </div>
      </section>

      {/* Above Footer Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <AdSlot slot={AD_SLOT_NAMES.HOME_ABOVE_FOOTER} label="Advertisement" />
      </div>
      </div>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
