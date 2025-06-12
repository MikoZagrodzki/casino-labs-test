import { Suspense } from 'react';
import TokensLoading from '@/app/components/TokensLoading';
import TokensTable from '@/app/components/TokensTable';
import { fetchTokens } from '@/lib/fetchTokens';
import type { Token } from '@/types/types';
import { getTranslations } from 'next-intl/server';
import Header from '@/app/components/Header';
import TrendingMarquee from '@/app/components/TrendingMarquee';

// Page main container
function PageContent({ children }: { children: React.ReactNode }) {
  return <div className='flex flex-col items-center w-screen overflow-x-hidden'>{children}</div>;
}

type PageProps = { params: Promise<{ page: string }> };
export default async function Page({ params }: PageProps) {
  // Translations
  const t = await getTranslations('fetch');
  // Await params in case they are a Promise
  // params is not a Promise (Vercel stable)
  const { page } = await params;
  const pageNum = Number(page) || 1;
  let initialTokens: Token[] = [];
  let isInitialRateLimit = false;

  try {
    initialTokens = await fetchTokens({ page: pageNum, perPage: 15 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error';
    if (/429/.test(message) || message.toLowerCase().includes('rate limit')) {
      isInitialRateLimit = true;
      return (
        <Suspense
          fallback={
            <PageContent>
              <Header />
              <TokensLoading />
            </PageContent>
          }
        >
          <PageContent>
            <Header />
            <TrendingMarquee />
            <TokensTable initialTokens={[]} isInitialRateLimit={isInitialRateLimit} />
          </PageContent>
        </Suspense>
      );
    }
    return <div className='text-center text-red-600 py-10'>{t('error')}</div>;
  }

  return (
    <Suspense
      fallback={
        <PageContent>
          <Header />
          <TokensLoading />
        </PageContent>
      }
    >
      <PageContent>
        <Header />
        <TrendingMarquee />
        <TokensTable initialTokens={initialTokens} />
      </PageContent>
    </Suspense>
  );
}
