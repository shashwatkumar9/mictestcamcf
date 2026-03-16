import {
  sqliteTable,
  text,
  integer,
  real,
  uniqueIndex,
  index,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ── Users ─────────────────────────────────────────────────────────────────
export const users = sqliteTable(
  'User',
  {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    email: text('email').notNull().unique(),
    passwordHash: text('passwordHash').notNull(),
    role: text('role').notNull().default('editor'),
    isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
    isEmailVerified: integer('isEmailVerified', { mode: 'boolean' }).notNull().default(false),
    emailVerificationToken: text('emailVerificationToken'),
    emailVerificationExpires: text('emailVerificationExpires'),
    passwordResetToken: text('passwordResetToken'),
    passwordResetExpires: text('passwordResetExpires'),
    lastLogin: text('lastLogin'),
    createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
    updatedAt: text('updatedAt').notNull().default(sql`(datetime('now'))`),
  },
  (t) => [
    index('User_email_idx').on(t.email),
    index('User_username_idx').on(t.username),
  ],
);

// ── Blog Posts ─────────────────────────────────────────────────────────────
export const blogPosts = sqliteTable(
  'BlogPost',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    language: text('language').notNull(),
    status: text('status').notNull().default('draft'),
    title: text('title').notNull(),
    content: text('content').notNull(),
    excerpt: text('excerpt').notNull(),
    featuredImage: text('featuredImage'),
    featuredImageAlt: text('featuredImageAlt').notNull().default(''),
    metaTitle: text('metaTitle').notNull(),
    metaDescription: text('metaDescription').notNull(),
    focusKeyword: text('focusKeyword').notNull(),
    author: text('author').notNull(),
    publishedAt: text('publishedAt'),
    createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
    updatedAt: text('updatedAt').notNull().default(sql`(datetime('now'))`),
  },
  (t) => [
    uniqueIndex('BlogPost_slug_language_key').on(t.slug, t.language),
    index('BlogPost_status_idx').on(t.status),
    index('BlogPost_language_idx').on(t.language),
    index('BlogPost_publishedAt_idx').on(t.publishedAt),
  ],
);

// ── Reviews ────────────────────────────────────────────────────────────────
export const reviews = sqliteTable(
  'Review',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    language: text('language').notNull(),
    status: text('status').notNull().default('draft'),
    productName: text('productName').notNull(),
    productCategory: text('productCategory').notNull(),
    productBrand: text('productBrand').notNull(),
    productModel: text('productModel').notNull(),
    heroTitle: text('heroTitle').notNull(),
    heroSubtitle: text('heroSubtitle').notNull(),
    heroImage: text('heroImage'),
    heroImageAlt: text('heroImageAlt').notNull().default(''),
    overallRating: real('overallRating').notNull(),
    videoQualityRating: real('videoQualityRating'),
    audioQualityRating: real('audioQualityRating'),
    buildQualityRating: real('buildQualityRating'),
    valueRating: real('valueRating'),
    fullReview: text('fullReview').notNull(),
    excerpt: text('excerpt').notNull(),
    pros: text('pros').notNull(),           // JSON array
    cons: text('cons').notNull(),           // JSON array
    affiliateLinks: text('affiliateLinks').notNull(), // JSON array
    images: text('images').notNull(),       // JSON array
    specifications: text('specifications').notNull(), // JSON object
    metaTitle: text('metaTitle').notNull(),
    metaDescription: text('metaDescription').notNull(),
    focusKeyword: text('focusKeyword').notNull(),
    author: text('author').notNull(),
    publishedAt: text('publishedAt'),
    createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
    updatedAt: text('updatedAt').notNull().default(sql`(datetime('now'))`),
  },
  (t) => [
    uniqueIndex('Review_slug_language_key').on(t.slug, t.language),
    index('Review_status_idx').on(t.status),
    index('Review_language_idx').on(t.language),
    index('Review_productCategory_idx').on(t.productCategory),
    index('Review_publishedAt_idx').on(t.publishedAt),
  ],
);

// ── Ad Configuration ───────────────────────────────────────────────────────
export const adConfigs = sqliteTable(
  'AdConfig',
  {
    id: text('id').primaryKey(),
    slotName: text('slotName').notNull().unique(),
    adCode: text('adCode').notNull(),
    enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
    createdAt: text('createdAt').notNull().default(sql`(datetime('now'))`),
    updatedAt: text('updatedAt').notNull().default(sql`(datetime('now'))`),
  },
  (t) => [
    index('AdConfig_enabled_idx').on(t.enabled),
  ],
);

export type User = typeof users.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type AdConfig = typeof adConfigs.$inferSelect;
