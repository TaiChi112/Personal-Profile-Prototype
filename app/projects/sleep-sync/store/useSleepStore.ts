import { create } from 'zustand';

export const useSleepStore = create((set) => ({
  wakeTime: '07:00',
  setWakeTime: (t: string) => set({ wakeTime: t })
}));
