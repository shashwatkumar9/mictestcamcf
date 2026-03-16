'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Review {
  id: string;
  productName: string;
  productBrand: string;
  productCategory: string;
  slug: string;
  language: string;
  status: string;
  overallRating: number;
  author: string;
  publishedAt: Date | null;
  updatedAt: Date;
}

export default function ReviewList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews');
      if (!response.ok) throw new Error('Failed to fetch reviews');

      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete the review for "${productName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete review');

      alert('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter !== 'all' && review.status !== filter) return false;
    if (languageFilter !== 'all' && review.language !== languageFilter) return false;
    if (categoryFilter !== 'all' && review.productCategory !== categoryFilter) return false;
    if (searchQuery && !review.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !review.productBrand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const languages = [...new Set(reviews.map((r) => r.language))];
  const categories = [...new Set(reviews.map((r) => r.productCategory))];

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.round(rating));
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto p-8">
        <div className="text-center py-8 text-gray-400">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Product Reviews</h1>
          <p className="text-gray-400">Manage product reviews across all languages</p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Review
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
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
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No reviews found</h3>
          <p className="text-gray-400 mb-4">
            {searchQuery || filter !== 'all' || languageFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first product review'}
          </p>
          <Link
            href="/admin/reviews/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Review
          </Link>
        </div>
      ) : (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Product</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Rating</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Language</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-700/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">
                      {review.productBrand} {review.productName}
                    </div>
                    <div className="text-sm text-gray-400">{review.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                      {review.productCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">{renderStars(review.overallRating)}</span>
                      <span className="text-sm text-gray-400">({review.overallRating})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">{review.language.toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        review.status === 'published'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/reviews/${review.id}`}
                        className="text-indigo-400 hover:text-indigo-300 font-medium text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(review.id, review.productName)}
                        className="text-red-400 hover:text-red-300 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
