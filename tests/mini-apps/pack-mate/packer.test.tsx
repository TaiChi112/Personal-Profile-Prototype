import { describe, it, expect, beforeEach } from 'bun:test';
import { render, fireEvent, act } from '@testing-library/react';
import Packer from '@/app/projects/(micro-apps)/pack-mate/components/Packer';
import Page from '@/app/projects/(micro-apps)/pack-mate/page';
import { usePackStore } from '@/app/projects/(micro-apps)/pack-mate/store/usePackStore';

describe('PackMate Component and Page', () => {
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

  it('should render items for Beach trip by default with 25% progress', () => {
    const { getByText, queryByText } = render(<Packer />);

    expect(getByText('PackMate', { exact: false })).toBeInTheDocument();
    expect(getByText('25%')).toBeInTheDocument();

    // Beach and All items should be present
    expect(getByText('Sunscreen')).toBeInTheDocument();
    expect(getByText('Swimsuit')).toBeInTheDocument();
    expect(getByText('Passport')).toBeInTheDocument();
    expect(getByText('Phone Charger')).toBeInTheDocument();

    // Winter item should NOT be present
    expect(queryByText('Winter Coat')).toBeNull();
  });

  it('should filter items when selecting Winter trip category', () => {
    const { getByText, queryByText } = render(<Packer />);

    const winterBtn = getByText('Winter');
    act(() => {
      fireEvent.click(winterBtn);
    });

    expect((usePackStore.getState() as any).tripType).toBe('Winter');
    expect(getByText('Winter Coat')).toBeInTheDocument();
    expect(getByText('Passport')).toBeInTheDocument();
    expect(getByText('Phone Charger')).toBeInTheDocument();
    expect(queryByText('Sunscreen')).toBeNull();
    expect(queryByText('Swimsuit')).toBeNull();

    // 1 of 3 packed = 33%
    expect(getByText('33%')).toBeInTheDocument();
  });

  it('should filter items when selecting Business trip category', () => {
    const { getByText, queryByText } = render(<Packer />);

    const businessBtn = getByText('Business');
    act(() => {
      fireEvent.click(businessBtn);
    });

    expect((usePackStore.getState() as any).tripType).toBe('Business');
    expect(getByText('Passport')).toBeInTheDocument();
    expect(getByText('Phone Charger')).toBeInTheDocument();
    expect(queryByText('Sunscreen')).toBeNull();
    expect(queryByText('Winter Coat')).toBeNull();

    // 1 of 2 packed = 50%
    expect(getByText('50%')).toBeInTheDocument();
  });

  it('should toggle item packed status on item click and recalculate progress', () => {
    const { getByText } = render(<Packer />);

    // Click Sunscreen to pack it
    const sunscreenEl = getByText('Sunscreen');
    act(() => {
      fireEvent.click(sunscreenEl);
    });

    // Now 2 of 4 packed = 50%
    expect(getByText('50%')).toBeInTheDocument();
    expect(sunscreenEl).toHaveClass('line-through');

    // Click again to unpack
    act(() => {
      fireEvent.click(sunscreenEl);
    });

    // Back to 25%
    expect(getByText('25%')).toBeInTheDocument();
    expect(sunscreenEl).not.toHaveClass('line-through');
  });

  it('should render full Page with Back link and Packer component', () => {
    const { getByText } = render(<Page />);

    const backLink = getByText('Back', { exact: false });
    expect(backLink).toBeInTheDocument();
    expect(backLink.getAttribute('href')).toBe('/projects');
    expect(getByText('PackMate', { exact: false })).toBeInTheDocument();
  });
});
