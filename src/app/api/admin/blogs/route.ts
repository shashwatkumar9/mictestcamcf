import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/admin/users';
import { getAllBlogPosts, createBlogPost } from '@/lib/admin/blog';

// Helper to get current user from request
async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

// GET - List all blog posts
export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const posts = await getAllBlogPosts();
  return NextResponse.json({ posts });
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!currentUser.permissions.canCreatePosts) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    const data = await request.json();

    const post = await createBlogPost(data);

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Create blog post error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create blog post';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
