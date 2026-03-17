import { NextRequest, NextResponse } from 'next/server';
import { getPublishedBlogPosts } from '@/lib/admin/blog';
import type { Locale } from '@/lib/i18n';

// GET - List published blog posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') as Locale | null;

    const posts = await getPublishedBlogPosts(language || undefined);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching published posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
