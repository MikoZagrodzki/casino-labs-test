import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TokenListProvider } from '@/context/tokensContext';
import { Toaster } from 'react-hot-toast';
import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';
import Navbar from './components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Degen Terminal',
  description: 'Casino Labs Test - Mikolaj Zagrodzki',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Read locale from cookie
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value;
  // Fallback to 'en' if no cookie is set
  const locale = cookieLocale || 'en';

  const messages = (await import(`../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
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
