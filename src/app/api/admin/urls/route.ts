import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthToken } from '@/lib/admin/auth';
import { getDb, blogPosts, reviews } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { locales } from '@/lib/i18n';

const BASE_URL = 'https://mictestcam.com';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyAuthToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = getDb();

    const blogs = await db
      .select({ id: blogPosts.id, slug: blogPosts.slug, language: blogPosts.language, title: blogPosts.title, publishedAt: blogPosts.publishedAt })
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'))
      .orderBy(desc(blogPosts.publishedAt));

    const reviewRows = await db
      .select({ id: reviews.id, slug: reviews.slug, language: reviews.language, heroTitle: reviews.heroTitle, productName: reviews.productName, productBrand: reviews.productBrand, publishedAt: reviews.publishedAt })
      .from(reviews)
      .where(eq(reviews.status, 'published'))
      .orderBy(desc(reviews.publishedAt));

    const allUrls: { id: string; category: string; name: string; url: string; language: string; publishedAt?: string | null }[] = [];

    locales.forEach((lang) => {
      allUrls.push({ id: `home-${lang}`, category: 'homepage', name: 'Home', url: `${BASE_URL}/${lang}`, language: lang });
      allUrls.push({ id: `webcam-test-${lang}`, category: 'tools', name: 'Webcam Test', url: `${BASE_URL}/${lang}/free-webcam-test`, language: lang });
      allUrls.push({ id: `microphone-test-${lang}`, category: 'tools', name: 'Mic Test', url: `${BASE_URL}/${lang}/free-microphone-test`, language: lang });
      allUrls.push({ id: `blog-list-${lang}`, category: 'pages', name: 'Blog', url: `${BASE_URL}/${lang}/blog`, language: lang });
      allUrls.push({ id: `review-list-${lang}`, category: 'pages', name: 'Reviews', url: `${BASE_URL}/${lang}/reviews`, language: lang });
    });

    blogs.forEach((blog) => {
      allUrls.push({ id: blog.id, category: 'blogs', name: blog.title, url: `${BASE_URL}/${blog.language}/blog/${blog.slug}`, language: blog.language, publishedAt: blog.publishedAt });
    });

    reviewRows.forEach((review) => {
      allUrls.push({ id: review.id, category: 'reviews', name: review.heroTitle || `${review.productBrand} ${review.productName}`, url: `${BASE_URL}/${review.language}/reviews/${review.slug}`, language: review.language, publishedAt: review.publishedAt });
    });

    return NextResponse.json({ urls: allUrls });
  } catch (error) {
    console.error('Failed to fetch URLs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
