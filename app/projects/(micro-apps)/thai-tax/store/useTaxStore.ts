import { create } from 'zustand';

export const useTaxStore = create((set) => ({
  salary: 50000,
  bonus: 0,
  ssf: 0,
  insurance: 0,
  update: (field: string, val: number) => set((state: any) => ({ ...state, [field]: val })),
}));
