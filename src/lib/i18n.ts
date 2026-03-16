export const locales = [
  // Base languages
  'en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'pl', 'ru', 'ja',
  'ko', 'zh', 'ar', 'hi', 'tr', 'vi', 'th', 'id', 'ms', 'sv',
  'no', 'da', 'fi', 'cs',
  // Regional variants
  'pt-br', 'es-mx', 'zh-cn', 'zh-tw', 'en-gb', 'fr-ca',
  // Additional languages
  'fa', 'uk', 'bn', 'ur', 'tl', 'ro', 'hu', 'he', 'el', 'bg',
  'sk', 'hr', 'lt', 'sr', 'ca'
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  // Base languages
  en: 'English (US)',
  es: 'Español (España)',
  fr: 'Français (France)',
  de: 'Deutsch (Deutschland)',
  it: 'Italiano (Italia)',
  pt: 'Português (Portugal)',
  nl: 'Nederlands (Nederland)',
  pl: 'Polski (Polska)',
  ru: 'Русский (Россия)',
  ja: '日本語 (日本)',
  ko: '한국어 (대한민국)',
  zh: '中文 (中国)',
  ar: 'العربية (السعودية)',
  hi: 'हिन्दी (भारत)',
  tr: 'Türkçe (Türkiye)',
  vi: 'Tiếng Việt (Việt Nam)',
  th: 'ไทย (ประเทศไทย)',
  id: 'Bahasa Indonesia (Indonesia)',
  ms: 'Bahasa Melayu (Malaysia)',
  sv: 'Svenska (Sverige)',
  no: 'Norsk (Norge)',
  da: 'Dansk (Danmark)',
  fi: 'Suomi (Suomi)',
  cs: 'Čeština (Česko)',
  // Regional variants
  'pt-br': 'Português (Brasil)',
  'es-mx': 'Español (México)',
  'zh-cn': '简体中文 (中国)',
  'zh-tw': '繁體中文 (台灣)',
  'en-gb': 'English (UK)',
  'fr-ca': 'Français (Canada)',
  // Additional languages
  fa: 'فارسی (ایران)',
  uk: 'Українська (Україна)',
  bn: 'বাংলা (বাংলাদেশ)',
  ur: 'اردو (پاکستان)',
  tl: 'Tagalog (Pilipinas)',
  ro: 'Română (România)',
  hu: 'Magyar (Magyarország)',
  he: 'עברית (ישראל)',
  el: 'Ελληνικά (Ελλάδα)',
  bg: 'Български (България)',
  sk: 'Slovenčina (Slovensko)',
  hr: 'Hrvatski (Hrvatska)',
  lt: 'Lietuvių (Lietuva)',
  sr: 'Српски (Србија)',
  ca: 'Català (Catalunya)'
};

export const localeFlags: Record<Locale, string> = {
  // Base languages
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹',
  nl: '🇳🇱',
  pl: '🇵🇱',
  ru: '🇷🇺',
  ja: '🇯🇵',
  ko: '🇰🇷',
  zh: '🇨🇳',
  ar: '🇸🇦',
  hi: '🇮🇳',
  tr: '🇹🇷',
  vi: '🇻🇳',
  th: '🇹🇭',
  id: '🇮🇩',
  ms: '🇲🇾',
  sv: '🇸🇪',
  no: '🇳🇴',
  da: '🇩🇰',
  fi: '🇫🇮',
  cs: '🇨🇿',
  // Regional variants
  'pt-br': '🇧🇷',
  'es-mx': '🇲🇽',
  'zh-cn': '🇨🇳',
  'zh-tw': '🇹🇼',
  'en-gb': '🇬🇧',
  'fr-ca': '🇨🇦',
  // Additional languages
  fa: '🇮🇷',
  uk: '🇺🇦',
  bn: '🇧🇩',
  ur: '🇵🇰',
  tl: '🇵🇭',
  ro: '🇷🇴',
  hu: '🇭🇺',
  he: '🇮🇱',
  el: '🇬🇷',
  bg: '🇧🇬',
  sk: '🇸🇰',
  hr: '🇭🇷',
  lt: '🇱🇹',
  sr: '🇷🇸',
  ca: '🏴'
};
