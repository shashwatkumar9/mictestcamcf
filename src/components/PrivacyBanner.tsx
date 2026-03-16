import type { Dictionary } from '@/lib/getDictionary';

interface PrivacyBannerProps {
  dictionary: Dictionary;
}

export function PrivacyBanner({ dictionary }: PrivacyBannerProps) {
  return (
    <div className="bg-green-50 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-center gap-2 text-green-700">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{dictionary.privacy.banner}</span>
        </div>
      </div>
    </div>
  );
}
