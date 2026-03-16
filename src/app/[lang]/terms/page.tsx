import type { Metadata } from 'next';
import { getDictionary } from '@/lib/getDictionary';
import { locales, type Locale } from '@/lib/i18n';

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
    title: dictionary.meta.terms.title,
    description: dictionary.meta.terms.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/terms`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}/${locale}/terms`])
      ),
    },
    openGraph: {
      title: dictionary.meta.terms.title,
      description: dictionary.meta.terms.description,
      url: `${baseUrl}/${lang}/terms`,
      siteName: 'MicTestCam',
      type: 'website',
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  const sections = dictionary.termsPage.sections;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {dictionary.termsPage.title}
          </h1>
          <p className="text-gray-500">
            {dictionary.termsPage.lastUpdated}: December 2024
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-12">
            {dictionary.termsPage.intro}
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.acceptance.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.acceptance.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.description.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.description.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.usage.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.usage.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.privacy.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.privacy.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.intellectual.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.intellectual.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.disclaimer.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.disclaimer.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.limitation.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.limitation.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.changes.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.changes.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.governing.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.governing.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.contact.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.contact.content}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
