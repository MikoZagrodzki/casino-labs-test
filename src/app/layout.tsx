import type { Metadata } from 'next';
import './globals.css';
import { TokenListProvider } from '@/context/tokensContext';
import { Toaster } from 'react-hot-toast';
import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';
import Navbar from './components/Navbar';


export const metadata: Metadata = {
  metadataBase: new URL('https://casino-labs-test.vercel.app'),
  title: 'Degen Terminal',
  description: 'Casino Labs Test - Mikolaj Zagrodzki',
  openGraph: {
    images: [
      {
        url: '/images/og-image.png',
        alt: 'Degen Terminal',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get locale from cookies as before
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value;
  // Fallback to 'en' if no cookie is set
  const locale = cookieLocale || 'en';

  const messages = (await import(`../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body className={` antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TokenListProvider>
            <Navbar />
            {children}
            <Toaster position='bottom-right' />
          </TokenListProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
