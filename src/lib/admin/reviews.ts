export const runtime = 'edge';

import { v4 as uuidv4 } from 'uuid';
import { getDb, reviews } from '@/lib/db';
import { eq, and, desc } from 'drizzle-orm';

// Review type
export type Review = {
  id: string;
  slug: string;
  language: string;
  status: string;
  productName: string;
  productCategory: string;
  productBrand: string;
  productModel: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string | null;
  heroImageAlt: string;
  overallRating: number;
  videoQualityRating: number | null;
  audioQualityRating: number | null;
  buildQualityRating: number | null;
  valueRating: number | null;
  fullReview: string;
  excerpt: string;
  pros: string;
  cons: string;
  affiliateLinks: string;
  images: string;
  specifications: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  author: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ReviewInput = {
  slug: string;
  language: string;
  status: string;
  productName: string;
  productCategory: string;
  productBrand: string;
  productModel: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string | null;
  heroImageAlt?: string;
  overallRating: number;
  videoQualityRating?: number | null;
  audioQualityRating?: number | null;
  buildQualityRating?: number | null;
  valueRating?: number | null;
  fullReview: string;
  excerpt: string;
  pros: string | object;
  cons: string | object;
  affiliateLinks: string | object;
  images: string | object;
  specifications: string | object;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  author: string;
  publishedAt?: Date | null;
};

// Helper function to ensure JSON strings
function ensureJsonString(data: string | object): string {
  if (typeof data === 'string') {
    return data;
  }
  return JSON.stringify(data);
}

function rowToReview(row: typeof reviews.$inferSelect): Review {
  return {
    id: row.id,
    slug: row.slug,
    language: row.language,
    status: row.status,
    productName: row.productName,
    productCategory: row.productCategory,
    productBrand: row.productBrand,
    productModel: row.productModel,
    heroTitle: row.heroTitle,
    heroSubtitle: row.heroSubtitle,
    heroImage: row.heroImage ?? null,
    heroImageAlt: row.heroImageAlt,
    overallRating: row.overallRating,
    videoQualityRating: row.videoQualityRating ?? null,
    audioQualityRating: row.audioQualityRating ?? null,
    buildQualityRating: row.buildQualityRating ?? null,
    valueRating: row.valueRating ?? null,
    fullReview: row.fullReview,
    excerpt: row.excerpt,
    pros: row.pros,
    cons: row.cons,
    affiliateLinks: row.affiliateLinks,
    images: row.images,
    specifications: row.specifications,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    focusKeyword: row.focusKeyword,
    author: row.author,
    publishedAt: row.publishedAt ? new Date(row.publishedAt) : null,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

// Get all reviews
export async function getAllReviews(options?: {
  language?: string;
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<Review[]> {
  const db = getDb();

  const conditions = [];
  if (options?.language) conditions.push(eq(reviews.language, options.language));
  if (options?.status) conditions.push(eq(reviews.status, options.status));
  if (options?.category) conditions.push(eq(reviews.productCategory, options.category));

  let query = db
    .select()
    .from(reviews)
    .orderBy(desc(reviews.publishedAt));

  const rows = conditions.length > 0
    ? await (query as any).where(conditions.length === 1 ? conditions[0] : and(...conditions))
    : await query;

  let result: typeof rows = rows;
  if (options?.offset !== undefined) result = result.slice(options.offset);
  if (options?.limit !== undefined) result = result.slice(0, options.limit);

  return result.map(rowToReview);
}

// Get review by ID
export async function getReviewById(id: string): Promise<Review | null> {
  const db = getDb();
  const result = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, id))
    .limit(1);

  const row = result[0] ?? null;
  if (!row) return null;
  return rowToReview(row);
}

// Get review by slug and language
export async function getReviewBySlug(
  slug: string,
  language: string
): Promise<Review | null> {
  const db = getDb();
  const result = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.slug, slug), eq(reviews.language, language)))
    .limit(1);

  const row = result[0] ?? null;
  if (!row) return null;
  return rowToReview(row);
}

