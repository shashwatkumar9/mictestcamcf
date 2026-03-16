export const runtime = 'edge';

import { v4 as uuidv4 } from 'uuid';
import { getDb, blogPosts } from '@/lib/db';
import { eq, and, desc } from 'drizzle-orm';
import type { Locale } from '../i18n';

export interface BlogPost {
  id: string;
  slug: string;
  language: Locale;
  status: 'draft' | 'published';
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string | null;
  featuredImageAlt: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface SEOScore {
  overall: number;
  title: { score: number; message: string };
  metaTitle: { score: number; message: string };
  metaDescription: { score: number; message: string };
  content: { score: number; message: string };
  focusKeyword: { score: number; message: string };
  featuredImage: { score: number; message: string };
  slug: { score: number; message: string };
}

function rowToPost(post: typeof blogPosts.$inferSelect): BlogPost {
  return {
    ...post,
    language: post.language as Locale,
    status: post.status as 'draft' | 'published',
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
  };
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const db = getDb();
  const posts = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.updatedAt));

  return posts.map(rowToPost);
}

// Get blog post by ID
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const db = getDb();
  const result = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  const post = result[0] ?? null;
  if (!post) return null;

  return rowToPost(post);
}

// Get blog post by slug and language
export async function getBlogPostBySlug(slug: string, language: Locale): Promise<BlogPost | null> {
  const db = getDb();
  const result = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.language, language),
        eq(blogPosts.status, 'published'),
      )
    )
    .limit(1);

  const post = result[0] ?? null;
  if (!post) return null;

  return rowToPost(post);
}

// Get published blog posts
export async function getPublishedBlogPosts(language?: Locale): Promise<BlogPost[]> {
  const db = getDb();
  const conditions = language
    ? and(eq(blogPosts.status, 'published'), eq(blogPosts.language, language))
    : eq(blogPosts.status, 'published');

  const posts = await db
    .select()
    .from(blogPosts)
    .where(conditions)
    .orderBy(desc(blogPosts.publishedAt));

  return posts.map(rowToPost);
}

// Create blog post
export async function createBlogPost(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
  const db = getDb();
  const now = new Date().toISOString();

  const result = await db
    .insert(blogPosts)
    .values({
      id: uuidv4(),
      slug: data.slug,
      language: data.language,
      status: data.status,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      featuredImage: data.featuredImage ?? null,
      featuredImageAlt: data.featuredImageAlt,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      focusKeyword: data.focusKeyword,
      author: data.author,
      publishedAt: data.publishedAt ? data.publishedAt.toISOString() : null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return rowToPost(result[0]);
}

// Update blog post
export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const db = getDb();
    const updateValues: Record<string, unknown> = { updatedAt: new Date().toISOString() };

    if (data.slug !== undefined) updateValues.slug = data.slug;
    if (data.language !== undefined) updateValues.language = data.language;
    if (data.status !== undefined) updateValues.status = data.status;
    if (data.title !== undefined) updateValues.title = data.title;
    if (data.content !== undefined) updateValues.content = data.content;
    if (data.excerpt !== undefined) updateValues.excerpt = data.excerpt;
    if (data.featuredImage !== undefined) updateValues.featuredImage = data.featuredImage;
    if (data.featuredImageAlt !== undefined) updateValues.featuredImageAlt = data.featuredImageAlt;
    if (data.metaTitle !== undefined) updateValues.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) updateValues.metaDescription = data.metaDescription;
    if (data.focusKeyword !== undefined) updateValues.focusKeyword = data.focusKeyword;
    if (data.author !== undefined) updateValues.author = data.author;
    if (data.publishedAt !== undefined) {
      updateValues.publishedAt = data.publishedAt ? data.publishedAt.toISOString() : null;
    }

    const result = await db
      .update(blogPosts)
      .set(updateValues)
      .where(eq(blogPosts.id, id))
      .returning();

    const post = result[0] ?? null;
    if (!post) return null;

    return rowToPost(post);
  } catch {
    return null;
  }
}

// Delete blog post
export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const db = getDb();
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  } catch {
    return false;
  }
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Check if slug is unique
export async function isSlugUnique(slug: string, language: Locale, excludeId?: string): Promise<boolean> {
  const db = getDb();
  const result = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.language, language)))
    .limit(1);

  const post = result[0] ?? null;
  if (!post) return true;
  if (excludeId && post.id === excludeId) return true;
  return false;
}

