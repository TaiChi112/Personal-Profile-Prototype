import { create } from 'zustand';

export const useFinanceStore = create((set) => ({
  transactions: [
    { id: 1, type: 'income', amount: 50000, label: 'Salary' },
    { id: 2, type: 'expense', amount: 15000, label: 'Rent' },
    { id: 3, type: 'expense', amount: 500, label: 'Coffee' },
  ],
  addTx: (tx: any) => set((state: any) => ({ transactions: [{...tx, id: Date.now()}, ...state.transactions] })),
  delTx: (id: number) => set((state: any) => ({ transactions: state.transactions.filter((t: any) => t.id !== id) }))
}));
