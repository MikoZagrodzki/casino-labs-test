'use client';
import React, { useEffect, useState } from 'react';
import { Token } from '@/types/types';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import Image from 'next/image';
import { useTokenList } from '@/context/tokensContext';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';


const MAX_PAGE = 250;

type PaginationProps = {
  currentPage: number;
  maxPage: number;
  onPageChange: (page: number) => void;
};

function Pagination({ currentPage, maxPage, onPageChange }: PaginationProps) {
  // Pagination: always show 1, 2-3 before and after current, last

  // Always show first page
  const pages: (number | string)[] = [1];

  if (currentPage > 4) {
    pages.push('...');
  }

  // Show 2 pages before, current, 2 pages after
  for (let i = Math.max(2, currentPage - 2); i <= Math.min(maxPage - 1, currentPage + 2); i++) {
    pages.push(i);
  }

  if (currentPage < maxPage - 3) {
    pages.push('...');
  }

  // Always show last page, if >1
  if (maxPage > 1) pages.push(maxPage);

  // Translations
  const t = useTranslations('pagination');

  return (
    <div className='flex items-center justify-center gap-2 py-4 px-2'>
      <button
        className='text-black px-2'
        // On click, change to previous page, but not going below 1
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label={t('ariaPrevious')}
      >
        &lt;
      </button>
      {pages.map((page, idx) =>
        typeof page === 'number' ? (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg text-lg font-semibold ${
              page === currentPage ? 'bg-black/10 text-black/75' : 'hover:bg-gray-100 text-gray-900'
            }`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${idx}`} className='px-1 text-xl text-gray-400'>
            ...
          </span>
        )
      )}
      <button
        className='text-black px-2'
        // On click, change to next page, but not exceeding maxPage
        onClick={() => onPageChange(Math.min(maxPage, currentPage + 1))}
        disabled={currentPage === maxPage}
        aria-label={t('ariaNext')}
      >
        &gt;
      </button>
    </div>
  );
}

type TokensTableProps = {
  initialTokens: Token[];
  isInitialRateLimit?: boolean;
};

