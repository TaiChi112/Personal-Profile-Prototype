import { expect, test, describe, mock, beforeEach } from 'bun:test';
import { renderHook, act, fireEvent } from '@testing-library/react';
import { useTourCommandOrchestration } from '../../../../app/features/composition/useTourCommandOrchestration';
import { historyManager } from '../../../../app/models/command/Commands';
import type { TourStep } from '../../../../app/models/tour/Tour';

describe('useTourCommandOrchestration', () => {
  const defaultProps = {
    activeTab: 'home',
    styleKey: 'modern' as const,
    setTourTab: mock(() => {}),
    setActiveTab: mock(() => {}),
    setStyleKey: mock(() => {}),
    toggleDark: mock(() => {}),
    toggleRole: mock(() => {}),
    notify: mock(() => {}),
  };

  beforeEach(() => {
    Object.values(defaultProps).forEach((prop) => {
      if (typeof prop.mockClear === 'function') {
        prop.mockClear();
      }
    });
    // Clear history
    while (historyManager.pop()) {}
  });

  test('should initialize with default states', () => {
    const { result } = renderHook(() => useTourCommandOrchestration(defaultProps));
    expect(result.current.isCommandOpen).toBe(false);
    expect(result.current.isTourActive).toBe(false);
    expect(result.current.activeNodeId).toBeNull();
    expect(result.current.commands).toBeDefined();
    expect(result.current.tourIterator).toBeDefined();
  });

  test('startTour and stopTour should update isTourActive', () => {
    const { result } = renderHook(() => useTourCommandOrchestration(defaultProps));
    
    act(() => {
      result.current.startTour();
    });
    expect(result.current.isTourActive).toBe(true);
    expect(defaultProps.setTourTab).toHaveBeenCalledWith('home');

    act(() => {
      result.current.stopTour();
    });
    expect(result.current.isTourActive).toBe(false);
  });

  test('handleTourStep should handle NAV step', () => {
    const { result } = renderHook(() => useTourCommandOrchestration(defaultProps));
    
    act(() => {
      result.current.handleTourStep({ type: 'NAV', targetId: 'projects', label: 'Projects' } as TourStep);
    });
    
    expect(defaultProps.setTourTab).toHaveBeenCalledWith('projects');
    expect(result.current.activeNodeId).toBeNull();
  });

  test('handleTourStep should handle EXPAND step', () => {
    const { result } = renderHook(() => useTourCommandOrchestration(defaultProps));
    
    act(() => {
      result.current.handleTourStep({ type: 'EXPAND', targetId: 'node-1', label: 'Expand' } as TourStep);
    });
    
    expect(result.current.activeNodeId).toBe('node-1');
  });

  test('handleUndo should call notify if nothing to undo', () => {
    const { result } = renderHook(() => useTourCommandOrchestration(defaultProps));
    
    act(() => {
      result.current.handleUndo();
    });
    
    expect(defaultProps.notify).toHaveBeenCalledWith('Nothing to undo', 'INFO');
  });

  test('should handle Cmd+K to open command palette', () => {
    const { result } = renderHook(() => useTourCommandOrchestration(defaultProps));
    
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
      globalThis.dispatchEvent(event);
    });
    
    expect(result.current.isCommandOpen).toBe(true);
  });
});
