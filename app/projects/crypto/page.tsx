"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
}

export default function CryptoDashboard() {
  const [data, setData] = useState<CryptoData[]>([]);
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link 
            href="/projects" 
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium transition-colors"
          >
            &larr; Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Crypto Dashboard</h1>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((coin) => (
              <div 
                key={coin.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{coin.name}</h2>
                    <span className="text-sm font-medium text-gray-500 uppercase">{coin.symbol}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    coin.change24h >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Current Price</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
