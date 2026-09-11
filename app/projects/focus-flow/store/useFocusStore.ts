import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

export interface FocusSession {
  id: string;
  date: string; // ISO string for the day (YYYY-MM-DD)
  durationMinutes: number;
  timestamp: number; // exact time completed
}

interface FocusState {
  // Timer State (Transient)
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
  
  // History State (Persisted)
  history: FocusSession[];
  
  // Actions
  setTimeLeft: (time: number) => void;
  setIsRunning: (running: boolean) => void;
  setMode: (mode: TimerMode) => void;
  addSession: (durationMinutes: number) => void;
  clearHistory: () => void;
}

export const FOCUS_TIME = 25 * 60;
export const SHORT_BREAK_TIME = 5 * 60;
export const LONG_BREAK_TIME = 15 * 60;

export const useFocusStore = create<FocusState>()(
  persist(
    (set) => ({
      timeLeft: FOCUS_TIME,
      isRunning: false,
      mode: 'FOCUS',
      history: [],
      
      setTimeLeft: (time) => set({ timeLeft: time }),
      setIsRunning: (running) => set({ isRunning: running }),
      setMode: (mode) => set({ 
        mode, 
        timeLeft: mode === 'FOCUS' ? FOCUS_TIME : mode === 'SHORT_BREAK' ? SHORT_BREAK_TIME : LONG_BREAK_TIME,
        isRunning: false
      }),
      addSession: (durationMinutes) => set((state) => {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const newSession: FocusSession = {
          id: Math.random().toString(36).substring(7),
          date: dateStr,
          durationMinutes,
          timestamp: now.getTime(),
        };
        return { history: [...state.history, newSession] };
      }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'focus-flow-storage',
      partialize: (state) => ({ history: state.history }), // Only persist the history
    }
  )
);
