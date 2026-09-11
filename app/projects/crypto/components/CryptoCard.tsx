"use client";

import React, { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import PriceFlashValue from './PriceFlashValue';

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
}

interface CryptoCardProps {
  coin: Coin;
}

export default function CryptoCard({ coin }: CryptoCardProps) {
  // Format price: 2 decimal places for large numbers, up to 5 for small numbers
  const formatPrice = (price: number) => {
    if (price >= 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 5,
      }).format(price);
    }
  };

  // Format change24h to exactly 2 decimal places with % sign
  const isPositive = coin.change24h >= 0;
  const changeColorClass = isPositive ? 'text-green-500' : 'text-red-500';
  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  // Generate dummy sparkline data based on current price to mimic trading activity
  const sparklineData = useMemo(() => {
    const data = [];
    let current = coin.price;
    // Generate 20 data points for the sparkline
    for (let i = 0; i < 20; i++) {
      data.push({ value: current });
      // Random walk: +/- 2% change
      const change = current * (Math.random() * 0.04 - 0.02);
      current += change;
    }
    // Reverse so the last point is closest to the current price if viewed left-to-right
    return data.reverse();
  }, [coin.price]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col w-full border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{coin.name}</h3>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
            {coin.symbol}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-2">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            <PriceFlashValue value={coin.price} formattedText={formatPrice(coin.price)} />
          </div>
          <div className={`text-sm font-medium ${changeColorClass} flex items-center mt-1`}>
            {isPositive ? (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {formatChange(coin.change24h)}
          </div>
        </div>
        
        <div className="w-24 h-12 ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={isPositive ? '#10B981' : '#EF4444'} 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
