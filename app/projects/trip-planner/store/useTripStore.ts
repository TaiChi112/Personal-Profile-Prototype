import { create } from 'zustand';

export const useTripStore = create((set) => ({
  distance: 350,
  efficiency: 15,
  price: 36.5,
  update: (field: string, val: number) => set((state: any) => ({ ...state, [field]: val })),
}));
