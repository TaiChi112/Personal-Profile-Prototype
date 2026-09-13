import { create } from 'zustand';

export const useTimetableStore = create((set) => ({
  slots: Array(25).fill(null), // 5 days * 5 slots
  updateSlot: (idx: number, data: string) => set((s: any) => {
    const newSlots = [...s.slots];
    newSlots[idx] = data;
    return { slots: newSlots };
  })
}));
