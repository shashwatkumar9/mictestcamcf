export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { getReviewBySlug } from '@/lib/admin/reviews';

// GET /api/reviews/[slug] - Get a single published review by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'en';

    const review = await getReviewBySlug(slug, language);

    if (!review || review.status !== 'published') {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}
