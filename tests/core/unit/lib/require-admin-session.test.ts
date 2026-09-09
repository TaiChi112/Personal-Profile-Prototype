import { expect, test, describe, mock, beforeEach } from 'bun:test';
import { NextResponse } from 'next/server';

// Create mock function for auth
const mockAuth = mock(() => Promise.resolve(null));

// Mock the auth module
mock.module('../../../../app/auth', () => ({
  auth: mockAuth
}));
// Assuming `@/auth` maps to something, but we might just use relative paths if the compiler handles it, 
// wait, `@/auth` is used in `require-admin-session.ts`, we need to mock it via the module path that bun resolves.
mock.module('@/auth', () => ({
  auth: mockAuth
}));

import { requireAuthenticatedSession, requireAdminSession } from '../../../../app/lib/require-admin-session';

describe('Session Guards', () => {
  beforeEach(() => {
    mockAuth.mockReset();
  });

  describe('requireAuthenticatedSession', () => {
    test('returns 401 when no session exists', async () => {
      mockAuth.mockResolvedValueOnce(null);
      
      const result = await requireAuthenticatedSession();
      
      expect(result.session).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.status).toBe(401);
    });

    test('returns 401 when session has no user', async () => {
      mockAuth.mockResolvedValueOnce({ expires: '2099-01-01' }); // no user
      
      const result = await requireAuthenticatedSession();
      
      expect(result.session).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.status).toBe(401);
    });

    test('returns session when authenticated', async () => {
      const validSession = { user: { name: 'Test', role: 'user' }, expires: '2099-01-01' };
      mockAuth.mockResolvedValueOnce(validSession);
      
      const result = await requireAuthenticatedSession();
      
      expect(result.error).toBeNull();
      expect(result.session).toEqual(validSession);
    });
  });

  describe('requireAdminSession', () => {
    test('returns 401 response if unauthenticated', async () => {
      mockAuth.mockResolvedValueOnce(null);
      
      const result = await requireAdminSession();
      expect(result).toBeDefined();
      expect(result?.status).toBe(401);
    });

    test('returns 403 response if authenticated but not admin', async () => {
      const userSession = { user: { name: 'Test', role: 'user' }, expires: '2099-01-01' };
      mockAuth.mockResolvedValueOnce(userSession);
      
      const result = await requireAdminSession();
      expect(result).toBeDefined();
      expect(result?.status).toBe(403);
    });

    test('returns null if authenticated as admin', async () => {
      const adminSession = { user: { name: 'Admin', role: 'admin' }, expires: '2099-01-01' };
      mockAuth.mockResolvedValueOnce(adminSession);
      
      const result = await requireAdminSession();
      expect(result).toBeNull(); // Success condition
    });
  });
});
