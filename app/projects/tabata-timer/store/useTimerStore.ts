import { create } from 'zustand';

export const useTimerStore = create((set) => ({
  workTime: 40,
  restTime: 20,
  totalRounds: 8,
  status: 'idle', // idle, work, rest
  timeLeft: 40,
  currentRound: 1,
  updateSetup: (f: string, v: number) => set((s:any) => ({ [f]: v, timeLeft: f === 'workTime' ? v : s.timeLeft })),
  setStatus: (st: string) => set({ status: st }),
  setTimeLeft: (t: number) => set({ timeLeft: t }),
  setRound: (r: number) => set({ currentRound: r })
}));
