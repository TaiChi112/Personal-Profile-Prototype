import { create } from 'zustand';

export const useFridgeStore = create((set) => ({
  items: [
    { id: 1, name: 'Milk', expiry: new Date(Date.now() + 86400000).toISOString().split('T')[0] }, // tomorrow
    { id: 2, name: 'Eggs', expiry: new Date(Date.now() + 5*86400000).toISOString().split('T')[0] },
    { id: 3, name: 'Chicken', expiry: new Date(Date.now() - 86400000).toISOString().split('T')[0] } // expired
  ],
  addItem: (name: string, expiry: string) => set((s: any) => ({ items: [...s.items, { id: Date.now(), name, expiry }] })),
  delItem: (id: number) => set((s: any) => ({ items: s.items.filter((i:any) => i.id !== id) }))
}));
