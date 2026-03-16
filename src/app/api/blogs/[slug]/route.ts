export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostBySlug } from '@/lib/admin/blog';
import type { Locale } from '@/lib/i18n';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET - Get single blog post by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') as Locale;

    if (!language) {
      return NextResponse.json({ error: 'Language parameter is required' }, { status: 400 });
    }

    const post = await getBlogPostBySlug(slug, language);

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
