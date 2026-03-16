'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/lib/admin/blog';
import { locales } from '@/lib/i18n';

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    languages: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/admin/blogs');
        if (response.ok) {
          const data = await response.json();
          const allPosts = data.posts;
          setPosts(allPosts);

          const published = allPosts.filter((p: BlogPost) => p.status === 'published').length;
          const languages = new Set(allPosts.map((p: BlogPost) => p.language)).size;

          setStats({
            total: allPosts.length,
            published,
            drafts: allPosts.length - published,
            languages,
          });
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    }
    loadStats();
  }, []);

  const recentPosts = posts.slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to MicTestCam Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
          <div className="text-gray-400 text-sm">Total Blog Posts</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.published}</div>
          <div className="text-gray-400 text-sm">Published Posts</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.drafts}</div>
          <div className="text-gray-400 text-sm">Draft Posts</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{locales.length}</div>
          <div className="text-gray-400 text-sm">Supported Languages</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/blogs/new"
              className="flex items-center gap-3 p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-indigo-500/50 transition"
            >
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-white">Create New Blog Post</div>
                <div className="text-sm text-gray-400">Write and publish a new article</div>
              </div>
            </Link>

            <Link
              href="/admin/blogs"
              className="flex items-center gap-3 p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-indigo-500/50 transition"
            >
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-white">Manage Blog Posts</div>
                <div className="text-sm text-gray-400">View and edit existing posts</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Posts</h2>
          {recentPosts.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400">No blog posts yet</p>
              <Link
                href="/admin/blogs/new"
                className="inline-block mt-3 text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/blogs/${post.id}`}
                  className="flex items-center justify-between p-3 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-indigo-500/50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      post.status === 'published'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                    <span className="text-white truncate">{post.title || 'Untitled'}</span>
                  </div>
                  <span className="text-xs text-gray-500 uppercase ml-2">{post.language}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Account Security</h3>
            <p className="text-gray-400 text-sm mb-3">
              Your admin account is linked to your email for password recovery. Manage users and permissions from the Users page.
            </p>
            <div className="flex gap-3">
              <Link
                href="/admin/users"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Manage Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
