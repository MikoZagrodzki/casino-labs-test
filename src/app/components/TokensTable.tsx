'use client';
import React from 'react';
import { Token } from '@/types/types';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import Image from 'next/image';

export default function TokensTable({ initialTokens }: { initialTokens: Token[] | [] }) {
  function formatDecimals(value: number | string): string {
    // Convert to number if its a string
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    return value % 1 === 0 ? value.toString() : value.toFixed(2);
  }

  function formatNumberShort(value: number| string): string {
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

  return (
    <div className='overflow-auto max-h-[100dvh]'>
      <table className='min-w-max w-full table border-collapse'>
        <thead>
          <tr className='bg-gray-50 '>
            <th className='sticky left-0 top-0 bg-gray-50 z-20 px-4 py-2 text-left '>Coin</th>
            <th className='px-4 py-2 text-right sticky top-0  bg-gray-50'>Price</th>
            <th className='px-4 py-2 text-right sticky top-0 bg-gray-50 '>Market Cap</th>
            <th className='px-4 py-2 text-right sticky top-0 bg-gray-50'>24h</th>
            <th className='px-4 py-2 text-right sticky top-0 bg-gray-50'>Last 7 Days</th>
          </tr>
        </thead>
        <tbody>
          {initialTokens.map((coin) => (
            <tr key={coin.id} className='border-b last:border-0 '>
              <td className='sticky left-0 bg-white z-10 flex items-center px-4 py-2'>
                <Image src={coin.image} alt={`${coin.name} icon`} width={24} height={24} className='object-cover mr-2' />
                <div className='flex flex-col'>
                  <span className='font-semibold text-gray-900'>{coin.name}</span>
                  <p className='text-gray-500 uppercase text-sm'>{coin.symbol}</p>
                </div>
              </td>

              <td className='px-4 py-2 text-right text-gray-900'>${formatDecimals(coin.current_price)}</td>

              <td className='px-4 py-2 text-right text-gray-900 '>${formatNumberShort(coin.market_cap)}</td>

              <td className={`px-4 py-2 text-right ${coin.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatDecimals(coin.price_change_24h)}%
              </td>

              <td className='px-4 py-2 text-right text-gray-900 '>
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
                  <span className='text-gray-400'>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
