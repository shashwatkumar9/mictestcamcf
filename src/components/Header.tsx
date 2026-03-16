'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { Dictionary } from '@/lib/getDictionary';

interface HeaderProps {
  dictionary: Dictionary;
}

export function Header({ dictionary }: HeaderProps) {
  const params = useParams();
  const pathname = usePathname();
  const lang = params.lang as string;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    const currentPath = pathname.replace(`/${lang}`, '') || '/';
    return currentPath === path;
  };

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu();
    };
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobileMenuOpen, closeMobileMenu]);

  const navLinks = [
    { href: `/${lang}`, label: dictionary.nav.home, path: '/' },
    { href: `/${lang}/free-webcam-test`, label: dictionary.nav.webcamTest, path: '/free-webcam-test' },
    { href: `/${lang}/free-microphone-test`, label: dictionary.nav.microphoneTest, path: '/free-microphone-test' },
    { href: `/${lang}/reviews`, label: dictionary.nav.reviews, path: '/reviews', startsWith: true },
    { href: `/${lang}/blog`, label: dictionary.nav.blog, path: '/blog', startsWith: true },
  ];

  const getLinkClass = (link: typeof navLinks[0]) => {
    const active = link.startsWith
      ? isActive(link.path) || pathname.startsWith(`/${lang}${link.path}`)
      : isActive(link.path);
    return active ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MicTestCam</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.href}
                className={`text-sm font-medium transition-colors ${getLinkClass(link)}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-100 py-3 pb-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    getLinkClass(link) === 'text-indigo-600'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
