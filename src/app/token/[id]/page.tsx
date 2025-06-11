import { Suspense } from 'react';
import TokensTableLoading from '@/app/components/TokensTableLoading';
import { notFound } from 'next/navigation';
import { fetchCoinDetails } from '@/lib/fetchCoinDetails';
import TokenDetailsPage from '@/app/components/TokenDetailsPage';

import type { CoinDetails } from '@/types/types';

type PageProps = { params: { id: string } };

export default async function Page({ params }: PageProps) {
  // Await params in case they are a Promise 
  const { id } = await params;
  const coinId = String(id || '').trim();

  // If no coinId is provided, redirect to 404
  if (!coinId) {
    notFound();
  }

  // Fetch coin details from the API
  let coin: CoinDetails | null = null;
  try {
    coin = await fetchCoinDetails(coinId, { sparkline: true });
  } catch (err: any) {
    // If the fetch fails, we can assume the coin does not exist or there was an error
    notFound();
  }

  return (
    <Suspense fallback={<TokensTableLoading />}>
      <TokenDetailsPage data={coin} />
    </Suspense>
  );
}
