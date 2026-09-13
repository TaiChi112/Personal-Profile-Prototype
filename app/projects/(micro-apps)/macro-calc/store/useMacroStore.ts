import { create } from 'zustand';

export const useMacroStore = create((set) => ({
  protein: 150,
  carbs: 200,
  fat: 60,
  update: (f: string, v: number) => set({ [f]: v })
}));
