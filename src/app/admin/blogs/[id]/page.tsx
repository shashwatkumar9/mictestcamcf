'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { BlogEditor } from '@/components/admin/BlogEditor';
import type { BlogPost } from '@/lib/admin/blog';

interface EditBlogPostProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPost({ params }: EditBlogPostProps) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`/api/admin/blogs/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data.post);
        } else {
          router.push('/admin/blogs');
        }
      } catch (error) {
        console.error('Failed to load post:', error);
        router.push('/admin/blogs');
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id, router]);

  if (loading) {
    return (
      <AdminAuthGuard>
        <div className="flex min-h-screen bg-gray-950">
          <AdminSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading post...</p>
            </div>
          </main>
        </div>
      </AdminAuthGuard>
    );
  }

  if (!post) {
    return null;
  }

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
              <span className="text-white">Edit Post</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Edit Post</h1>
            <p className="text-gray-400">Update your blog article</p>
          </div>

          <BlogEditor post={post} />
        </main>
      </div>
    </AdminAuthGuard>
  );
}
