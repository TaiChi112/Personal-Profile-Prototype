import { create } from 'zustand';

export const useWealthStore = create((set) => ({
  assets: [
    { id: 1, name: 'Cash', value: 50000, color: '#10B981' },
    { id: 2, name: 'Stocks', value: 120000, color: '#3B82F6' },
    { id: 3, name: 'Crypto', value: 30000, color: '#F59E0B' },
  ],
  liabilities: [
    { id: 4, name: 'Car Loan', value: 45000, color: '#EF4444' }
  ],
  updateItem: (type: 'assets'|'liabilities', id: number, val: number) => set((s:any) => ({ [type]: s[type].map((i:any) => i.id === id ? {...i, value: val} : i) }))
}));
