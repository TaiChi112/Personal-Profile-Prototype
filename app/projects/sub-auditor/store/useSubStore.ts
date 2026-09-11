import { create } from 'zustand';

export const useSubStore = create((set) => ({
  subs: [
    { id: 1, name: 'Netflix', price: 419, active: true },
    { id: 2, name: 'Spotify', price: 139, active: true },
    { id: 3, name: 'Gym', price: 1500, active: false }
  ],
  toggle: (id: number) => set((s: any) => ({ subs: s.subs.map((sub: any) => sub.id === id ? {...sub, active: !sub.active} : sub) }))
}));
