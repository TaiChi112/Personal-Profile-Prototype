import { describe, it, expect, beforeEach } from 'bun:test';
import { useMetricsStore } from '@/app/projects/(micro-apps)/body-metrics/store/useMetricsStore';

describe('useMetricsStore Zustand Store', () => {
  beforeEach(() => {
    useMetricsStore.setState({
      weight: 70,
      height: 175,
      age: 25,
      gender: 'male',
    });
  });

  it('should initialize with correct default body metrics', () => {
    const state = useMetricsStore.getState() as any;
    expect(state.weight).toBe(70);
    expect(state.height).toBe(175);
    expect(state.age).toBe(25);
    expect(state.gender).toBe('male');
  });

  it('should update weight field', () => {
    const { update } = useMetricsStore.getState() as any;
    update('weight', 85);
    expect((useMetricsStore.getState() as any).weight).toBe(85);
  });

  it('should update height field', () => {
    const { update } = useMetricsStore.getState() as any;
    update('height', 180);
    expect((useMetricsStore.getState() as any).height).toBe(180);
  });

  it('should update age field', () => {
    const { update } = useMetricsStore.getState() as any;
    update('age', 30);
    expect((useMetricsStore.getState() as any).age).toBe(30);
  });

  it('should update gender field', () => {
    const { update } = useMetricsStore.getState() as any;
    update('gender', 'female');
    expect((useMetricsStore.getState() as any).gender).toBe('female');

    update('gender', 'male');
    expect((useMetricsStore.getState() as any).gender).toBe('male');
  });
});
