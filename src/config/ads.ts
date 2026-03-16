/**
 * Ad Configuration Types
 * Ad codes are managed through the admin panel and stored in the database
 */

export const AD_SLOT_NAMES = {
  // Home Page
  HOME_SIDEBAR_LEFT: 'homeSidebarLeft',
  HOME_SIDEBAR_RIGHT: 'homeSidebarRight',
  HOME_ABOVE_FOOTER: 'homeAboveFooter',

  // Webcam Test Page
  WEBCAM_SIDEBAR_LEFT: 'webcamSidebarLeft',
  WEBCAM_SIDEBAR_RIGHT: 'webcamSidebarRight',
  WEBCAM_BELOW_TOOL: 'webcamBelowTool',
  WEBCAM_ABOVE_FOOTER: 'webcamAboveFooter',

  // Microphone Test Page
  MICROPHONE_SIDEBAR_LEFT: 'microphoneSidebarLeft',
  MICROPHONE_SIDEBAR_RIGHT: 'microphoneSidebarRight',
  MICROPHONE_BELOW_TOOL: 'microphoneBelowTool',
  MICROPHONE_ABOVE_FOOTER: 'microphoneAboveFooter',

  // Blog Posts
  BLOG_TOP_SECTION: 'blogTopSection',
  BLOG_MIDDLE_SECTION: 'blogMiddleSection',
  BLOG_BOTTOM_SECTION: 'blogBottomSection',

  // Reviews
  REVIEW_TOP_SECTION: 'reviewTopSection',
  REVIEW_MIDDLE_SECTION: 'reviewMiddleSection',
  REVIEW_BOTTOM_SECTION: 'reviewBottomSection',
} as const;

export type AdSlotName = (typeof AD_SLOT_NAMES)[keyof typeof AD_SLOT_NAMES];

export interface AdSlot {
  id: string;
  slotName: AdSlotName;
  adCode: string;
  enabled: boolean;
  updatedAt: Date;
  createdAt: Date;
}

/**
 * Get all ad slot names with friendly labels for admin UI
 */
export const AD_SLOT_LABELS: Record<AdSlotName, { label: string; description: string }> = {
  [AD_SLOT_NAMES.HOME_SIDEBAR_LEFT]: {
    label: 'Home - Left Sidebar',
    description: 'Sticky ad on the left sidebar of the home page (desktop only)',
  },
  [AD_SLOT_NAMES.HOME_SIDEBAR_RIGHT]: {
    label: 'Home - Right Sidebar',
    description: 'Sticky ad on the right sidebar of the home page (desktop only)',
  },
  [AD_SLOT_NAMES.HOME_ABOVE_FOOTER]: {
    label: 'Home - Above Footer',
    description: 'Full-width ad above the footer on the home page',
  },
  [AD_SLOT_NAMES.WEBCAM_SIDEBAR_LEFT]: {
    label: 'Webcam Test - Left Sidebar',
    description: 'Sticky ad on the left sidebar of webcam test page (desktop only)',
  },
  [AD_SLOT_NAMES.WEBCAM_SIDEBAR_RIGHT]: {
    label: 'Webcam Test - Right Sidebar',
    description: 'Sticky ad on the right sidebar of webcam test page (desktop only)',
  },
  [AD_SLOT_NAMES.WEBCAM_BELOW_TOOL]: {
    label: 'Webcam Test - Below Tool',
    description: 'Ad displayed below the webcam testing tool',
  },
  [AD_SLOT_NAMES.WEBCAM_ABOVE_FOOTER]: {
    label: 'Webcam Test - Above Footer',
    description: 'Full-width ad above the footer on webcam test page',
  },
  [AD_SLOT_NAMES.MICROPHONE_SIDEBAR_LEFT]: {
    label: 'Microphone Test - Left Sidebar',
    description: 'Sticky ad on the left sidebar of microphone test page (desktop only)',
  },
  [AD_SLOT_NAMES.MICROPHONE_SIDEBAR_RIGHT]: {
    label: 'Microphone Test - Right Sidebar',
    description: 'Sticky ad on the right sidebar of microphone test page (desktop only)',
  },
  [AD_SLOT_NAMES.MICROPHONE_BELOW_TOOL]: {
    label: 'Microphone Test - Below Tool',
    description: 'Ad displayed below the microphone testing tool',
  },
  [AD_SLOT_NAMES.MICROPHONE_ABOVE_FOOTER]: {
    label: 'Microphone Test - Above Footer',
    description: 'Full-width ad above the footer on microphone test page',
  },
  [AD_SLOT_NAMES.BLOG_TOP_SECTION]: {
    label: 'Blog Post - Top Section',
    description: 'Ad displayed at the top of blog posts, before content',
  },
  [AD_SLOT_NAMES.BLOG_MIDDLE_SECTION]: {
    label: 'Blog Post - Middle Section',
    description: 'Ad displayed in the middle of blog posts',
  },
  [AD_SLOT_NAMES.BLOG_BOTTOM_SECTION]: {
    label: 'Blog Post - Bottom Section',
    description: 'Ad displayed at the bottom of blog posts, after content',
  },
  [AD_SLOT_NAMES.REVIEW_TOP_SECTION]: {
    label: 'Review - Top Section',
    description: 'Ad displayed at the top of reviews, before content',
  },
  [AD_SLOT_NAMES.REVIEW_MIDDLE_SECTION]: {
    label: 'Review - Middle Section',
    description: 'Ad displayed in the middle of reviews',
  },
  [AD_SLOT_NAMES.REVIEW_BOTTOM_SECTION]: {
    label: 'Review - Bottom Section',
    description: 'Ad displayed at the bottom of reviews, after content',
  },
};
