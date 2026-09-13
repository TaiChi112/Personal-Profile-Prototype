import { create } from 'zustand';

export const useFocusIdleStore = create((set) => ({
  timeLeft: 25 * 60,
  isRunning: false,
  coins: 0,
  buildings: 0,
  tick: () => set((state: any) => {
    if (state.timeLeft <= 0) return { isRunning: false, coins: state.coins + 100, timeLeft: 25 * 60 };
    return { timeLeft: state.timeLeft - 1 };
  }),
  toggle: () => set((state: any) => ({ isRunning: !state.isRunning })),
  buyBuilding: () => set((state: any) => {
    if (state.coins >= 50) return { coins: state.coins - 50, buildings: state.buildings + 1 };
    return state;
  })
}));
