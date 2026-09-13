import { create } from 'zustand';

export const useWheelStore = create((set) => ({
  options: ['KFC', 'Sushi', 'Pad Thai', 'Pizza', 'Salad'],
  result: null,
  isSpinning: false,
  spin: () => set((s:any) => {
    const random = s.options[Math.floor(Math.random() * s.options.length)];
    return { isSpinning: true, result: random };
  }),
  stopSpin: () => set({ isSpinning: false }),
  addOption: (opt: string) => set((s:any) => ({ options: [...s.options, opt] })),
  delOption: (opt: string) => set((s:any) => ({ options: s.options.filter((o:string) => o !== opt) }))
}));
