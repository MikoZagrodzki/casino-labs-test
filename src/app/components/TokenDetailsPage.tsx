'use client';
import { useTokenList } from '@/context/tokensContext';
import type { CoinDetails } from '@/types/types';
import Image from 'next/image';
import { useState } from 'react';

type Props = { data: CoinDetails };

export default function TokenDetailsPage({ data }: Props) {
  // Use the context to get the current page for navigation
  const { currentPage } = useTokenList();

  const [coin, setCoin] = useState(data);

  // Helper to format big numbers (fixed 'en-US' locale is hydration-safe)
  function formatNumber(num: number | null | undefined, opts: Intl.NumberFormatOptions = {}) {
    if (num === null || num === undefined || isNaN(num)) return '—';
    return num.toLocaleString('en-US', opts); // FIXED locale for SSR/CSR match
  }

  // Hydration-safe date format (YYYY-MM-DD)
  function formatDate(date: string | undefined) {
    if (!date) return '—';
    const d = new Date(date);
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
  }

  // Handle homepage/blockchain links
  const homepage = coin.links?.homepage?.[0];
  const blockchainSite = coin.links?.blockchain_site?.[0];

  // Sparkline
  const sparkline = coin.market_data?.sparkline_7d?.price;

  return (
    <div className='max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-10'>
      {/* Header */}
      <div className='flex items-center gap-4 mb-4'>
        {coin.image?.large && (
          <Image src={coin.image.large} alt={coin.name} width={48} height={48} className='rounded-full' style={{ background: '#f4f4f4' }} />
        )}
        <div>
          <h1 className='text-2xl font-bold'>
            {coin.name} <span className='text-gray-400 uppercase text-lg'>{coin.symbol}</span>
          </h1>
          {coin.market_cap_rank && <p className='text-xs text-gray-500'>Rank #{coin.market_cap_rank}</p>}
        </div>
      </div>

      {/* Price & Stats */}
      <div className='mb-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2'>
        <div>
          <b>Current Price:</b> ${formatNumber(coin.market_data?.current_price?.usd, { maximumFractionDigits: 8 })}
        </div>
        <div>
          <b>Market Cap:</b> ${formatNumber(coin.market_data?.market_cap?.usd)}
        </div>
        <div>
          <b>24h Change:</b>{' '}
          <span className={(coin.market_data?.price_change_percentage_24h ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
            {coin.market_data?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </div>
        <div>
          <b>Total Supply:</b> {formatNumber(coin.market_data?.total_supply)}
        </div>
        <div>
          <b>Circulating Supply:</b> {formatNumber(coin.market_data?.circulating_supply)}
        </div>
        <div>
          <b>All-Time High:</b> ${formatNumber(coin.market_data?.ath?.usd)}{' '}
          <span className='text-xs text-gray-500'>({formatDate(coin.market_data?.ath_date?.usd)})</span>
        </div>
        <div>
          <b>All-Time Low:</b> ${formatNumber(coin.market_data?.atl?.usd)}{' '}
          <span className='text-xs text-gray-500'>({formatDate(coin.market_data?.atl_date?.usd)})</span>
        </div>
        <div>
          <b>Genesis Date:</b> {formatDate(coin.genesis_date)}
        </div>
        <div>
          <b>Categories:</b> {coin.categories && coin.categories.length > 0 ? coin.categories.join(', ') : '—'}
        </div>
        <div>
          <b>Sentiment:</b> 👍 {coin.sentiment_votes_up_percentage ?? '—'}% &nbsp; 👎 {coin.sentiment_votes_down_percentage ?? '—'}%
        </div>
      </div>

      {/* Links */}
      <div className='mb-4'>
        <b>Links:</b>
        <ul className='list-disc ml-6 text-blue-600'>
          {homepage && (
            <li>
              <a href={homepage} target='_blank' rel='noopener noreferrer'>
                Website
              </a>
            </li>
          )}
          {blockchainSite && (
            <li>
              <a href={blockchainSite} target='_blank' rel='noopener noreferrer'>
                Blockchain Explorer
              </a>
            </li>
          )}
          {coin.links?.subreddit_url && (
            <li>
              <a href={coin.links.subreddit_url} target='_blank' rel='noopener noreferrer'>
                Reddit
              </a>
            </li>
          )}
          {coin.links?.twitter_screen_name && (
            <li>
              <a href={`https://twitter.com/${coin.links.twitter_screen_name}`} target='_blank' rel='noopener noreferrer'>
                Twitter
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* Sparkline Chart */}
      {sparkline && sparkline.length > 0 && (
        <div className='mb-6'>
          <b>Price Last 7d:</b>
          <svg width='200' height='40'>
            <polyline
              fill='none'
              stroke='#7c3aed'
              strokeWidth='2'
              points={sparkline
                .map(
                  (price, i) =>
                    `${(i / (sparkline.length - 1)) * 200},${
                      40 - ((price - Math.min(...sparkline)) / (Math.max(...sparkline) - Math.min(...sparkline) || 1)) * 30
                    }`
                )
                .join(' ')}
            />
          </svg>
        </div>
      )}

      {/* Description */}
      {coin.description?.en && (
        <div className='prose prose-sm max-w-none mb-4'>
          <b>Description:</b>
          <div dangerouslySetInnerHTML={{ __html: coin.description.en }} />
        </div>
      )}

      <a
        href={currentPage ? `/tokens/${currentPage}` : '/tokens/1'}
        className='inline-block mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      >
        ← Back to list
      </a>
    </div>
  );
}