// Calculate SEO score (same logic as before)
export function calculateSEOScore(post: Partial<BlogPost>): SEOScore {
  const scores: SEOScore = {
    overall: 0,
    title: { score: 0, message: '' },
    metaTitle: { score: 0, message: '' },
    metaDescription: { score: 0, message: '' },
    content: { score: 0, message: '' },
    focusKeyword: { score: 0, message: '' },
    featuredImage: { score: 0, message: '' },
    slug: { score: 0, message: '' },
  };

  const focusKeyword = post.focusKeyword?.toLowerCase() || '';

  // Title scoring (0-100)
  if (!post.title) {
    scores.title = { score: 0, message: 'Add a title' };
  } else if (post.title.length < 20) {
    scores.title = { score: 30, message: 'Title is too short (min 20 chars)' };
  } else if (post.title.length > 70) {
    scores.title = { score: 50, message: 'Title is too long (max 70 chars)' };
  } else if (focusKeyword && !post.title.toLowerCase().includes(focusKeyword)) {
    scores.title = { score: 70, message: 'Add focus keyword to title' };
  } else if (post.title.length >= 40 && post.title.length <= 60) {
    scores.title = { score: 100, message: 'Perfect title length!' };
  } else {
    scores.title = { score: 85, message: 'Good title' };
  }

  // Meta Title scoring
  if (!post.metaTitle) {
    scores.metaTitle = { score: 0, message: 'Add a meta title' };
  } else if (post.metaTitle.length < 30) {
    scores.metaTitle = { score: 30, message: 'Meta title too short (min 30 chars)' };
  } else if (post.metaTitle.length > 60) {
    scores.metaTitle = { score: 50, message: 'Meta title too long (max 60 chars)' };
  } else if (focusKeyword && !post.metaTitle.toLowerCase().includes(focusKeyword)) {
    scores.metaTitle = { score: 70, message: 'Add focus keyword to meta title' };
  } else {
    scores.metaTitle = { score: 100, message: 'Perfect meta title!' };
  }

  // Meta Description scoring
  if (!post.metaDescription) {
    scores.metaDescription = { score: 0, message: 'Add a meta description' };
  } else if (post.metaDescription.length < 120) {
    scores.metaDescription = { score: 30, message: 'Meta description too short (min 120 chars)' };
  } else if (post.metaDescription.length > 160) {
    scores.metaDescription = { score: 50, message: 'Meta description too long (max 160 chars)' };
  } else if (focusKeyword && !post.metaDescription.toLowerCase().includes(focusKeyword)) {
    scores.metaDescription = { score: 70, message: 'Add focus keyword to meta description' };
  } else {
    scores.metaDescription = { score: 100, message: 'Perfect meta description!' };
  }

  // Content scoring
  const contentLength = post.content?.length || 0;
  const wordCount = post.content?.split(/\s+/).length || 0;

  if (!post.content || contentLength < 100) {
    scores.content = { score: 0, message: 'Add content (min 300 words)' };
  } else if (wordCount < 300) {
    scores.content = { score: 30, message: `Content too short (${wordCount}/300 words)` };
  } else if (wordCount < 600) {
    scores.content = { score: 60, message: `Good start (${wordCount} words, aim for 600+)` };
  } else if (focusKeyword && !post.content.toLowerCase().includes(focusKeyword)) {
    scores.content = { score: 70, message: 'Add focus keyword to content' };
  } else if (wordCount >= 1000) {
    scores.content = { score: 100, message: `Excellent content length (${wordCount} words)` };
  } else {
    scores.content = { score: 85, message: `Good content (${wordCount} words)` };
  }

  // Focus Keyword scoring
  if (!post.focusKeyword) {
    scores.focusKeyword = { score: 0, message: 'Add a focus keyword' };
  } else if (post.focusKeyword.length < 3) {
    scores.focusKeyword = { score: 30, message: 'Focus keyword too short' };
  } else if (post.focusKeyword.split(' ').length > 4) {
    scores.focusKeyword = { score: 50, message: 'Focus keyword too long (max 4 words)' };
  } else {
    scores.focusKeyword = { score: 100, message: 'Good focus keyword' };
  }

  // Featured Image scoring
  if (!post.featuredImage) {
    scores.featuredImage = { score: 0, message: 'Add a featured image' };
  } else if (!post.featuredImageAlt) {
    scores.featuredImage = { score: 50, message: 'Add alt text to featured image' };
  } else if (focusKeyword && !post.featuredImageAlt.toLowerCase().includes(focusKeyword)) {
    scores.featuredImage = { score: 70, message: 'Add focus keyword to image alt text' };
  } else {
    scores.featuredImage = { score: 100, message: 'Featured image is optimized!' };
  }

  // Slug scoring
  if (!post.slug) {
    scores.slug = { score: 0, message: 'Add a URL slug' };
  } else if (post.slug.length > 75) {
    scores.slug = { score: 50, message: 'Slug is too long' };
  } else if (focusKeyword && !post.slug.toLowerCase().includes(focusKeyword.replace(/\s+/g, '-'))) {
    scores.slug = { score: 70, message: 'Consider adding focus keyword to slug' };
  } else {
    scores.slug = { score: 100, message: 'Good URL slug!' };
  }

  // Calculate overall score
  const allScores = [
    scores.title.score,
    scores.metaTitle.score,
    scores.metaDescription.score,
    scores.content.score,
    scores.focusKeyword.score,
    scores.featuredImage.score,
    scores.slug.score,
  ];
  scores.overall = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

  return scores;
}
