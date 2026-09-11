import { create } from 'zustand';

export const useMedStore = create((set) => ({
  meds: [
    { id: 1, name: 'Vitamin C', time: 'Morning', taken: false },
    { id: 2, name: 'Fish Oil', time: 'After Lunch', taken: false },
  ],
  toggle: (id: number) => set((s: any) => ({ meds: s.meds.map((m:any) => m.id === id ? {...m, taken: !m.taken} : m) })),
  reset: () => set((s: any) => ({ meds: s.meds.map((m:any) => ({...m, taken: false})) }))
}));
