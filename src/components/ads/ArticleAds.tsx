'use client';

import { AdSlot } from './AdSlot';
import type { AdSlotName } from './AdSlot';

interface ArticleAdsProps {
  topSlot: AdSlotName;
  middleSlot: AdSlotName;
  bottomSlot: AdSlotName;
}

/**
 * Article Ad Components (Blog & Review)
 * - Top section (before content)
 * - Middle section (injected into content)
 * - Bottom section (after content)
 */
export function ArticleTopAd({ slot }: { slot: AdSlotName }) {
  return (
    <div className="my-8">
      <AdSlot slot={slot} label="Advertisement" />
    </div>
  );
}

export function ArticleMiddleAd({ slot }: { slot: AdSlotName }) {
  return (
    <div className="my-8">
      <AdSlot slot={slot} label="Advertisement" />
    </div>
  );
}

export function ArticleBottomAd({ slot }: { slot: AdSlotName }) {
  return (
    <div className="my-8">
      <AdSlot slot={slot} label="Advertisement" />
    </div>
  );
}

/**
 * Full Article Ad Layout Helper
 * Use this to wrap article content with all three ad positions
 */
export function ArticleAdsLayout({
  children,
  topSlot,
  middleSlot,
  bottomSlot,
}: ArticleAdsProps & { children: React.ReactNode }) {
  return (
    <>
      <ArticleTopAd slot={topSlot} />
      {children}
      <ArticleBottomAd slot={bottomSlot} />
    </>
  );
}
