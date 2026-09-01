import { expect, test, describe, mock, beforeEach } from 'bun:test';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeControls } from '../../../../../app/components/system/ThemeControls';

// Mock Lucide icons
mock.module('lucide-react', () => ({
  Sun: () => <div data-testid="icon-sun" />,
  Moon: () => <div data-testid="icon-moon" />,
  Terminal: () => <div data-testid="icon-terminal" />,
  RotateCcw: () => <div data-testid="icon-rotate" />,
  Lock: () => <div data-testid="icon-lock" />,
  Unlock: () => <div data-testid="icon-unlock" />,
  Play: () => <div data-testid="icon-play" />,
  MessageCircle: () => <div data-testid="icon-message" />
}));

const mockSetNotificationChannel = mock();
mock.module('../../../../../app/services/system/notification/NotificationBridge', () => ({
  setNotificationChannel: mockSetNotificationChannel
}));

describe('ThemeControls', () => {
  const defaultProps = {
    isDark: false,
    toggleDark: mock(),
    openCommandPalette: mock(),
    undoLastAction: mock(),
    isAdmin: false,
    toggleRole: mock(),
    startTour: mock(),
    isAuthenticated: false,
    userDisplayName: null,
    onSignIn: mock(),
    onSignOut: mock()
  };

  beforeEach(() => {
    mockSetNotificationChannel.mockReset();
    Object.values(defaultProps).forEach(prop => {
      if (typeof prop === 'function' && 'mockReset' in prop) {
        (prop as { mockReset: () => void }).mockReset();
      }
    });
  });

  test('renders light mode icon when isDark is false', () => {
    const { getByTestId, queryByTestId } = render(<ThemeControls {...defaultProps} />);
    expect(getByTestId('icon-moon')).toBeInTheDocument(); // Expecting moon icon to toggle TO dark
  });

  test('renders dark mode icon when isDark is true', () => {
    const { getByTestId } = render(<ThemeControls {...defaultProps} isDark={true} />);
    expect(getByTestId('icon-sun')).toBeInTheDocument(); // Expecting sun icon to toggle TO light
  });

  test('calls toggleDark when theme button is clicked', () => {
    const { getByTitle } = render(<ThemeControls {...defaultProps} />);
    const btn = getByTitle(/Toggle Dark Mode/i);
    fireEvent.click(btn);
    expect(defaultProps.toggleDark).toHaveBeenCalledTimes(1);
  });

  test('calls openCommandPalette when command palette button is clicked', () => {
    const { getByTitle } = render(<ThemeControls {...defaultProps} />);
    const btn = getByTitle(/Command Palette/i);
    fireEvent.click(btn);
    expect(defaultProps.openCommandPalette).toHaveBeenCalledTimes(1);
  });
});
