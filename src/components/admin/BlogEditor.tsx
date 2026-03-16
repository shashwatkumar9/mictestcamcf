'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  type BlogPost,
  generateSlug,
  isSlugUnique,
  calculateSEOScore,
  type SEOScore,
} from '@/lib/admin/blog';
import { locales, localeNames, type Locale } from '@/lib/i18n';
import { SEOScoreIndicator, OverallSEOScore } from './SEOScoreIndicator';

// Dynamically import RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('./RichTextEditor').then(mod => mod.RichTextEditor), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 min-h-[500px] animate-pulse">
      <div className="h-10 bg-gray-700 rounded mb-4" />
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-700 rounded w-1/2" />
    </div>
  ),
});

interface BlogEditorProps {
  post?: BlogPost;
  isNew?: boolean;
}

export function BlogEditor({ post, isNew = false }: BlogEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [seoScore, setSeoScore] = useState<SEOScore | null>(null);

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    language: (post?.language || 'en') as Locale,
    status: post?.status || 'draft',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    featuredImage: post?.featuredImage || '',
    featuredImageAlt: post?.featuredImageAlt || '',
    metaTitle: post?.metaTitle || '',
    metaDescription: post?.metaDescription || '',
    focusKeyword: post?.focusKeyword || '',
    author: post?.author || 'MicTestCam Team',
    publishedAt: post?.publishedAt || null,
  });

  // Calculate SEO score whenever form data changes
  useEffect(() => {
    const score = calculateSEOScore(formData);
    setSeoScore(score);
  }, [formData]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited && formData.title) {
      const newSlug = generateSlug(formData.title);
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title, slugEdited]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'slug') {
      setSlugEdited(true);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, featuredImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSave = async (publish: boolean = false) => {
    setSaving(true);

    try {
      // Validate slug uniqueness
      if (!isSlugUnique(formData.slug, formData.language, post?.id)) {
        alert('This slug is already in use for this language. Please choose a different one.');
        setSaving(false);
        return;
      }

      const status = publish ? 'published' : formData.status;
      const publishedAt = publish && !formData.publishedAt
        ? new Date()
        : formData.publishedAt
          ? (typeof formData.publishedAt === 'string' ? new Date(formData.publishedAt) : formData.publishedAt)
          : null;

      const postData = {
        ...formData,
        status: status as 'draft' | 'published',
        publishedAt,
      };

      if (isNew) {
        const response = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create blog post');
        }
      } else if (post) {
        const response = await fetch(`/api/admin/blogs/${post.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update blog post');
        }
      }

      router.push('/admin/blogs');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Main Editor */}
      <div className="xl:col-span-2 space-y-6">
        {/* Title */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Post Title
            <span className="text-gray-500 ml-2">({formData.title.length} characters)</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your blog post title..."
          />
        </div>

        {/* Slug and Language */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL Slug
                <span className="text-gray-500 ml-2">(auto-generated, editable)</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">/{formData.language}/blog/</span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="your-post-slug"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {locales.map((locale) => (
                  <option key={locale} value={locale}>
                    {localeNames[locale]} ({locale.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Content
            <span className="text-gray-500 ml-2">
              ({formData.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words)
            </span>
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
            placeholder="Start writing your blog post content here..."
          />
          <p className="text-xs text-gray-500 mt-2">
            Tip: Use the toolbar above for rich formatting. Aim for at least 300 words, 1000+ words is excellent for SEO.
          </p>
        </div>

        {/* Excerpt */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Excerpt / Summary
            <span className="text-gray-500 ml-2">({formData.excerpt.length} characters)</span>
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="A brief summary of your blog post..."
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Actions */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Publish</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Status:</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="px-3 py-1.5 bg-gray-900/50 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Author:</span>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="px-3 py-1.5 bg-gray-900/50 border border-gray-600 rounded text-white w-40 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {/* SEO Score */}
        {seoScore && <OverallSEOScore score={seoScore.overall} />}

        {/* Featured Image */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Featured Image</h3>
          {formData.featuredImage ? (
            <div className="relative mb-4">
              <img
                src={formData.featuredImage}
                alt={formData.featuredImageAlt || 'Featured image'}
                className="w-full aspect-video object-cover rounded-lg"
              />
              <button
                onClick={() => setFormData((prev) => ({ ...prev, featuredImage: '' }))}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full aspect-video bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-indigo-500 transition mb-4">
              <svg className="w-10 h-10 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-400">Click to upload image</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image Alt Text
            </label>
            <input
              type="text"
              name="featuredImageAlt"
              value={formData.featuredImageAlt}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the image for SEO..."
            />
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Focus Keyword
              </label>
              <input
                type="text"
                name="focusKeyword"
                value={formData.focusKeyword}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., webcam test"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meta Title
                <span className="text-gray-500 ml-2">({formData.metaTitle.length}/60)</span>
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="SEO title (30-60 characters)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meta Description
                <span className="text-gray-500 ml-2">({formData.metaDescription.length}/160)</span>
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="SEO description (120-160 characters)"
              />
            </div>
          </div>
        </div>

        {/* SEO Analysis */}
        {seoScore && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">SEO Analysis</h3>
            <div className="space-y-3">
              <SEOScoreIndicator
                label="Title"
                score={seoScore.title.score}
                message={seoScore.title.message}
              />
              <SEOScoreIndicator
                label="Meta Title"
                score={seoScore.metaTitle.score}
                message={seoScore.metaTitle.message}
              />
              <SEOScoreIndicator
                label="Meta Description"
                score={seoScore.metaDescription.score}
                message={seoScore.metaDescription.message}
              />
              <SEOScoreIndicator
                label="Content"
                score={seoScore.content.score}
                message={seoScore.content.message}
              />
              <SEOScoreIndicator
                label="Focus Keyword"
                score={seoScore.focusKeyword.score}
                message={seoScore.focusKeyword.message}
              />
              <SEOScoreIndicator
                label="Featured Image"
                score={seoScore.featuredImage.score}
                message={seoScore.featuredImage.message}
              />
              <SEOScoreIndicator
                label="URL Slug"
                score={seoScore.slug.score}
                message={seoScore.slug.message}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
