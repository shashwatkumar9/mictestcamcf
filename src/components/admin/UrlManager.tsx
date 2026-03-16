'use client';

import { useEffect, useState } from 'react';
import { localeNames } from '@/lib/i18n';

interface UrlItem {
  id: string;
  category: 'homepage' | 'tools' | 'pages' | 'blogs' | 'reviews';
  name: string;
  url: string;
  language: string;
  publishedAt?: string;
}

const categoryLabels = {
  homepage: 'Home Page',
  tools: 'Tools',
  pages: 'Pages',
  blogs: 'Blog Posts',
  reviews: 'Reviews',
};

const categoryColors = {
  homepage: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  tools: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  pages: 'bg-green-500/20 text-green-400 border-green-500/50',
  blogs: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  reviews: 'bg-pink-500/20 text-pink-400 border-pink-500/50',
};

export function UrlManager() {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'category' | 'language'>('category');

  useEffect(() => {
    fetchUrls();
  }, []);

  async function fetchUrls() {
    try {
      const response = await fetch('/api/admin/urls');
      const data = await response.json();
      if (response.ok) {
        setUrls(data.urls || []);
      }
    } catch (error) {
      console.error('Failed to fetch URLs:', error);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Filter URLs based on search and filters
  const filteredUrls = urls.filter((url) => {
    const matchesSearch =
      searchQuery === '' ||
      url.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || url.category === categoryFilter;
    const matchesLanguage = languageFilter === 'all' || url.language === languageFilter;

    return matchesSearch && matchesCategory && matchesLanguage;
  });

  // Group URLs by category or language based on view mode
  const groupedUrls = filteredUrls.reduce((acc, url) => {
    const key = viewMode === 'category' ? url.category : url.language;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(url);
    return acc;
  }, {} as Record<string, UrlItem[]>);

  // Get unique languages
  const languages = [...new Set(urls.map((u) => u.language))].filter((l) => l !== 'all');

  // Get stats
  const stats = {
    total: urls.length,
    homepage: urls.filter((u) => u.category === 'homepage').length,
    tools: urls.filter((u) => u.category === 'tools').length,
    pages: urls.filter((u) => u.category === 'pages').length,
    blogs: urls.filter((u) => u.category === 'blogs').length,
    reviews: urls.filter((u) => u.category === 'reviews').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">All URLs</h1>
        <p className="text-gray-400">Manage and copy URLs for internal linking across your website</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-gray-400">Total URLs</div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">{stats.homepage}</div>
          <div className="text-sm text-gray-400">Home Page</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{stats.tools}</div>
          <div className="text-sm text-gray-400">Tools</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{stats.pages}</div>
          <div className="text-sm text-gray-400">Pages</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">{stats.blogs}</div>
          <div className="text-sm text-gray-400">Blog Posts</div>
        </div>
        <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-pink-400">{stats.reviews}</div>
          <div className="text-sm text-gray-400">Reviews</div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-xl p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('category')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'category'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Category View
          </button>
          <button
            onClick={() => setViewMode('language')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'language'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Language Collections
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="homepage">Home Page</option>
            <option value="tools">Tools</option>
            <option value="pages">Pages</option>
            <option value="blogs">Blog Posts</option>
            <option value="reviews">Reviews</option>
          </select>
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-gray-400 text-sm">
        Showing {filteredUrls.length} of {urls.length} URLs
      </div>

      {/* URLs List */}
      {filteredUrls.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No URLs found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedUrls).map(([groupKey, groupUrls]) => {
            const isLanguageView = viewMode === 'language';
            const displayLabel = isLanguageView
              ? `${localeNames[groupKey as keyof typeof localeNames] || groupKey.toUpperCase()} (${groupKey.toUpperCase()})`
              : categoryLabels[groupKey as keyof typeof categoryLabels];
            const badgeColor = isLanguageView
              ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50'
              : categoryColors[groupKey as keyof typeof categoryColors];

            return (
              <div key={groupKey} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <div className="bg-gray-900/50 px-6 py-3 border-b border-gray-700">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${badgeColor}`}>
                      {displayLabel}
                    </span>
                    <span className="text-gray-400 text-sm">({groupUrls.length} URLs)</span>
                  </h2>
                </div>
              <div className="divide-y divide-gray-700/50">
                {groupUrls.map((url) => (
                  <div
                    key={url.id}
                    className="px-6 py-4 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium mb-1">{url.name}</h3>
                        <div className="flex items-center gap-3 text-sm">
                          <code className="text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded text-xs">
                            {url.url}
                          </code>
                          {!isLanguageView && (
                            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded uppercase">
                              {url.language}
                            </span>
                          )}
                          {isLanguageView && url.category && (
                            <span className={`px-2 py-1 text-xs font-medium rounded border ${categoryColors[url.category]}`}>
                              {categoryLabels[url.category]}
                            </span>
                          )}
                          {url.publishedAt && (
                            <span className="text-gray-500 text-xs">
                              {new Date(url.publishedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(url.url)}
                          className={`p-2 rounded-lg transition ${
                            copiedUrl === url.url
                              ? 'bg-green-500/20 text-green-400'
                              : 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10'
                          }`}
                          title="Copy URL"
                        >
                          {copiedUrl === url.url ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                              />
                            </svg>
                          )}
                        </button>
                        <a
                          href={url.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition"
                          title="Open in new tab"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 How to Use for Internal Linking</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Use the search bar to quickly find relevant pages for internal links</li>
          <li>• Click the copy icon to copy the URL to your clipboard</li>
          <li>• URLs are automatically added when you publish blog posts or reviews</li>
          <li>• Filter by category or language to find specific content</li>
          <li>• Use these URLs when writing content to create strong internal link structure</li>
        </ul>
      </div>
    </div>
  );
}
