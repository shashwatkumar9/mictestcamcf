export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { type Locale, locales } from '@/lib/i18n';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { getBlogPostBySlug } from '@/lib/admin/blog';

interface BlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  // Generate params for all locales (slugs will be dynamic)
  return locales.map((lang) => ({ lang, slug: '' }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  try {
    const post = await getBlogPostBySlug(slug, lang as Locale);

    if (!post) {
      return {
        title: 'Blog Post Not Found - MicTestCam',
      };
    }

    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      keywords: post.focusKeyword,
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        images: post.featuredImage ? [{ url: post.featuredImage, alt: post.featuredImageAlt || post.title }] : [],
        type: 'article',
        locale: lang,
      },
      alternates: {
        canonical: `https://mictestcam.com/${lang}/blog/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Blog Post - MicTestCam',
      description: 'Read our blog article on MicTestCam',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;
  const locale = lang as Locale;

  return <BlogPostContent lang={locale} slug={slug} />;
}
