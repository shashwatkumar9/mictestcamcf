'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPublishedBlogPosts, type BlogPost } from '@/lib/admin/blog';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/getDictionary';

interface ReviewListProps {
  lang: Locale;
  dictionary: Dictionary;
}

function ReviewCard({ post, lang, dictionary }: { post: BlogPost; lang: string; dictionary: Dictionary }) {
  return (
    <article className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition group">
      {post.featuredImage ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <time dateTime={new Date(post.publishedAt || post.createdAt).toISOString()}>
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString(lang, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {post.author && (
            <>
              <span>·</span>
              <span>{dictionary.reviewsPage.by} {post.author}</span>
            </>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition">
          <Link href={`/${lang}/reviews/${post.slug}`}>
            {post.title}
          </Link>
        </h2>
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}
        <Link
          href={`/${lang}/reviews/${post.slug}`}
          className="inline-flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition"
        >
          {dictionary.reviewsPage.readMore}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

export function ReviewList({ lang, dictionary }: ReviewListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        // Use keyword filter to show only review-related posts
        // To show ALL posts instead, remove &filter=keyword
        const response = await fetch(`/api/reviews?language=${lang}&filter=keyword`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || data.reviews || []);
        }
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, [lang]);

  if (loading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-200" />
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{dictionary.reviewsPage.noReviews}</h2>
        <p className="text-gray-600">{dictionary.reviewsPage.noReviewsDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <ReviewCard key={post.id} post={post} lang={lang} dictionary={dictionary} />
      ))}
    </div>
  );
}
