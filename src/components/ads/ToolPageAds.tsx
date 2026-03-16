'use client';

import { AdSlot } from './AdSlot';
import type { AdSlotName } from './AdSlot';

interface ToolPageAdsProps {
  children: React.ReactNode;
  sidebarLeftSlot: AdSlotName;
  sidebarRightSlot: AdSlotName;
  belowToolSlot: AdSlotName;
  aboveFooterSlot: AdSlotName;
}

/**
 * Tool Page Ad Layout (Webcam & Microphone Test)
 * - Left sidebar (sticky)
 * - Right sidebar (sticky)
 * - Below tool
 * - Above footer
 */
export function ToolPageAds({
  children,
  sidebarLeftSlot,
  sidebarRightSlot,
  belowToolSlot,
  aboveFooterSlot,
}: ToolPageAdsProps) {
  return (
    <>
      {/* Main content with sidebars */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Left Sidebar Ad */}
          <aside className="hidden xl:block w-[300px] flex-shrink-0">
            <div className="sticky top-20">
              <AdSlot slot={sidebarLeftSlot} label="Advertisement" />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">{children}</div>

          {/* Right Sidebar Ad */}
          <aside className="hidden xl:block w-[300px] flex-shrink-0">
            <div className="sticky top-20">
              <AdSlot slot={sidebarRightSlot} label="Advertisement" />
            </div>
          </aside>
        </div>
      </div>

      {/* Below Tool Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <AdSlot slot={belowToolSlot} label="Advertisement" />
      </div>

      {/* Above Footer Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <AdSlot slot={aboveFooterSlot} label="Advertisement" />
      </div>
    </>
  );
}
