import { describe, it, expect, beforeEach } from 'bun:test';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Visualizer from '@/app/projects/(micro-apps)/sort-viz/components/Visualizer';
import Page from '@/app/projects/(micro-apps)/sort-viz/page';
import { useSortStore } from '@/app/projects/(micro-apps)/sort-viz/store/useSortStore';

describe('Sorting Visualizer Component and Page', () => {
  beforeEach(() => {
    useSortStore.setState({
      array: [50, 20, 80],
      isSorting: false,
    });
  });

  it('should render control buttons and array visualization bars', () => {
    const { getByRole, container } = render(<Visualizer />);

    const generateBtn = getByRole('button', { name: 'Generate New Array' });
    const sortBtn = getByRole('button', { name: 'Bubble Sort' });

    expect(generateBtn).toBeInTheDocument();
    expect(sortBtn).toBeInTheDocument();
    expect(generateBtn).not.toBeDisabled();
    expect(sortBtn).not.toBeDisabled();

    // 3 bars rendered
    const bars = container.querySelectorAll('.w-4');
    expect(bars).toHaveLength(3);
    expect((bars[0] as HTMLElement).style.height).toBe('50%');
    expect((bars[1] as HTMLElement).style.height).toBe('20%');
    expect((bars[2] as HTMLElement).style.height).toBe('80%');
  });

  it('should generate a new array when clicking Generate New Array button', () => {
    const { getByRole, container } = render(<Visualizer />);

    const generateBtn = getByRole('button', { name: 'Generate New Array' });
    act(() => {
      fireEvent.click(generateBtn);
    });

    const state = useSortStore.getState();
    expect(state.array).toHaveLength(30);

    const bars = container.querySelectorAll('.w-4');
    expect(bars).toHaveLength(30);
  });

  it('should disable buttons while isSorting is true', () => {
    act(() => {
      useSortStore.setState({ isSorting: true });
    });

    const { getByRole } = render(<Visualizer />);

    const generateBtn = getByRole('button', { name: 'Generate New Array' });
    const sortBtn = getByRole('button', { name: 'Bubble Sort' });

    expect(generateBtn).toBeDisabled();
    expect(sortBtn).toBeDisabled();
  });

  it('should perform bubble sort and sort array into ascending order', async () => {
    useSortStore.setState({
      array: [30, 10, 20],
      isSorting: false,
    });

    const { getByRole } = render(<Visualizer />);

    const sortBtn = getByRole('button', { name: 'Bubble Sort' });
    await act(async () => {
      fireEvent.click(sortBtn);
      // Wait for bubbleSort to finish its setTimeout steps
      await new Promise(r => setTimeout(r, 300));
    });

    const state = useSortStore.getState();
    expect(state.array).toEqual([10, 20, 30]);
    expect(state.isSorting).toBe(false);
  });

  it('should render Page with Back link and Sorting Visualizer title', () => {
    const { getByText, getByRole } = render(<Page />);

    const backLink = getByText('Back');
    expect(backLink).toBeInTheDocument();
    expect(backLink.getAttribute('href')).toBe('/projects');

    expect(getByText('Sorting Visualizer')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Bubble Sort' })).toBeInTheDocument();
  });
});
