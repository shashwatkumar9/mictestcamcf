'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DOMPurify from 'dompurify';
import type { BlogPost } from '@/lib/admin/blog';
import type { Locale } from '@/lib/i18n';
import { ArticleTopAd, ArticleMiddleAd, ArticleBottomAd } from '@/components/ads/ArticleAds';
import { AD_SLOT_NAMES } from '@/config/ads';

interface BlogPostContentProps {
  lang: Locale;
  slug: string;
}

export function BlogPostContent({ lang, slug }: BlogPostContentProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`/api/blogs/${slug}?language=${lang}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data.post);
          // Update document title
          document.title = `${data.post.metaTitle || data.post.title} - MicTestCam`;
        }
      } catch (error) {
        console.error('Failed to load post:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug, lang]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8" />
          <div className="aspect-video bg-gray-200 rounded-2xl mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-8">
          The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
      </div>
    );
  }

  // Safely render HTML content with proper styling
  const renderContent = (content: string) => {
    // Check if content is HTML or plain text/markdown
    const isHTML = /<\/?[a-z][\s\S]*>/i.test(content);

    if (isHTML) {
      // Sanitize HTML to prevent XSS attacks (NOTE: h1 is removed to avoid duplicate H1 tags)
      const cleanHTML = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'src', 'alt', 'title'],
      });

      // Convert any H1 tags to H2 (in case they slip through) and remove nofollow
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cleanHTML;

      // Convert H1 to H2 to avoid duplicate H1 on page
      const h1Elements = tempDiv.querySelectorAll('h1');
      h1Elements.forEach((h1) => {
        const h2 = document.createElement('h2');
        h2.innerHTML = h1.innerHTML;
        h2.className = h1.className;
        h1.replaceWith(h2);
      });
      const links = tempDiv.querySelectorAll('a');
      links.forEach((link) => {
        const rel = link.getAttribute('rel');
        // If rel contains 'nofollow' but wasn't explicitly set by user, remove it
        if (rel && rel.includes('nofollow') && rel.includes('noopener')) {
          // This was auto-added by browser/editor, remove nofollow but keep noopener
          link.setAttribute('rel', rel.replace('nofollow', '').replace(/\s+/g, ' ').trim());
        }
        // If no rel attribute, links are do-follow by default
      });

      return (
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }}
        />
      );
    } else {
      // Handle markdown-style content
      return content
        .split('\n\n')
        .map((paragraph, index) => {
          // Headers (Note: # is converted to H2 to avoid duplicate H1 on page)
          if (paragraph.startsWith('# ')) {
            return (
              <h2 key={index} className="text-3xl font-bold text-gray-900 mb-4 mt-8">
                {paragraph.slice(2)}
              </h2>
            );
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={index} className="text-2xl font-bold text-gray-900 mb-3 mt-6">
                {paragraph.slice(3)}
              </h2>
            );
          }
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={index} className="text-xl font-bold text-gray-900 mb-2 mt-4">
                {paragraph.slice(4)}
              </h3>
            );
          }

          // List items
          if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
            const items = paragraph.split('\n').filter(line => line.startsWith('- ') || line.startsWith('* '));
            return (
              <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-gray-600">
                {items.map((item, i) => (
                  <li key={i}>{item.slice(2)}</li>
                ))}
              </ul>
            );
          }

          // Regular paragraph
          return (
            <p key={index} className="text-gray-600 leading-relaxed mb-4">
              {paragraph}
            </p>
          );
        });
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href={`/${lang}`} className="hover:text-indigo-600 transition">
          Home
        </Link>
        <span>/</span>
        <Link href={`/${lang}/blog`} className="hover:text-indigo-600 transition">
          Blog
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate">{post.title}</span>
      </nav>

      {/* Top Ad */}
      <ArticleTopAd slot={AD_SLOT_NAMES.BLOG_TOP_SECTION} />

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time dateTime={new Date(post.publishedAt || post.createdAt).toISOString()}>
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString(lang, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{Math.ceil(post.content.split(/\s+/).length / 200)} min read</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <figure className="mb-10">
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            className="w-full aspect-video object-cover rounded-2xl"
          />
          {post.featuredImageAlt && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {post.featuredImageAlt}
            </figcaption>
          )}
        </figure>
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <div className="bg-gray-50 border-l-4 border-indigo-500 p-6 rounded-r-xl mb-8">
          <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
        </div>
      )}

      {/* Middle Ad */}
      <ArticleMiddleAd slot={AD_SLOT_NAMES.BLOG_MIDDLE_SECTION} />

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {renderContent(post.content)}
      </div>

      {/* Bottom Ad */}
      <ArticleBottomAd slot={AD_SLOT_NAMES.BLOG_BOTTOM_SECTION} />

      {/* Styles for HTML content */}
      <style jsx>{`
        :global(.blog-content h1) {
          font-size: 2rem;
          font-weight: bold;
          color: #111827;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.25;
        }

        :global(.blog-content h2) {
          font-size: 1.5rem;
          font-weight: bold;
          color: #111827;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.35;
        }

        :global(.blog-content h3) {
          font-size: 1.25rem;
          font-weight: bold;
          color: #111827;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        :global(.blog-content p) {
          color: #4b5563;
          margin-bottom: 1rem;
          line-height: 1.75;
        }

        :global(.blog-content strong) {
          font-weight: 700;
          color: #111827;
        }

        :global(.blog-content em) {
          font-style: italic;
        }

        :global(.blog-content a) {
          color: #4f46e5;
          text-decoration: underline;
        }

        :global(.blog-content a:hover) {
          color: #4338ca;
        }

        :global(.blog-content ul) {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          color: #4b5563;
        }

        :global(.blog-content ol) {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          color: #4b5563;
        }

        :global(.blog-content li) {
          margin-bottom: 0.5rem;
          line-height: 1.75;
        }

        :global(.blog-content blockquote) {
          border-left: 4px solid #6366f1;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #6b7280;
          font-style: italic;
        }

        :global(.blog-content hr) {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2rem 0;
        }

        :global(.blog-content code) {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
        }

        :global(.blog-content pre) {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin-bottom: 1rem;
        }

        :global(.blog-content pre code) {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }

        :global(.blog-content img) {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
      `}</style>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>

          {/* Share buttons */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">Share:</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
              title="Copy link"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
              title="Share on Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.metaDescription || post.excerpt,
            image: post.featuredImage,
            author: {
              '@type': 'Person',
              name: post.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'MicTestCam',
              logo: {
                '@type': 'ImageObject',
                url: 'https://mictestcam.com/logo.png',
              },
            },
            datePublished: post.publishedAt || post.createdAt,
            dateModified: post.updatedAt,
          }),
        }}
      />
    </article>
  );
}
