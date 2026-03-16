export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { getAllReviews, getReviewCount } from '@/lib/admin/reviews';

// GET /api/reviews - Public API to get published reviews
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'en';
    const category = searchParams.get('category') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

    // Only get published reviews
    const reviews = await getAllReviews({
      language,
      status: 'published',
      category,
      limit,
      offset,
    });

    // Get total count
    const total = await getReviewCount({ language, status: 'published', category });

    return NextResponse.json({
      reviews,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