// Create a new review
export async function createReview(data: ReviewInput): Promise<Review> {
  const db = getDb();
  const now = new Date().toISOString();

  const publishedAt = data.status === 'published'
    ? (data.publishedAt ? data.publishedAt.toISOString() : now)
    : null;

  const result = await db
    .insert(reviews)
    .values({
      id: uuidv4(),
      slug: data.slug,
      language: data.language,
      status: data.status,
      productName: data.productName,
      productCategory: data.productCategory,
      productBrand: data.productBrand,
      productModel: data.productModel,
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      heroImage: data.heroImage ?? null,
      heroImageAlt: data.heroImageAlt || '',
      overallRating: data.overallRating,
      videoQualityRating: data.videoQualityRating ?? null,
      audioQualityRating: data.audioQualityRating ?? null,
      buildQualityRating: data.buildQualityRating ?? null,
      valueRating: data.valueRating ?? null,
      fullReview: data.fullReview,
      excerpt: data.excerpt,
      pros: ensureJsonString(data.pros),
      cons: ensureJsonString(data.cons),
      affiliateLinks: ensureJsonString(data.affiliateLinks),
      images: ensureJsonString(data.images),
      specifications: ensureJsonString(data.specifications),
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      focusKeyword: data.focusKeyword,
      author: data.author,
      publishedAt,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return rowToReview(result[0]);
}

// Update a review
export async function updateReview(
  id: string,
  data: Partial<ReviewInput>
): Promise<Review> {
  const db = getDb();
  const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };

  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.language !== undefined) updateData.language = data.language;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.productName !== undefined) updateData.productName = data.productName;
  if (data.productCategory !== undefined) updateData.productCategory = data.productCategory;
  if (data.productBrand !== undefined) updateData.productBrand = data.productBrand;
  if (data.productModel !== undefined) updateData.productModel = data.productModel;
  if (data.heroTitle !== undefined) updateData.heroTitle = data.heroTitle;
  if (data.heroSubtitle !== undefined) updateData.heroSubtitle = data.heroSubtitle;
  if (data.heroImage !== undefined) updateData.heroImage = data.heroImage;
  if (data.heroImageAlt !== undefined) updateData.heroImageAlt = data.heroImageAlt;
  if (data.overallRating !== undefined) updateData.overallRating = data.overallRating;
  if (data.videoQualityRating !== undefined) updateData.videoQualityRating = data.videoQualityRating;
  if (data.audioQualityRating !== undefined) updateData.audioQualityRating = data.audioQualityRating;
  if (data.buildQualityRating !== undefined) updateData.buildQualityRating = data.buildQualityRating;
  if (data.valueRating !== undefined) updateData.valueRating = data.valueRating;
  if (data.fullReview !== undefined) updateData.fullReview = data.fullReview;
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
  if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
  if (data.focusKeyword !== undefined) updateData.focusKeyword = data.focusKeyword;
  if (data.author !== undefined) updateData.author = data.author;

  if (data.pros) updateData.pros = ensureJsonString(data.pros);
  if (data.cons) updateData.cons = ensureJsonString(data.cons);
  if (data.affiliateLinks) updateData.affiliateLinks = ensureJsonString(data.affiliateLinks);
  if (data.images) updateData.images = ensureJsonString(data.images);
  if (data.specifications) updateData.specifications = ensureJsonString(data.specifications);

  // Update publishedAt if status changes to published
  if (data.status === 'published' && !data.publishedAt) {
    const existingReview = await getReviewById(id);
    if (existingReview && !existingReview.publishedAt) {
      updateData.publishedAt = new Date().toISOString();
    }
  } else if (data.publishedAt !== undefined) {
    updateData.publishedAt = data.publishedAt ? data.publishedAt.toISOString() : null;
  }

  const result = await db
    .update(reviews)
    .set(updateData)
    .where(eq(reviews.id, id))
    .returning();

  return rowToReview(result[0]);
}

// Delete a review
export async function deleteReview(id: string): Promise<Review> {
  const existing = await getReviewById(id);
  if (!existing) {
    throw new Error(`Review with id ${id} not found`);
  }
  const db = getDb();
  await db.delete(reviews).where(eq(reviews.id, id));
  return existing;
}

// Get review count
export async function getReviewCount(options?: {
  language?: string;
  status?: string;
  category?: string;
}): Promise<number> {
  // Fetch filtered rows and count them (D1/Drizzle SQLite does not expose a direct .count() shorthand)
  const rows = await getAllReviews(options);
  return rows.length;
}

// Parse JSON fields for client use
export function parseReviewJsonFields(review: Review) {
  return {
    ...review,
    pros: JSON.parse(review.pros),
    cons: JSON.parse(review.cons),
    affiliateLinks: JSON.parse(review.affiliateLinks),
    images: JSON.parse(review.images),
    specifications: JSON.parse(review.specifications),
  };
}
