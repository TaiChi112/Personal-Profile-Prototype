"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CryptoCard, { Coin } from './components/CryptoCard';
import CryptoMarketChart from './components/CryptoMarketChart';

export default function CryptoDashboard() {
  const [data, setData] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/crypto/stream');

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
        setError(null);
        setLoading(false);
      } catch (err) {
        setError('Failed to parse data');
        setLoading(false);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      setError('Failed to fetch real-time data');
      setLoading(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/projects" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 flex items-center gap-2 font-medium transition-colors"
          >
            &larr; Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Crypto Dashboard</h1>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div>
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.map((coin) => (
                  <CryptoCard key={coin.id} coin={coin} />
                ))}
              </div>
              <CryptoMarketChart />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
