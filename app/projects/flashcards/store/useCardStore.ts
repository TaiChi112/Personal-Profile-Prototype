import { create } from 'zustand';

export const useCardStore = create((set) => ({
  cards: [
    { q: 'What is a Closure?', a: 'A function bundled with its lexical environment.' },
    { q: 'What is Next.js?', a: 'A React framework for production.' },
    { q: 'Zustand vs Redux?', a: 'Zustand is a small, fast, unopinionated state management solution.' }
  ],
  currentIndex: 0,
  score: 0,
  nextCard: (correct: boolean) => set((state: any) => ({
    score: correct ? state.score + 1 : state.score,
    currentIndex: Math.min(state.currentIndex + 1, state.cards.length)
  }))
}));
