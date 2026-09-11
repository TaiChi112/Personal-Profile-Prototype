import { create } from 'zustand';

export const useMetricsStore = create((set) => ({
  weight: 70,
  height: 175,
  age: 25,
  gender: 'male',
  update: (f: string, v: any) => set({ [f]: v })
}));
