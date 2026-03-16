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
    title: dictionary.meta.privacy.title,
    description: dictionary.meta.privacy.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/privacy`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${baseUrl}/${locale}/privacy`])
      ),
    },
    openGraph: {
      title: dictionary.meta.privacy.title,
      description: dictionary.meta.privacy.description,
      url: `${baseUrl}/${lang}/privacy`,
      siteName: 'MicTestCam',
      type: 'website',
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  const sections = dictionary.privacyPage.sections;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {dictionary.privacyPage.title}
          </h1>
          <p className="text-gray-500">
            {dictionary.privacyPage.lastUpdated}: December 2024
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-12">
            {dictionary.privacyPage.intro}
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.noCollection.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.noCollection.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.localStorage.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.localStorage.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.cookies.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.cookies.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.thirdParty.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.thirdParty.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.security.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.security.content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {sections.children.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {sections.children.content}
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
