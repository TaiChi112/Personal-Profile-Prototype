"use client";

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ChartData {
  date: string;
  BTC: number;
  ETH: number;
  SOL: number;
}

export default function CryptoMarketChart() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const generateData = () => {
      const result: ChartData[] = [];
      const now = new Date();
      let btcPrice = 60000;
      let ethPrice = 3000;
      let solPrice = 100;

      for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        btcPrice = btcPrice * (1 + (Math.random() - 0.5) * 0.05);
        ethPrice = ethPrice * (1 + (Math.random() - 0.5) * 0.06);
        solPrice = solPrice * (1 + (Math.random() - 0.5) * 0.08);

        result.push({
          date: date.toLocaleDateString(),
          BTC: Math.round(btcPrice),
          ETH: Math.round(ethPrice),
          SOL: Math.round(solPrice),
        });
      }
      return result;
    };

    setData(generateData());
  }, []);

  return (
    <div className="w-full h-[400px] mt-8 bg-white p-4 rounded-xl shadow-sm dark:bg-gray-800">
      <h3 className="text-xl font-bold mb-4">Market Trends (30 Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="BTC" stackId="1" stroke="#f7931a" fill="#f7931a" fillOpacity={0.3} />
          <Area type="monotone" dataKey="ETH" stackId="2" stroke="#627eea" fill="#627eea" fillOpacity={0.3} />
          <Area type="monotone" dataKey="SOL" stackId="3" stroke="#14f195" fill="#14f195" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
