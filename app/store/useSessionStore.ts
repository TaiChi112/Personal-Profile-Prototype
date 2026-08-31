import { create } from 'zustand';

export interface SessionState {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  toggleRole: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isAdmin: false,
  setIsAdmin: (val) => set({ isAdmin: val }),
  toggleRole: () => set((state) => ({ isAdmin: !state.isAdmin })),
}));
