import { create } from 'zustand';

interface SortState {
  array: number[];
  isSorting: boolean;
  generateArray: () => void;
  setArray: (arr: number[]) => void;
  setIsSorting: (sorting: boolean) => void;
}

export const useSortStore = create<SortState>((set) => ({
  array: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 10),
  isSorting: false,
  generateArray: () => set({ array: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 10) }),
  setArray: (array) => set({ array }),
  setIsSorting: (isSorting) => set({ isSorting }),
}));
