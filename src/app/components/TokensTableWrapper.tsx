import { fetchTokens } from '@/lib/fetchTokens';
import { Token } from '@/types/types';
import TokensTable from './TokensTable';

type PageProps = {
  page?: number;
};

export default async function TokensTableWrapper({ page = 1 }: PageProps) {
  let initialTokens: Token[] = [];
  let isInitialRateLimit = false;
  try {
    // Fetches tokens on server
    initialTokens = await fetchTokens({ page: page, perPage: 15 });
  } catch (err: unknown) {
    // Handle rate limit errors
    const message = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error';
    if (/429/.test(message) || message.toLowerCase().includes('rate limit')) {
      isInitialRateLimit = true;
      // Pass the flag to TokensTable for client side handling
      return <TokensTable initialTokens={[]} isInitialRateLimit />;
    }
    // Handle other errors
    return <div className='text-center text-red-600 py-10'>Error fetching tokens. Please try again later.</div>;
  }
  // Normal path: tokens loaded on server
  return <TokensTable initialTokens={initialTokens} />;
}
