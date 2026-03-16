'use client';

import { AdSlot } from './AdSlot';

/**
 * Home Page Ad Layout
 * - Left sidebar (sticky)
 * - Right sidebar (sticky)
 * - Above footer
 */
export function HomePageAds({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative">
        {/* Main content with sidebars */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Left Sidebar Ad */}
            <aside className="hidden xl:block w-[300px] flex-shrink-0">
              <div className="sticky top-20">
                <AdSlot slot="homeSidebarLeft" label="Advertisement" />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">{children}</div>

            {/* Right Sidebar Ad */}
            <aside className="hidden xl:block w-[300px] flex-shrink-0">
              <div className="sticky top-20">
                <AdSlot slot="homeSidebarRight" label="Advertisement" />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Above Footer Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <AdSlot slot="homeAboveFooter" label="Advertisement" />
      </div>
    </>
  );
}
