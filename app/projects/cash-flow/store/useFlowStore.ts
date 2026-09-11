import { create } from 'zustand';

export const useFlowStore = create((set) => ({
  income: 50000,
  expenses: [
    { id: 1, name: 'Rent', value: 15000, color: 'bg-indigo-500' },
    { id: 2, name: 'Food', value: 10000, color: 'bg-emerald-500' },
    { id: 3, name: 'Savings', value: 15000, color: 'bg-blue-500' },
    { id: 4, name: 'Fun', value: 10000, color: 'bg-pink-500' },
  ],
  setIncome: (v: number) => set({ income: v }),
  updateExp: (id: number, v: number) => set((s:any) => ({ expenses: s.expenses.map((e:any) => e.id === id ? {...e, value: v} : e) }))
}));
