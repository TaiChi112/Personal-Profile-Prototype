"use client";

import React, { useEffect, useState } from 'react';

interface Transaction {
  id?: string;
  date: string;
  coin: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
}

export default function TransactionLedger() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/crypto/transactions?userId=user_1');
        
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        
        const data = await response.json();
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700 font-medium">Error: {error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center shadow-sm">
        <p className="text-gray-500">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Coin</th>
            <th scope="col" className="px-6 py-3">Type</th>
            <th scope="col" className="px-6 py-3">Amount</th>
            <th scope="col" className="px-6 py-3">Price</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={tx.id || index} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(tx.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {tx.coin}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tx.type === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {tx.type}
                </span>
              </td>
              <td className="px-6 py-4">
                {tx.amount}
              </td>
              <td className="px-6 py-4">
                ${tx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
