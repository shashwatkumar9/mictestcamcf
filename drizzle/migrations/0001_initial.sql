-- MicTestCam D1 Database — Initial Schema
-- Apply with: wrangler d1 migrations apply mictestcamcf --remote

CREATE TABLE IF NOT EXISTS `User` (
  `id` text PRIMARY KEY NOT NULL,
  `username` text NOT NULL UNIQUE,
  `email` text NOT NULL UNIQUE,
  `passwordHash` text NOT NULL,
  `role` text NOT NULL DEFAULT 'editor',
  `isActive` integer NOT NULL DEFAULT 1,
  `isEmailVerified` integer NOT NULL DEFAULT 0,
  `emailVerificationToken` text,
  `emailVerificationExpires` text,
  `passwordResetToken` text,
  `passwordResetExpires` text,
  `lastLogin` text,
  `createdAt` text NOT NULL DEFAULT (datetime('now')),
  `updatedAt` text NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS `User_email_idx` ON `User` (`email`);
CREATE INDEX IF NOT EXISTS `User_username_idx` ON `User` (`username`);

CREATE TABLE IF NOT EXISTS `BlogPost` (
  `id` text PRIMARY KEY NOT NULL,
  `slug` text NOT NULL,
  `language` text NOT NULL,
  `status` text NOT NULL DEFAULT 'draft',
  `title` text NOT NULL,
  `content` text NOT NULL,
  `excerpt` text NOT NULL,
  `featuredImage` text,
  `featuredImageAlt` text NOT NULL DEFAULT '',
  `metaTitle` text NOT NULL,
  `metaDescription` text NOT NULL,
  `focusKeyword` text NOT NULL,
  `author` text NOT NULL,
  `publishedAt` text,
  `createdAt` text NOT NULL DEFAULT (datetime('now')),
  `updatedAt` text NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS `BlogPost_slug_language_key` ON `BlogPost` (`slug`, `language`);
CREATE INDEX IF NOT EXISTS `BlogPost_status_idx` ON `BlogPost` (`status`);
CREATE INDEX IF NOT EXISTS `BlogPost_language_idx` ON `BlogPost` (`language`);
CREATE INDEX IF NOT EXISTS `BlogPost_publishedAt_idx` ON `BlogPost` (`publishedAt`);

CREATE TABLE IF NOT EXISTS `Review` (
  `id` text PRIMARY KEY NOT NULL,
  `slug` text NOT NULL,
  `language` text NOT NULL,
  `status` text NOT NULL DEFAULT 'draft',
  `productName` text NOT NULL,
  `productCategory` text NOT NULL,
  `productBrand` text NOT NULL,
  `productModel` text NOT NULL,
  `heroTitle` text NOT NULL,
  `heroSubtitle` text NOT NULL,
  `heroImage` text,
  `heroImageAlt` text NOT NULL DEFAULT '',
  `overallRating` real NOT NULL,
  `videoQualityRating` real,
  `audioQualityRating` real,
  `buildQualityRating` real,
  `valueRating` real,
  `fullReview` text NOT NULL,
  `excerpt` text NOT NULL,
  `pros` text NOT NULL,
  `cons` text NOT NULL,
  `affiliateLinks` text NOT NULL,
  `images` text NOT NULL,
  `specifications` text NOT NULL,
  `metaTitle` text NOT NULL,
  `metaDescription` text NOT NULL,
  `focusKeyword` text NOT NULL,
  `author` text NOT NULL,
  `publishedAt` text,
  `createdAt` text NOT NULL DEFAULT (datetime('now')),
  `updatedAt` text NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS `Review_slug_language_key` ON `Review` (`slug`, `language`);
CREATE INDEX IF NOT EXISTS `Review_status_idx` ON `Review` (`status`);
CREATE INDEX IF NOT EXISTS `Review_language_idx` ON `Review` (`language`);
CREATE INDEX IF NOT EXISTS `Review_productCategory_idx` ON `Review` (`productCategory`);
CREATE INDEX IF NOT EXISTS `Review_publishedAt_idx` ON `Review` (`publishedAt`);

CREATE TABLE IF NOT EXISTS `AdConfig` (
  `id` text PRIMARY KEY NOT NULL,
  `slotName` text NOT NULL UNIQUE,
  `adCode` text NOT NULL,
  `enabled` integer NOT NULL DEFAULT 1,
  `createdAt` text NOT NULL DEFAULT (datetime('now')),
  `updatedAt` text NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS `AdConfig_enabled_idx` ON `AdConfig` (`enabled`);
