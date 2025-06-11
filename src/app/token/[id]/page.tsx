import { Suspense } from 'react';
import TokensLoading from '@/app/components/TokensLoading';
import { notFound } from 'next/navigation';
import { fetchCoinDetails } from '@/lib/fetchCoinDetails';
import TokenDetailsPage from '@/app/components/TokenDetailsPage';

import type { CoinDetails } from '@/types/types';

type PageProps = { params: Promise<{ id: string }> };


export default async function Page({ params }: PageProps) {
  // Await params in case they are a Promise
  // params is not a Promise (Vercel stable)
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
  } catch {
    // If the fetch fails, we can assume the coin does not exist or there was an error
    notFound();
  }

  return (
    <Suspense fallback={<TokensLoading />}>
      <TokenDetailsPage data={coin} />
    </Suspense>
  );
}
