'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TrendingResponse } from '@/types/types';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';


export default function TrendingMarquee() {
  const [trending, setTrending] = useState<TrendingResponse | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  // Translations
    const t = useTranslations('trendingMarquee');

  useEffect(() => {
    fetch('/api/trending')
      .then((res) => res.json())
      .then((data) => setTrending(data))
      .catch(() => setError('Failed to load trending'));
  }, []);

  useEffect(() => {
  if (error) {
    toast.error('Failed to load trending tokens. Please try again later.');
  }
}, [error]);

  if (error) return null;
  if (!trending) return <div className='text-gray-500 animate-pulse py-4'>{t('loading')}</div>;

  return (
    <section className='w-full flex flex-col items-center max-w-7xl overflow-hidden'>
      <div className='marquee  py-8'>
        {[...Array(2)].map((_, index) => (
          <div key={index} className='marquee-content marquee-scroll'>
            {trending.coins.map(({ item }, i) => (
              <React.Fragment key={i}>
                <img
                  src={item.thumb || '/images/coin-placeholder.png'}
                  alt={item.name}
                  className='w-6 h-6 rounded-full inline-block align-middle'
                  style={{ display: 'inline-block' }}
                  onClick={() => router.push(`/token/${item.id}`)}
                />
                <p
                  className={`inline-block mr-10 cursor-pointer font-semibold hover:underline ${
                    item.data && item.data.price_change_percentage_24h
                      ? item.data.price_change_percentage_24h.usd > 0
                        ? 'text-green-600'
                        : item.data.price_change_percentage_24h.usd < 0
                        ? 'text-red-600'
                        : 'text-gray-500'
                      : 'text-gray-500'
                  }`}
                  onClick={() => router.push(`/token/${item.id}`)}
                >
                  ${item.symbol.toUpperCase()}
                  {item.market_cap_rank ? ` #${item.market_cap_rank}` : ''}
                </p>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
