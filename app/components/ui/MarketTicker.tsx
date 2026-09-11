'use client';

import React, { useEffect, useState } from 'react';

export default function MarketTicker() {
  const [price, setPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch('/api/market-data');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        
        // Find Bitcoin from the formatted array
        const btcData = data.find((c: any) => c.id === 'bitcoin');
        if (!btcData) throw new Error('Invalid data format');
        
        const currentPrice = btcData.price;
        
        setPrice((prev) => {
          setPrevPrice(prev);
          return currentPrice;
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch price');
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="text-red-500 text-sm p-2 w-full text-center bg-gray-900 border-b border-gray-800">{error}</div>;
  if (price === null) return <div className="text-gray-500 text-sm p-2 w-full text-center bg-gray-900 border-b border-gray-800 animate-pulse">Loading BTC...</div>;

  const isUp = prevPrice === null || price >= prevPrice;

  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 p-2 flex items-center justify-center">
      <div className="flex items-center space-x-2 text-sm font-medium">
        <span className="text-gray-400">BTC/USD</span>
        <span className={isUp ? 'text-green-400' : 'text-red-400'}>
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className={isUp ? 'text-green-400' : 'text-red-400'}>
          {isUp ? '▲' : '▼'}
        </span>
      </div>
    </div>
  );
}
