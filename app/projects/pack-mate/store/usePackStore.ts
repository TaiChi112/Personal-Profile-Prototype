import { create } from 'zustand';

export const usePackStore = create((set) => ({
  tripType: 'Beach',
  items: [
    { id: 1, name: 'Sunscreen', type: 'Beach', packed: false },
    { id: 2, name: 'Swimsuit', type: 'Beach', packed: false },
    { id: 3, name: 'Passport', type: 'All', packed: true },
    { id: 4, name: 'Phone Charger', type: 'All', packed: false },
    { id: 5, name: 'Winter Coat', type: 'Winter', packed: false },
  ],
  setTripType: (t: string) => set({ tripType: t }),
  togglePack: (id: number) => set((s:any) => ({ items: s.items.map((i:any) => i.id === id ? {...i, packed: !i.packed} : i) }))
}));
