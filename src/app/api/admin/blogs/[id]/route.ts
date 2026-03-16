export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/admin/users';
import { getBlogPostById, updateBlogPost, deleteBlogPost } from '@/lib/admin/blog';

// Helper to get current user from request
async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single blog post
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const post = await getBlogPostById(id);
  if (!post) {
    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
  }

  return NextResponse.json({ post });
}

// PATCH - Update blog post
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!currentUser.permissions.canEditPosts) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    const data = await request.json();
    const post = await updateBlogPost(id, data);

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Update blog post error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update blog post';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// DELETE - Delete blog post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!currentUser.permissions.canDeletePosts) {
    return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
  }

  try {
    const success = await deleteBlogPost(id);

    if (!success) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete blog post error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete blog post';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
