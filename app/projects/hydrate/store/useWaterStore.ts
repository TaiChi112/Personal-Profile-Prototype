import { create } from 'zustand';

export const useWaterStore = create((set) => ({
  glasses: 3,
  goal: 8,
  add: () => set((s:any) => ({ glasses: Math.min(s.glasses + 1, s.goal) })),
  reset: () => set({ glasses: 0 })
}));
