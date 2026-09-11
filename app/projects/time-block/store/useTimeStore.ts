import { create } from 'zustand';

export const useTimeStore = create((set) => ({
  activities: [
    { id: 1, name: 'Sleep', hours: 7, color: '#6366F1' },
    { id: 2, name: 'Work', hours: 8, color: '#EF4444' },
    { id: 3, name: 'Commute', hours: 2, color: '#F59E0B' },
  ],
  updateHour: (id: number, h: number) => set((s:any) => ({ activities: s.activities.map((a:any) => a.id === id ? {...a, hours: h} : a) }))
}));
