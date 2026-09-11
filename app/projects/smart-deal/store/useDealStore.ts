import { create } from 'zustand';

export const useDealStore = create((set) => ({
  itemA: { price: 100, qty: 1 },
  itemB: { price: 280, qty: 3 },
  updateA: (field: string, val: number) => set((state: any) => ({ itemA: { ...state.itemA, [field]: val } })),
  updateB: (field: string, val: number) => set((state: any) => ({ itemB: { ...state.itemB, [field]: val } })),
}));
