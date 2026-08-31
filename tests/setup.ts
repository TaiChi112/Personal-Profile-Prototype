import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { expect, afterEach } from 'bun:test';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

// Setup DOM Environment
GlobalRegistrator.register();

// Add testing-library custom matchers to bun:test
expect.extend(matchers);

// Auto-cleanup DOM after each test to prevent document leaking across tests
afterEach(() => {
  cleanup();
});
