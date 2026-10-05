import { describe, it, expect, beforeEach } from 'bun:test';
import { useSortStore } from '@/app/projects/(micro-apps)/sort-viz/store/useSortStore';

describe('useSortStore Zustand Store', () => {
  beforeEach(() => {
    useSortStore.setState({
      array: [50, 20, 80, 10, 30],
      isSorting: false,
    });
  });

  it('should initialize with an array and isSorting false', () => {
    const state = useSortStore.getState();
    expect(state.array).toEqual([50, 20, 80, 10, 30]);
    expect(state.isSorting).toBe(false);
  });

  it('should generate a new random array of length 30', () => {
    const { generateArray } = useSortStore.getState();
    generateArray();

    const state = useSortStore.getState();
    expect(state.array).toHaveLength(30);
    state.array.forEach(val => {
      expect(val).toBeGreaterThanOrEqual(10);
      expect(val).toBeLessThanOrEqual(110);
    });
  });

  it('should set array explicitly via setArray', () => {
    const { setArray } = useSortStore.getState();
    setArray([1, 2, 3]);

    expect(useSortStore.getState().array).toEqual([1, 2, 3]);
  });

  it('should update isSorting flag via setIsSorting', () => {
    const { setIsSorting } = useSortStore.getState();
    setIsSorting(true);
    expect(useSortStore.getState().isSorting).toBe(true);

    setIsSorting(false);
    expect(useSortStore.getState().isSorting).toBe(false);
  });
});
