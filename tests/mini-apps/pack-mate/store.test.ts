import { describe, it, expect, beforeEach } from 'bun:test';
import { usePackStore } from '@/app/projects/(micro-apps)/pack-mate/store/usePackStore';

describe('usePackStore Zustand Store', () => {
  beforeEach(() => {
    usePackStore.setState({
      tripType: 'Beach',
      items: [
        { id: 1, name: 'Sunscreen', type: 'Beach', packed: false },
        { id: 2, name: 'Swimsuit', type: 'Beach', packed: false },
        { id: 3, name: 'Passport', type: 'All', packed: true },
        { id: 4, name: 'Phone Charger', type: 'All', packed: false },
        { id: 5, name: 'Winter Coat', type: 'Winter', packed: false },
      ],
    });
  });

  it('should initialize with default tripType and item list', () => {
    const state = usePackStore.getState() as any;
    expect(state.tripType).toBe('Beach');
    expect(state.items).toHaveLength(5);
    expect(state.items[0]).toEqual({ id: 1, name: 'Sunscreen', type: 'Beach', packed: false });
    expect(state.items[2]).toEqual({ id: 3, name: 'Passport', type: 'All', packed: true });
  });

  it('should set tripType to different values', () => {
    const { setTripType } = usePackStore.getState() as any;
    setTripType('Winter');
    expect((usePackStore.getState() as any).tripType).toBe('Winter');

    setTripType('Business');
    expect((usePackStore.getState() as any).tripType).toBe('Business');
  });

  it('should toggle packed state for an existing item', () => {
    const { togglePack } = usePackStore.getState() as any;

    // Toggle id 1: Sunscreen false -> true
    togglePack(1);
    let items = (usePackStore.getState() as any).items;
    expect(items.find((i: any) => i.id === 1).packed).toBe(true);

    // Toggle id 1 again: true -> false
    togglePack(1);
    items = (usePackStore.getState() as any).items;
    expect(items.find((i: any) => i.id === 1).packed).toBe(false);

    // Toggle id 3: Passport true -> false
    togglePack(3);
    items = (usePackStore.getState() as any).items;
    expect(items.find((i: any) => i.id === 3).packed).toBe(false);
  });

  it('should not modify items when toggling non-existent id', () => {
    const { togglePack } = usePackStore.getState() as any;
    togglePack(999);
    const items = (usePackStore.getState() as any).items;
    expect(items).toHaveLength(5);
    expect(items.find((i: any) => i.id === 1).packed).toBe(false);
  });
});
