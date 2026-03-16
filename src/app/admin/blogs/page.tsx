'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { type BlogPost } from '@/lib/admin/blog';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/admin/blogs');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/admin/blogs/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await loadPosts();
        } else {
          alert('Failed to delete post');
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post');
      }
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filter !== 'all' && post.status !== filter) return false;
    if (languageFilter !== 'all' && post.language !== languageFilter) return false;
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const languages = [...new Set(posts.map((p) => p.language))];

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-gray-950">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Blog Posts</h1>
              <p className="text-gray-400">Manage your blog content across all languages</p>
            </div>
            <Link
              href="/admin/blogs/new"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search posts..."
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
              </div>
            </div>
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No blog posts found</h3>
              <p className="text-gray-400 mb-4">
                {searchQuery || filter !== 'all' || languageFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first blog post'}
              </p>
              <Link
                href="/admin/blogs/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Post
              </Link>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Title</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Language</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Date</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{post.title || 'Untitled'}</div>
                          <div className="text-gray-500 text-sm">/{post.language}/blog/{post.slug}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded uppercase">
                          {post.language}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          post.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/blogs/${post.id}`}
                            className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          {post.status === 'published' && (
                            <Link
                              href={`/${post.language}/blog/${post.slug}`}
                              target="_blank"
                              className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition"
                              title="View"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </Link>
                          )}
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
