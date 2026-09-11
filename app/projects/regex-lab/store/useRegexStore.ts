import { create } from 'zustand';

interface RegexState {
  pattern: string;
  text: string;
  setPattern: (p: string) => void;
  setText: (t: string) => void;
}

export const useRegexStore = create<RegexState>((set) => ({
  pattern: '[A-Z]\\\\w+',
  text: 'Hello World. This is a Test.',
  setPattern: (pattern) => set({ pattern }),
  setText: (text) => set({ text }),
}));
