import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';
import { getPublishedBlogPosts } from '@/lib/admin/blog';
import { getAllReviews } from '@/lib/admin/reviews';

const BASE_URL = 'https://mictestcam.com';

const staticRoutes: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'];
}[] = [
  { path: '',                        priority: 1.0, changeFrequency: 'weekly'  },
  { path: '/free-webcam-test',       priority: 0.9, changeFrequency: 'weekly'  },
  { path: '/free-microphone-test',   priority: 0.9, changeFrequency: 'weekly'  },
  { path: '/blog',                   priority: 0.7, changeFrequency: 'daily'   },
  { path: '/reviews',                priority: 0.7, changeFrequency: 'weekly'  },
  { path: '/contact',                priority: 0.5, changeFrequency: 'monthly' },
  { path: '/privacy',                priority: 0.3, changeFrequency: 'yearly'  },
  { path: '/terms',                  priority: 0.3, changeFrequency: 'yearly'  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const hreflangMap = (path: string) =>
    Object.fromEntries(locales.map((l) => [l, `${BASE_URL}/${l}${path}`]));

  const entries: MetadataRoute.Sitemap = [];

  // Static pages (8 routes × 45 locales = 360 entries)
  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages: hreflangMap(route.path) },
      });
    }
  }

  // Dynamic blog posts
  try {
    const posts = await getPublishedBlogPosts();
    for (const post of posts) {
      entries.push({
        url: `${BASE_URL}/${post.language}/blog/${post.slug}`,
        lastModified: post.updatedAt ?? post.publishedAt ?? new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  } catch { /* db unavailable at build time */ }

  // Dynamic reviews
  try {
    const reviews = await getAllReviews({ status: 'published' });
    for (const review of reviews) {
      entries.push({
        url: `${BASE_URL}/${review.language}/reviews/${review.slug}`,
        lastModified: (review as { updatedAt?: Date }).updatedAt ?? new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  } catch { /* db unavailable at build time */ }

  return entries;
}
