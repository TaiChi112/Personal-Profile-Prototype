import { create } from 'zustand';

export const useBillStore = create((set) => ({
  total: 1500,
  people: 3,
  ppNumber: '0812345678',
  update: (f: string, v: any) => set((s: any) => ({ ...s, [f]: v }))
}));
