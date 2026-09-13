import { create } from 'zustand';

export const useParkStore = create((set) => ({
  floor: '',
  pillar: '',
  note: '',
  saved: false,
  savePark: (f: string, p: string, n: string) => set({ floor: f, pillar: p, note: n, saved: true }),
  clearPark: () => set({ floor: '', pillar: '', note: '', saved: false })
}));
