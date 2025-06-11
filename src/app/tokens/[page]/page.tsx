import { Suspense } from 'react';
import TokensLoading from '@/app/components/TokensLoading';
import TokensTable from '@/app/components/TokensTable';
import { fetchTokens } from '@/lib/fetchTokens';
import type { Token } from '@/types/types';
import { getTranslations } from 'next-intl/server';

type PageProps = { params: { page: string } };

export default async function Page({ params }: PageProps) {
  // Translations
  const t = await getTranslations('fetch');
  // Await params in case they are a Promise
  const awaitedParams = await params;
  const pageNum = Number(awaitedParams.page) || 1;
  let initialTokens: Token[] = [];
  let isInitialRateLimit = false;

  try {
    initialTokens = await fetchTokens({ page: pageNum, perPage: 15 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error';
    if (/429/.test(message) || message.toLowerCase().includes('rate limit')) {
      isInitialRateLimit = true;
      return (
        <Suspense fallback={<TokensLoading />}>
          <TokensTable initialTokens={[]} isInitialRateLimit />
        </Suspense>
      );
    }
    return <div className='text-center text-red-600 py-10'>{t('error')}</div>;
  }

  return (
    <Suspense fallback={<TokensLoading />}>
      <TokensTable initialTokens={initialTokens} />
    </Suspense>
  );
}
