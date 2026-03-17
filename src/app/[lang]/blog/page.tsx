export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { type Locale, locales } from '@/lib/i18n';
import { getDictionary } from '@/lib/getDictionary';
import { BlogList } from '@/components/blog/BlogList';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.meta.blog.title,
    description: dictionary.meta.blog.description,
    alternates: {
      canonical: `https://mictestcam.com/${lang}/blog`,
      languages: locales.reduce((acc, locale) => {
        acc[locale] = `https://mictestcam.com/${locale}/blog`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{dictionary.blogPage.title}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {dictionary.blogPage.subtitle}
        </p>
      </div>

      <BlogList lang={locale} dictionary={dictionary} />
    </div>
  );
}
