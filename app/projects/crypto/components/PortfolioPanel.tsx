"use client";

import React, { useState } from 'react';

export default function PortfolioPanel() {
  const [coin, setCoin] = useState('BTC');
  const [amount, setAmount] = useState<number | ''>('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTransaction = async (type: 'BUY' | 'SELL') => {
    if (!amount || amount <= 0) {
      setStatusMessage('Please enter a valid amount.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const response = await fetch('/api/crypto/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_1',
          coinId: coin,
          amount: Number(amount),
          type,
          price: 0 // dummy price
        }),
      });

      if (response.ok) {
        setStatusMessage(`Successfully ${type === 'BUY' ? 'bought' : 'sold'} ${amount} ${coin}!`);
        setAmount('');
      } else {
        setStatusMessage('Transaction failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during transaction:', error);
      setStatusMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Paper Trading</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="coin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select Coin
          </label>
          <select
            id="coin"
            value={coin}
            onChange={(e) => setCoin(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="SOL">Solana (SOL)</option>
            <option value="ADA">Cardano (ADA)</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
            min="0"
            step="any"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="0.00"
            required
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => handleTransaction('BUY')}
            disabled={isSubmitting}
            className="flex-1 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800 disabled:opacity-50 transition-colors"
          >
            Buy
          </button>
          <button
            onClick={() => handleTransaction('SELL')}
            disabled={isSubmitting}
            className="flex-1 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900 disabled:opacity-50 transition-colors"
          >
            Sell
          </button>
        </div>

        {statusMessage && (
          <div className={`p-4 text-sm rounded-lg ${statusMessage.includes('Successfully') ? 'text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400' : 'text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400'}`} role="alert">
            <span className="font-medium">{statusMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
