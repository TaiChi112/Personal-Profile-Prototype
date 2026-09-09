import { expect, test, describe, beforeEach } from 'bun:test';
import { useSessionStore } from '../../../../app/store/useSessionStore';

describe('useSessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState({
      isAdmin: false,
    });
  });

  test('should initialize with default state', () => {
    const state = useSessionStore.getState();
    expect(state.isAdmin).toBe(false);
  });

  test('should update isAdmin', () => {
    useSessionStore.getState().setIsAdmin(true);
    expect(useSessionStore.getState().isAdmin).toBe(true);
  });

  test('should toggle isAdmin correctly', () => {
    const toggle = useSessionStore.getState().toggleRole;
    toggle();
    expect(useSessionStore.getState().isAdmin).toBe(true);
    toggle();
    expect(useSessionStore.getState().isAdmin).toBe(false);
  });
});
