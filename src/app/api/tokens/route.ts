import { Token } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Parse query params for page/perPage
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('perPage') || '15';

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true`;

    const apiKey = process.env.COINGECKO_API_KEY;

  try {
     const res = await fetch(url, {
      headers: {
        accept: 'application/json',
        ...(apiKey && { 'x-cg-demo-api-key': apiKey }), // Only add if present
      },
    });

    // Proxy the CoinGecko status code to the frontend
    const data: Token[] = await res.json();

    return NextResponse.json<Token[]>(data, { status: res.status });
  } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Server error contacting CoinGecko.";
      return NextResponse.json<{ error: string }>({ error: message }, { status: 500 });
  }
}
