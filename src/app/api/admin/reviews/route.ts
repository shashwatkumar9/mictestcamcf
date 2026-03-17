import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/admin/auth';
import { getAllReviews, createReview, getReviewCount } from '@/lib/admin/reviews';

// GET /api/admin/reviews - List all reviews
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || undefined;
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    // Get reviews
    const reviews = await getAllReviews({
      language,
      status,
      category,
      limit,
      offset,
    });

    // Get total count
    const total = await getReviewCount({ language, status, category });

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

// POST /api/admin/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check permissions (admin or editor)
    if (user.role !== 'admin' && user.role !== 'editor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'slug',
      'language',
      'productName',
      'productCategory',
      'productBrand',
      'productModel',
      'heroTitle',
      'heroSubtitle',
      'overallRating',
      'fullReview',
      'excerpt',
      'metaTitle',
      'metaDescription',
      'focusKeyword',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create review
    const review = await createReview({
      ...body,
      author: user.username,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A review with this slug and language already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