export default function TokensTable({ initialTokens, isInitialRateLimit = false }: TokensTableProps) {
  // Translations
  const t = useTranslations('tokensTable');
  // Use Next.js router and params to handle page changes
  const router = useRouter();
  // Use Next.js params to get the current page from the URL
  const params = useParams();
  const urlPage = Number(params?.page) || 1;

  // Use context to get tokens and loading state
  const { tokens, loading, fetchTokens } = useTokenList();
  // State to handle client-side retrying
  const [clientRetrying, setClientRetrying] = useState(false);
  // State to handle if we have recovered from initial rate limit
  const [hasRecovered, setHasRecovered] = useState(false);

  // If initial rate limit we will retry fetching tokens on client side
  // This is to handle cases where the initial fetch fails due to rate limiting
  // and we want to retry fetching tokens after the component mounts
  // This will only run once on mount
  useEffect(() => {
    if (isInitialRateLimit && (!tokens || tokens.length === 0)) {
      setClientRetrying(true);
      fetchTokens(urlPage, 15)
        .then(() => {
          setHasRecovered(true);
        })
        .finally(() => setClientRetrying(false));
    }
  }, []);

  useEffect(() => {
    // Only fetch if urlPage changed, and NOT during SSR initial rate limit retry
    if (!isInitialRateLimit || hasRecovered) {
      fetchTokens(urlPage, 15);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPage]);

  // Handle manual retry button click
  // This is used to retry fetching tokens if the retry logic ran out of retries
  function handleManualRetry() {
    setClientRetrying(true);
    fetchTokens(urlPage, 15).finally(() => setClientRetrying(false));
  }

  // Show spinner if retrying or loading
  if (clientRetrying) {
    return (
      <div className='flex flex-col items-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4' />
        <p className='text-blue-700 font-medium'>{t('retrying')}</p>
      </div>
    );
  }

  // Show error with manual retry if still failing after retry
  if (isInitialRateLimit && (!tokens || tokens.length === 0) && !loading) {
    return (
      <div className='flex flex-col items-center py-8'>
        <p className='text-red-700 font-medium mb-2'>{t('rateLimitError')}</p>
        <button onClick={handleManualRetry} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2'>
          {t('retry')}
        </button>
      </div>
    );
  }

  // Fetch tokens for the new page
  function handlePageChange(page: number) {
    // If the page is the same as the current URL page, do nothing
    if (page !== urlPage) {
      router.push(`/tokens/${page}`);
    }
  }

  // Format numbers with decimals or short notation
  function formatDecimals(value: number | string): string {
    // Convert to number if its a string
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    return value % 1 === 0 ? value.toString() : value.toFixed(2).toString();
  }

  // Format numbers with short notation
  function formatNumberShort(value: number | string): string {
    // Convert to number if its a string
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    // Add apropriate suffixes for large numbers
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + 'B';
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(2).replace(/\.00$/, '') + 'K';
    return value.toString();
  }

  // If no tokens are available, show initial tokens
  const displayTokens = tokens.length > 0 ? tokens : initialTokens;

  return (
    <div className='overflow-auto max-h-[80dvh] lg:max-h-fit w-full max-w-7xl  shadow-lg rounded-b-2xl flex flex-col '>
      <table className='min-w-max  table table-fixed '>
        <thead>
          <tr className='bg-gray-50 text-xs sm:text-base'>
            <th className='sticky left-0 top-0 bg-gray-50 z-20 px-4 py-2 text-left w-[170px]'>{t('coin')}</th>
            {[t('price'), t('marketCap'), t('24h'), t('last7Days')].map((cell) => {
              return (
                <th key={cell} className='px-4 py-2 text-right sticky top-0 bg-gray-50 whitespace-nowrap min-w-[100px]'>
                  {cell}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {displayTokens.map((coin, index) => (
            <tr
              key={coin.id}
              className='border-b border-black/20 last:border-0 cursor-pointer hover:bg-[#f5f5ff] duration-300 group '
              onClick={() => router.push(`/token/${coin.id}`)}
              tabIndex={index}
              aria-label={t('viewDetails', { coin: coin.name })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') router.push(`/token/${coin.id}`);
              }}
            >
              <td className='sticky left-0 bg-white z-10  px-4 py-2 group-hover:bg-[#f5f5ff] duration-300 '>
                <div className='flex items-center gap-2'>
                  <Image
                    src={coin.image || '/images/token-placeholder.png'}
                    alt={`${coin.name} icon`}
                    width={24}
                    height={24}
                    className='object-cover mr-2 '
                  />
                  <div className='flex flex-col'>
                    <span className='font-semibold text-gray-900 overflow-hidden whitespace-nowrap text-ellipsis max-w-[120px] lg:max-w-[200px]'>
                      {coin.name}
                    </span>
                    <p className='text-gray-500 uppercase text-sm overflow-hidden '>{coin.symbol}</p>
                  </div>
                </div>
              </td>

              <td className='px-4 py-2 text-right bg-white group-hover:bg-[#f5f5ff] duration-300 text-gray-900'>
                ${formatDecimals(coin.current_price)}
              </td>

              <td className='px-4 py-2 text-right bg-white group-hover:bg-[#f5f5ff] duration-300 text-gray-900  '>
                ${formatNumberShort(coin.market_cap)}
              </td>

              <td
                className={`px-4 py-2 text-right bg-white group-hover:bg-[#f5f5ff] duration-300 font-semibold ${
                  coin.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatDecimals(coin.price_change_24h)}%
              </td>

              <td className='px-4 py-2 text-right text-gray-900 bg-white group-hover:bg-[#f5f5ff] duration-300 '>
                {/* Render sparkline if available, otherwise show placeholder */}
                {coin.sparkline_in_7d?.price && coin.sparkline_in_7d.price.length > 1 ? (
                  <Sparklines data={coin.sparkline_in_7d.price} width={80} height={24} margin={0}>
                    <SparklinesLine
                      color={
                        coin.sparkline_in_7d.price[coin.sparkline_in_7d.price.length - 1] >= coin.sparkline_in_7d.price[0] ? '#16a34a' : '#dc2626'
                      }
                      style={{ strokeWidth: 0.7, fill: 'none' }}
                    />
                  </Sparklines>
                ) : (
                  <span className='text-gray-400'>{t('noData')}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination component to handle page changes */}
      <Pagination currentPage={urlPage} maxPage={MAX_PAGE} onPageChange={handlePageChange} />
    </div>
  );
}
