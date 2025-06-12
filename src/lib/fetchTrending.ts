import { TrendingResponse } from "@/types/types";

const trendingCache: Record<string, { data: TrendingResponse; ts: number }> = {};
const CACHE_TTL = 30 * 1000; // 30 seconds

export async function fetchTrending(): Promise<TrendingResponse> {
  const now = Date.now();

  // Try cache first
  if (trendingCache['default'] && now - trendingCache['default'].ts < CACHE_TTL) {
    return trendingCache['default'].data;
  }

  const isServer = typeof window === 'undefined';
  const apiKey = isServer ? process.env.COINGECKO_API_KEY : undefined;
  const headers: Record<string, string> = { accept: 'application/json' };
  if (isServer && apiKey) headers['x-cg-demo-api-key'] = apiKey;

  const url = isServer
    ? 'https://api.coingecko.com/api/v3/search/trending'
    : '/api/trending';

  try {
    const res = await fetch(url, { headers, cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Trending fetch failed. Status: ${res.status}`);
    }
    const data = (await res.json()) as TrendingResponse;
    trendingCache['default'] = { data, ts: now };
    return data;
  } catch (err: unknown) {
    if (err instanceof TypeError) {
      throw new Error('Network error or CORS blocked the request.');
    }
    if (err instanceof Error) throw err;
    throw new Error(typeof err === 'string' ? err : 'Unknown error occurred while fetching trending.');
  }
}