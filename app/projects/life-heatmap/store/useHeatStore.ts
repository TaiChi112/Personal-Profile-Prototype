import { create } from 'zustand';

// Generate last 365 days
const days = Array.from({length: 365}).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (364 - i));
  return { id: i, date: d.toISOString().split('T')[0], level: Math.floor(Math.random() * 4) }; // mock data 0-3
});

export const useHeatStore = create((set) => ({
  days,
  toggleDay: (id: number) => set((s:any) => ({ days: s.days.map((d:any) => d.id === id ? {...d, level: (d.level + 1) % 4} : d) }))
}));
