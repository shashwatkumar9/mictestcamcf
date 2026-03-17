import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

// Admin routes use Cloudflare D1 which is only available at request time
export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin - MicTestCam',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-950 text-white antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
