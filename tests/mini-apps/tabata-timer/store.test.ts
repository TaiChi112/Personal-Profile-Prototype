import { describe, it, expect, beforeEach } from 'bun:test';
import { useTimerStore } from '@/app/projects/(micro-apps)/tabata-timer/store/useTimerStore';

describe('useTimerStore Zustand Store', () => {
  beforeEach(() => {
    useTimerStore.setState({
      workTime: 40,
      restTime: 20,
      totalRounds: 8,
      status: 'idle',
      timeLeft: 40,
      currentRound: 1,
    });
  });

  it('should initialize with correct default values', () => {
    const state = useTimerStore.getState() as any;
    expect(state.workTime).toBe(40);
    expect(state.restTime).toBe(20);
    expect(state.totalRounds).toBe(8);
    expect(state.status).toBe('idle');
    expect(state.timeLeft).toBe(40);
    expect(state.currentRound).toBe(1);
  });

  it('should update setup for workTime and synchronize timeLeft', () => {
    const { updateSetup } = useTimerStore.getState() as any;
    updateSetup('workTime', 50);

    const state = useTimerStore.getState() as any;
    expect(state.workTime).toBe(50);
    expect(state.timeLeft).toBe(50);
  });

  it('should update setup for restTime without affecting timeLeft', () => {
    const { updateSetup } = useTimerStore.getState() as any;
    updateSetup('restTime', 15);

    const state = useTimerStore.getState() as any;
    expect(state.restTime).toBe(15);
    expect(state.timeLeft).toBe(40);
  });

  it('should update setup for totalRounds without affecting timeLeft', () => {
    const { updateSetup } = useTimerStore.getState() as any;
    updateSetup('totalRounds', 10);

    const state = useTimerStore.getState() as any;
    expect(state.totalRounds).toBe(10);
    expect(state.timeLeft).toBe(40);
  });

  it('should update status using setStatus', () => {
    const { setStatus } = useTimerStore.getState() as any;
    setStatus('work');
    expect((useTimerStore.getState() as any).status).toBe('work');

    setStatus('rest');
    expect((useTimerStore.getState() as any).status).toBe('rest');

    setStatus('idle');
    expect((useTimerStore.getState() as any).status).toBe('idle');
  });

  it('should update timeLeft using setTimeLeft', () => {
    const { setTimeLeft } = useTimerStore.getState() as any;
    setTimeLeft(15);
    expect((useTimerStore.getState() as any).timeLeft).toBe(15);

    setTimeLeft(0);
    expect((useTimerStore.getState() as any).timeLeft).toBe(0);
  });

  it('should update currentRound using setRound', () => {
    const { setRound } = useTimerStore.getState() as any;
    setRound(3);
    expect((useTimerStore.getState() as any).currentRound).toBe(3);

    setRound(8);
    expect((useTimerStore.getState() as any).currentRound).toBe(8);
  });
});
