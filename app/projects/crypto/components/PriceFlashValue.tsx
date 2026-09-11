"use client";

import React, { useEffect, useRef, useState } from 'react';

interface PriceFlashValueProps {
  value: number;
  formattedText: string;
}

export default function PriceFlashValue({ value, formattedText }: PriceFlashValueProps) {
  const prevValueRef = useRef<number>(value);
  const [colorClass, setColorClass] = useState<string>('text-gray-900 dark:text-white');

  useEffect(() => {
    if (value > prevValueRef.current) {
      setColorClass('text-green-500');
    } else if (value < prevValueRef.current) {
      setColorClass('text-red-500');
    }

    prevValueRef.current = value;

    const timeoutId = setTimeout(() => {
      setColorClass('text-gray-900 dark:text-white');
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <span className={colorClass}>
      {formattedText}
    </span>
  );
}
