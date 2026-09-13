import { create } from 'zustand';

export const useMoodStore = create((set) => ({
  entries: [
    { id: 1, mood: '😁', energy: 8, date: new Date(Date.now()-86400000).toISOString().split('T')[0] }
  ],
  add: (e: any) => set((s:any) => ({ entries: [{...e, id: Date.now()}, ...s.entries] }))
}));
