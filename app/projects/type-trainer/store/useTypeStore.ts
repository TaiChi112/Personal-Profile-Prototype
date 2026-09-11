import { create } from 'zustand';

interface TypeState {
  prompt: string;
  input: string;
  startTime: number | null;
  wpm: number;
  setInput: (str: string) => void;
  reset: () => void;
}

const SAMPLE = "const developer = new Set(['code', 'sleep', 'repeat']);";

export const useTypeStore = create<TypeState>((set) => ({
  prompt: SAMPLE,
  input: '',
  startTime: null,
  wpm: 0,
  setInput: (input) => set((state) => {
    let startTime = state.startTime;
    let wpm = state.wpm;
    if (!startTime && input.length > 0) startTime = Date.now();
    
    if (startTime && input.length > 0) {
      const timeElapsed = (Date.now() - startTime) / 60000; // in minutes
      const wordsTyped = input.length / 5;
      wpm = Math.round(wordsTyped / timeElapsed);
    }
    
    return { input, startTime, wpm };
  }),
  reset: () => set({ input: '', startTime: null, wpm: 0 })
}));
