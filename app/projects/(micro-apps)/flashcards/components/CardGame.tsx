"use client";
import React, { useState } from 'react';
import { useCardStore } from '../store/useCardStore';

export default function CardGame() {
  const { cards, currentIndex, score, nextCard } = useCardStore() as any;
  const [flipped, setFlipped] = useState(false);

  if (currentIndex >= cards.length) {
    return (
      <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
        <h2 className="text-4xl font-black mb-4 text-emerald-500">Finished!</h2>
        <p className="text-xl">Score: {score} / {cards.length}</p>
      </div>
    );
  }

  const card = cards[currentIndex];

  const handleNext = (correct: boolean) => {
    setFlipped(false);
    setTimeout(() => nextCard(correct), 150);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6 font-bold text-gray-500">Card {currentIndex + 1} of {cards.length} | Score: {score}</div>
      <div 
        onClick={() => setFlipped(!flipped)}
        className="h-80 w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-4 border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all transform hover:scale-105 active:scale-95"
      >
        <p className={`text-2xl font-bold transition-opacity ${flipped ? 'opacity-0 h-0' : 'opacity-100'}`}>{card.q}</p>
        <p className={`text-xl font-medium text-emerald-600 transition-opacity ${!flipped ? 'opacity-0 h-0' : 'opacity-100'}`}>{card.a}</p>
        <p className="text-xs text-gray-400 absolute bottom-4">(Click to flip)</p>
      </div>

      {flipped && (
        <div className="flex gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4">
          <button onClick={(e) => { e.stopPropagation(); handleNext(false); }} className="flex-1 bg-rose-500 text-white p-4 rounded-xl font-bold hover:bg-rose-600">Wrong ❌</button>
          <button onClick={(e) => { e.stopPropagation(); handleNext(true); }} className="flex-1 bg-emerald-500 text-white p-4 rounded-xl font-bold hover:bg-emerald-600">Correct ✅</button>
        </div>
      )}
    </div>
  );
}
