import { NextResponse } from 'next/server';
import type { TrendingResponse } from '@/types/types';

export async function GET() {
  const url = 'https://api.coingecko.com/api/v3/search/trending';
  const apiKey = process.env.COINGECKO_API_KEY;
  const headers: Record<string, string> = { accept: 'application/json' };
  if (apiKey) headers['x-cg-demo-api-key'] = apiKey;

  try {
    const res = await fetch(url, { headers, cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json<{ error: string }>({ error: `CoinGecko responded with status ${res.status}` }, { status: res.status });
    }
    const data: TrendingResponse = await res.json();
    return NextResponse.json<TrendingResponse>(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Server error fetching trending coins.';
    return NextResponse.json<{ error: string }>({ error: message }, { status: 500 });
  }
}
