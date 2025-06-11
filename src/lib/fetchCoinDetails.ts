import { CoinDetails } from '@/types/types';

const detailsCache: Record<string, { data: CoinDetails; ts: number }> = {};
const CACHE_TTL = 30 * 1000; // 30 seconds

type FetchCoinDetailsOptions = {
  sparkline?: boolean;
};
export async function fetchCoinDetails(id: string, options: FetchCoinDetailsOptions = {}): Promise<CoinDetails> {
  const sparkline = options.sparkline ? 'true' : 'false';
  const cacheKey = `${id}:${sparkline}`;
  const now = Date.now();

  // Try cache first
  if (detailsCache[cacheKey] && now - detailsCache[cacheKey].ts < CACHE_TTL) {
    return detailsCache[cacheKey].data;
  }

  let url: string;
  // Check if we are in a server environment
  const isServer = typeof window === 'undefined';
  const apiKey = isServer ? process.env.COINGECKO_API_KEY : undefined;
  // Always use a plain object for headers
  const headers: Record<string, string> = { accept: 'application/json' };
  if (isServer && apiKey) {
    headers['x-cg-demo-api-key'] = apiKey;
  }
  // Determine the URL based on server or client context
  if (isServer) {
    url = `https://api.coingecko.com/api/v3/coins/${id}?sparkline=${sparkline}`;
  } else {
    url = `/api/token/${id}?sparkline=${sparkline}`;
  }

  try {
    const res = await fetch(url, {
      headers,
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch coin details. Status: ${res.status}`);
    }
    // Parse the response as CoinDetails type
    const data = (await res.json()) as CoinDetails;
    detailsCache[cacheKey] = { data, ts: now };
    return data;
  } catch (err: unknown) {
    if (err instanceof TypeError) {
      throw new Error('Network error or CORS blocked the request.');
    }
    // If it's already an Error, just throw it
    if (err instanceof Error) {
      throw err;
    }
    // If it's a string or something else, wrap it
    throw new Error(typeof err === 'string' ? err : 'Unknown error occurred while fetching tokens.');
  }
}
