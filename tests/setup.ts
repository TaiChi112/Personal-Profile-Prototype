import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { expect, afterEach } from 'bun:test';

// Setup DOM Environment before importing testing-library
GlobalRegistrator.register();

const matchers = await import('@testing-library/jest-dom/matchers');
const { cleanup } = await import('@testing-library/react');

// Add testing-library custom matchers to bun:test
expect.extend(matchers);

// Auto-cleanup DOM after each test to prevent document leaking across tests
afterEach(() => {
  cleanup();
});

