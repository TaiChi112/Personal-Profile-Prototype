import { create } from 'zustand';

interface RpgState {
  level: number;
  exp: number;
  habits: { id: string, title: string, done: boolean }[];
  completeHabit: (id: string) => void;
}

export const useRpgStore = create<RpgState>((set) => ({
  level: 1,
  exp: 0,
  habits: [
    { id: '1', title: 'Drink 2L Water', done: false },
    { id: '2', title: 'Code for 1 hour', done: false },
    { id: '3', title: 'Read 10 pages', done: false }
  ],
  completeHabit: (id) => set((state) => {
    let newExp = state.exp + 35;
    let newLevel = state.level;
    if (newExp >= 100) {
      newExp -= 100;
      newLevel += 1;
    }
    return {
      level: newLevel,
      exp: newExp,
      habits: state.habits.map(h => h.id === id ? { ...h, done: true } : h)
    };
  })
}));
