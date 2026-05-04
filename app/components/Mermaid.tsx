'use client';

import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes'; // ดึง Theme จาก Fumadocs

export function Mermaid({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    // ตั้งค่าธีมของ Mermaid ให้สลับตามเว็บ (Dark/Light mode)
    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
    });

    const renderChart = async () => {
      try {
        const id = `mermaid-svg-${Math.floor(Math.random() * 10000)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        setSvg(renderedSvg);
      } catch (error) {
        console.error('Mermaid render error:', error);
      }
    };

    renderChart();
  }, [chart, resolvedTheme]);

  // แสดงผล Placeholder โหลดเบาๆ ระหว่างที่เรนเดอร์ Diagram
  if (!svg) return <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 w-full rounded-lg my-6" />;

  return (
    <div 
      className="flex justify-center my-6 overflow-x-auto" 
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}