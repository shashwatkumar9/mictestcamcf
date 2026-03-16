'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { BlogEditor } from '@/components/admin/BlogEditor';
import Link from 'next/link';

export default function NewBlogPost() {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-gray-950">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Link href="/admin/blogs" className="hover:text-indigo-400 transition">
                Blog Posts
              </Link>
              <span>/</span>
              <span className="text-white">New Post</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create New Post</h1>
            <p className="text-gray-400">Write and publish a new blog article</p>
          </div>

          <BlogEditor isNew />
        </main>
      </div>
    </AdminAuthGuard>
  );
}
