'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = (params.lang as Locale) || 'en';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLocalePath = (newLocale: Locale) => {
    // Handle the path replacement properly
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${currentLocale}(/|$)`), '/');
    const cleanPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale;
    return `/${newLocale}${cleanPath}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Select language"
      >
        <span className="text-xl">{localeFlags[currentLocale]}</span>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {localeNames[currentLocale]}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 max-h-80 overflow-y-auto z-[100]">
          {locales.map((locale) => (
            <Link
              key={locale}
              href={getLocalePath(locale)}
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                locale === currentLocale ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
              }`}
            >
              <span className="text-xl">{localeFlags[locale]}</span>
              <span className="text-sm font-medium">{localeNames[locale]}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
