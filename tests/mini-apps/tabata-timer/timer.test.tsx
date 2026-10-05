import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Timer from '@/app/projects/(micro-apps)/tabata-timer/components/Timer';
import Page from '@/app/projects/(micro-apps)/tabata-timer/page';
import { useTimerStore } from '@/app/projects/(micro-apps)/tabata-timer/store/useTimerStore';

describe('Tabata Timer Component and Page', () => {
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

  afterEach(() => {
    useTimerStore.setState({
      status: 'idle',
    });
  });

  it('should render initial timer state correctly', () => {
    const { getByText, getByRole, getAllByRole } = render(<Timer />);

    expect(getByText('Ready')).toBeInTheDocument();
    expect(getByText('40')).toBeInTheDocument();
    expect(getByText('Round 1 / 8')).toBeInTheDocument();
    expect(getByRole('button', { name: 'START' })).toBeInTheDocument();

    const inputs = getAllByRole('spinbutton');
    expect(inputs).toHaveLength(3);
    expect(inputs[0]).toHaveValue(40);
    expect(inputs[1]).toHaveValue(20);
    expect(inputs[2]).toHaveValue(8);
  });

  it('should allow modifying work, rest, and round inputs when idle', () => {
    const { getAllByRole } = render(<Timer />);

    const [workInput, restInput, roundsInput] = getAllByRole('spinbutton');

    act(() => {
      fireEvent.change(workInput, { target: { value: '30' } });
    });
    expect((useTimerStore.getState() as any).workTime).toBe(30);
    expect((useTimerStore.getState() as any).timeLeft).toBe(30);

    act(() => {
      fireEvent.change(restInput, { target: { value: '10' } });
    });
    expect((useTimerStore.getState() as any).restTime).toBe(10);

    act(() => {
      fireEvent.change(roundsInput, { target: { value: '5' } });
    });
    expect((useTimerStore.getState() as any).totalRounds).toBe(5);
  });

  it('should toggle from idle to work when clicking START', () => {
    const { getByRole, getByText } = render(<Timer />);

    const startBtn = getByRole('button', { name: 'START' });
    act(() => {
      fireEvent.click(startBtn);
    });

    const state = useTimerStore.getState() as any;
    expect(state.status).toBe('work');
    expect(state.currentRound).toBe(1);
    expect(state.timeLeft).toBe(40);

    expect(getByText('work')).toBeInTheDocument();
    expect(getByRole('button', { name: 'STOP' })).toBeInTheDocument();
  });

  it('should toggle from work to idle when clicking STOP', () => {
    act(() => {
      useTimerStore.setState({ status: 'work', timeLeft: 25, currentRound: 2 });
    });

    const { getByRole } = render(<Timer />);

    const stopBtn = getByRole('button', { name: 'STOP' });
    act(() => {
      fireEvent.click(stopBtn);
    });

    const state = useTimerStore.getState() as any;
    expect(state.status).toBe('idle');
  });

  it('should transition from work to rest when timeLeft < 0 and more rounds remain', () => {
    act(() => {
      useTimerStore.setState({
        workTime: 30,
        restTime: 15,
        totalRounds: 5,
        status: 'work',
        timeLeft: -1,
        currentRound: 1,
      });
    });

    render(<Timer />);

    const state = useTimerStore.getState() as any;
    expect(state.status).toBe('rest');
    expect(state.timeLeft).toBe(15);
  });

  it('should transition from rest to work and increment round when timeLeft < 0', () => {
    act(() => {
      useTimerStore.setState({
        workTime: 30,
        restTime: 15,
        totalRounds: 5,
        status: 'rest',
        timeLeft: -1,
        currentRound: 2,
      });
    });

    render(<Timer />);

    const state = useTimerStore.getState() as any;
    expect(state.status).toBe('work');
    expect(state.timeLeft).toBe(30);
    expect(state.currentRound).toBe(3);
  });

  it('should finish workout and return to idle when work round reaches totalRounds and timeLeft < 0', () => {
    act(() => {
      useTimerStore.setState({
        workTime: 30,
        restTime: 15,
        totalRounds: 4,
        status: 'work',
        timeLeft: -1,
        currentRound: 4,
      });
    });

    render(<Timer />);

    const state = useTimerStore.getState() as any;
    expect(state.status).toBe('idle');
    expect(state.timeLeft).toBe(30);
    expect(state.currentRound).toBe(1);
  });

  it('should render the full Page with Back link and Timer component', () => {
    const { getByText, getByRole } = render(<Page />);

    const backLink = getByText('Back', { exact: false });
    expect(backLink).toBeInTheDocument();
    expect(backLink.getAttribute('href')).toBe('/projects');
    expect(getByRole('button', { name: 'START' })).toBeInTheDocument();
  });

  it('should render rest background and status display when status is rest', () => {
    act(() => {
      useTimerStore.setState({ status: 'rest', timeLeft: 15 });
    });
    const { container, getByText } = render(<Timer />);
    expect(container.firstChild).toHaveClass('bg-emerald-500');
    expect(getByText('rest')).toBeInTheDocument();
  });

  it('should decrement timeLeft when interval callback triggers in active state', () => {
    let intervalCb: any;
    const originalSetInterval = global.setInterval;
    global.setInterval = ((cb: any) => {
      intervalCb = cb;
      return 123 as any;
    }) as any;

    try {
      act(() => {
        useTimerStore.setState({ status: 'work', timeLeft: 20 });
      });
      render(<Timer />);
      expect(intervalCb).toBeDefined();
      act(() => {
        intervalCb();
      });
      expect((useTimerStore.getState() as any).timeLeft).toBe(19);
    } finally {
      global.setInterval = originalSetInterval;
    }
  });
});
