import { NextRequest, NextResponse } from 'next/server';
import type { CoinDetails } from '@/types/types';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) {
    return NextResponse.json<{ error: string }>({ error: 'Coin ID is required' }, { status: 400 });
  }

  // Get params
  const { searchParams } = new URL(req.url);
  const sparkline = searchParams.get('sparkline') || 'false';

  const url = `https://api.coingecko.com/api/v3/coins/${id}?sparkline=${sparkline}`;

  const apiKey = process.env.COINGECKO_API_KEY;

  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json', ...(apiKey && { 'x-cg-demo-api-key': apiKey }) },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json<{ error: string }>({ error: `CoinGecko responded with status ${res.status}` }, { status: res.status });
    }

    // Parse the response as CoinDetails type
    const data: CoinDetails = await res.json();
    return NextResponse.json<CoinDetails>(data, { status: 200 });
  } catch (err: unknown) {
        const message =
            err instanceof Error
                ? err.message
                : typeof err === "string"
                ? err
                : "Server error fetching coin details.";
        return NextResponse.json<{ error: string }>({ error: message }, { status: 500 });  }
}
