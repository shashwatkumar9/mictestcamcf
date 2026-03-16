import Link from 'next/link';
import type { Dictionary } from '@/lib/getDictionary';

interface FooterProps {
  dictionary: Dictionary;
  lang: string;
}

export function Footer({ dictionary, lang }: FooterProps) {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href={`/${lang}`} className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MicTestCam</span>
            </Link>
            <p className="text-gray-600 text-sm max-w-md">
              {dictionary.footer.tagline}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-600">{dictionary.privacy.banner}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${lang}/free-webcam-test`} className="text-gray-600 hover:text-indigo-600 text-sm">
                  {dictionary.nav.webcamTest}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/free-microphone-test`} className="text-gray-600 hover:text-indigo-600 text-sm">
                  {dictionary.nav.microphoneTest}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/reviews`} className="text-gray-600 hover:text-indigo-600 text-sm">
                  {dictionary.nav.reviews}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/blog`} className="text-gray-600 hover:text-indigo-600 text-sm">
                  {dictionary.footer.blog}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${lang}/privacy`} className="text-gray-600 hover:text-indigo-600 text-sm">
                  {dictionary.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/terms`} className="text-gray-600 hover:text-indigo-600 text-sm">
                  {dictionary.footer.terms}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`} className="text-gray-600 hover:text-indigo-600 text-sm">
                  {dictionary.footer.contact}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {dictionary.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
