import type { Metadata } from 'next';
import { getDictionary } from '@/lib/getDictionary';
import { locales, type Locale } from '@/lib/i18n';
import { MicrophoneTester } from '@/components/MicrophoneTester/MicrophoneTester';
import { MicrophoneSEOContent } from '@/components/seo/MicrophoneSEOContent';
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
    title: dictionary.meta.microphone.title,
    description: dictionary.meta.microphone.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/free-microphone-test`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}/${locale}/free-microphone-test`])
      ),
    },
    openGraph: {
      title: dictionary.meta.microphone.title,
      description: dictionary.meta.microphone.description,
      url: `${baseUrl}/${lang}/free-microphone-test`,
      siteName: 'MicTestCam',
      type: 'website',
    },
  };
}

export default async function MicrophoneTestPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `https://mictestcam.com/${lang}/free-microphone-test/#webapp`,
    name: 'Microphone Test Tool',
    description: 'Free online mic test - check if your microphone is working. Test audio levels, frequency response, and recording quality.',
    url: `https://mictestcam.com/${lang}/free-microphone-test`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Real-time audio levels',
      'Frequency spectrum analysis',
      'Multiple sample rates (44.1kHz, 48kHz)',
      'Separated test and record workflow',
      'Input gain control (50-150%)',
      'Noise suppression',
      'Echo cancellation',
      'Auto gain control',
      'Side-by-side microphone comparison',
      'Real-time noise floor monitoring',
      'Signal-to-noise ratio display',
      'Dynamic range measurement',
      'Audio playback and storage',
    ],
  };

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Test Your Microphone',
    description: 'Test your microphone online in easy steps',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Select Your Microphone',
        text: 'Choose your microphone from the dropdown and configure sample rate settings.',
      },
      {
        '@type': 'HowToStep',
        name: 'Configure Pre-Settings',
        text: 'Set input gain, enable noise suppression, echo cancellation, and other audio processing options before starting.',
      },
      {
        '@type': 'HowToStep',
        name: 'Click Test Microphone',
        text: 'Click the "Test Microphone" button to begin monitoring your audio levels.',
      },
      {
        '@type': 'HowToStep',
        name: 'Grant Permission',
        text: 'Allow your browser to access your microphone when prompted.',
      },
      {
        '@type': 'HowToStep',
        name: 'Monitor and Fine-Tune',
        text: 'Watch the audio levels and frequency spectrum. Use fine-tune controls to adjust input gain while testing.',
      },
      {
        '@type': 'HowToStep',
        name: 'Record When Ready',
        text: 'Click "Record" button to start recording audio clips whenever you need.',
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
              {dictionary.microphone.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {dictionary.microphone.subtitle}
            </p>
          </div>

          <MicrophoneTester dictionary={dictionary} />

          {/* Below Tool Ad */}
          <div className="my-12">
            <AdSlot slot={AD_SLOT_NAMES.MICROPHONE_BELOW_TOOL} label="Advertisement" />
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <MicrophoneSEOContent lang={lang} dictionary={dictionary} />

      {/* Above Footer Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <AdSlot slot={AD_SLOT_NAMES.MICROPHONE_ABOVE_FOOTER} label="Advertisement" />
      </div>
    </>
  );
}
