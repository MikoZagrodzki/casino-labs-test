import { Token } from '../types/types';

const tokenCache: Record<string, { data: Token[]; ts: number }> = {};
const CACHE_TTL = 30 * 1000; // 30 seconds

async function fetchWith429Retry(url: string, options: RequestInit, maxRetries = 2): Promise<Response> {
  let attempt = 0;
  let delay = 1000;
  while (attempt <= maxRetries) {
    const res = await fetch(url, options);
    if (res.status !== 429) return res;
    // Rate limited, wait and retry
    await new Promise((r) => setTimeout(r, delay));
    delay *= 2; // backoff
    attempt++;
  }
  throw new Error('Too many requests (429) — max retries exceeded.');
}

export async function fetchTokens({ page = 1, perPage = 10 }: { page?: number; perPage?: number }): Promise<Token[]> {
  const cacheKey = `${page}:${perPage}`;
  const now = Date.now();

  // Try cache first
  if (tokenCache[cacheKey] && now - tokenCache[cacheKey].ts < CACHE_TTL) {
    return tokenCache[cacheKey].data;
  }

  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true`;
    const res = await fetchWith429Retry(url, { headers: { accept: 'application/json' }, cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch tokens. Status: ${res.status}`);
    const data = (await res.json()) as Token[];
    tokenCache[cacheKey] = { data, ts: now };
    return data;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
}
