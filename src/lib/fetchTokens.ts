import { Token } from '@/types/types';

const tokenCache: Record<string, { data: Token[]; ts: number }> = {};
const CACHE_TTL = 30 * 1000; // 30 seconds

type FetchTokensParams = {
  page?: number;
  perPage?: number;
};
export async function fetchTokens({ page = 1, perPage = 10 }: FetchTokensParams = {}): Promise<Token[]> {
  const cacheKey = `${page}:${perPage}`;
  const now = Date.now();

  // Try cache first
  if (tokenCache[cacheKey] && now - tokenCache[cacheKey].ts < CACHE_TTL) {
    return tokenCache[cacheKey].data;
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
    url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true`;
  } else {
    url = `/api/tokens?page=${page}&perPage=${perPage}`;
  }

  try {
    const res = await fetch(url, {
      headers,
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch tokens. Status: ${res.status}`);
    }
    // Parse the response as Token array
    const data = (await res.json()) as Token[];
    tokenCache[cacheKey] = { data, ts: now };
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
