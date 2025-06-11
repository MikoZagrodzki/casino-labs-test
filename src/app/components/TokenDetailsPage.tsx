'use client';
import { useTokenList } from '@/context/tokensContext';
import type { CoinDetails } from '@/types/types';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

type Props = { data: CoinDetails };

export default function TokenDetailsPage({ data }: Props) {
  // Translations
  const t = useTranslations('tokenDetails');
  // Use the context to get the current page for navigation
  const { currentPage } = useTokenList();

  // Helper to format big numbers (fixed 'en-US' locale is hydration-safe)
  function formatNumber(num: number | null | undefined, opts: Intl.NumberFormatOptions = {}) {
    if (num === null || num === undefined || isNaN(num)) return t('noData');
    return num.toLocaleString('en-US', opts); // FIXED locale for SSR/CSR match
  }

  // Hydration-safe date format (YYYY-MM-DD)
  function formatDate(date: string | undefined) {
    if (!date) return t('noData');
    const d = new Date(date);
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
  }

  // Handle homepage/blockchain links
  const homepage = data.links?.homepage?.[0];
  const blockchainSite = data.links?.blockchain_site?.[0];

  // Sparkline
  const sparkline = data.market_data?.sparkline_7d?.price;

  return (
    <div className='flex flex-col items-start max-w-4xl mx-auto  p-6 mt-10 gap-6 '>
      {/* Header */}
      <div className='flex items-center gap-4'>
        {data.image?.large && (
          <Image src={data.image.large} alt={data.name} width={48} height={48} className='rounded-full' style={{ background: '#f4f4f4' }} />
        )}
        <div>
          <h1 className='text-2xl font-bold'>
            {data.name} <span className='text-gray-400 uppercase text-lg'>{data.symbol}</span>
          </h1>
          {data.market_cap_rank && <p className='text-xs text-gray-500'>{t('rank', { rank: data.market_cap_rank })}</p>}
        </div>
      </div>

      {/* Price & Stats */}
      <div className=' flex flex-col lg:flex-row gap-4 '>

        <div className='flex flex-col  gap-2 w-full lg:w-1/2'>
          <p>
            <b>{t('currentPrice')}:</b> ${formatNumber(data.market_data?.current_price?.usd, { maximumFractionDigits: 8 })}
          </p>
          <p>
            <b>{t('marketCap')}:</b> ${formatNumber(data.market_data?.market_cap?.usd)}
          </p>
          <p>
            <b>{t('change24h')}:</b>
            <span className={(data.market_data?.price_change_percentage_24h ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
              {data.market_data?.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </p>
          <p>
            <b>{t('totalSupply')}:</b> {formatNumber(data.market_data?.total_supply)}
          </p>
          <p>
            <b>{t('circulatingSupply')}:</b> {formatNumber(data.market_data?.circulating_supply)}
          </p>
        </div>

        <div className='flex flex-col  gap-2 w-full lg:w-1/2'>
          <p>
            <b>{t('allTimeHigh')}:</b> ${formatNumber(data.market_data?.ath?.usd)}
            <span className='text-xs text-gray-500 ml-1'>({formatDate(data.market_data?.ath_date?.usd)})</span>
          </p>
          <p>
            <b>{t('allTimeLow')}:</b> ${formatNumber(data.market_data?.atl?.usd)}{' '}
            <span className='text-xs text-gray-500 ml-1'>({formatDate(data.market_data?.atl_date?.usd)})</span>
          </p>
          <p>
            <b>{t('genesisDate')}:</b> {formatDate(data.genesis_date)}
          </p>
          <p>
            <b>{t('categories')}:</b> {data.categories && data.categories.length > 0 ? data.categories.join(', ') : t('noData')}
          </p>
          <p>
            <b>{t('sentiment')}:</b> 👍 {data.sentiment_votes_up_percentage ?? t('noData')}% &nbsp; 👎
            {data.sentiment_votes_down_percentage ?? t('noData')}%
          </p>
        </div>
      </div>

      <div className=' flex flex-col lg:flex-row gap-4 w-full'>
      {/* Links */}
        <div className='flex flex-col gap-2 w-full lg:w-1/2'>
          <b>{t('links')}:</b>
          <ul className='list-disc ml-6 text-blue-600'>
            {homepage && (
              <li>
                <a href={homepage} target='_blank' rel='noopener noreferrer'>
                  {t('website')}
                </a>
              </li>
            )}
            {blockchainSite && (
              <li>
                <a href={blockchainSite} target='_blank' rel='noopener noreferrer'>
                  {t('blockchainExplorer')}
                </a>
              </li>
            )}
            {data.links?.subreddit_url && (
              <li>
                <a href={data.links.subreddit_url} target='_blank' rel='noopener noreferrer'>
                  {t('reddit')}
                </a>
              </li>
            )}
            {data.links?.twitter_screen_name && (
              <li>
                <a href={`https://twitter.com/${data.links.twitter_screen_name}`} target='_blank' rel='noopener noreferrer'>
                  {t('twitter')}
                </a>
              </li>
            )}
          </ul>
        </div>
        {/* Sparkline Chart */}
        {sparkline && sparkline.length > 0 && (
          <div className=' w-full lg:w-1/2'>
            <b>{t('priceLast7d')}:</b>
            <svg width='100%' height='100%' viewBox={`0 0 200 50`} preserveAspectRatio='none'>
              <polyline
                fill='none'
                stroke={sparkline[sparkline.length - 1] >= sparkline[0] ? '#16a34a' : '#dc2626'}
                strokeWidth='1.1'
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
      </div>

      {/* Description */}
      {data.description?.en && (
        <div className='prose prose-sm text-justify-last-center  max-w-none mb-4'>
          <b>{t('description')}:</b>
          <div dangerouslySetInnerHTML={{ __html: data.description.en }} />
        </div>
      )}

      <a
        href={currentPage ? `/tokens/${currentPage}` : '/tokens/1'}
        className='inline-block mt-6 px-4 py-2 bg-black/80 text-white rounded hover:bg-black active:scale-95'
      >
        {t('backToList')}
      </a>
    </div>
  );
}
