import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/getDictionary';
import { locales, type Locale } from '@/lib/i18n';
import { ContactForm } from '@/components/ContactForm';

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
    title: dictionary.meta.contact.title,
    description: dictionary.meta.contact.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/contact`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}/${locale}/contact`])
      ),
    },
    openGraph: {
      title: dictionary.meta.contact.title,
      description: dictionary.meta.contact.description,
      url: `${baseUrl}/${lang}/contact`,
      siteName: 'MicTestCam',
      type: 'website',
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {dictionary.contactPage.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {dictionary.contactPage.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <ContactForm dictionary={dictionary} />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {dictionary.contactPage.info.title}
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{dictionary.contactPage.info.email}</h3>
                    <p className="text-gray-600">support@mictestcam.com</p>
                    <p className="text-sm text-gray-500 mt-1">{dictionary.contactPage.info.response}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-sm p-8 text-white">
              <h2 className="text-xl font-semibold mb-4">
                {dictionary.contactPage.faq.title}
              </h2>
              <p className="text-indigo-100 mb-6">
                {dictionary.contactPage.faq.subtitle}
              </p>
              <Link
                href={`/${lang}#faq`}
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
              >
                {dictionary.common.learnMore}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
