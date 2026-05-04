/**
 * Auth.js v5 Module Augmentation
 *
 * Rules for v5 type augmentation:
 * 1. Augment `Session` in the `next-auth` module.
 * 2. Augment `JWT` in the `@auth/core/jwt` module (NOT `next-auth/jwt`).
 * 3. Never fully redeclare `user` — always intersect with `DefaultSession['user']`
 *    to preserve base fields (name, email, image).
 */

import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in Session type with custom user fields.
   * The intersection `& DefaultSession['user']` preserves the v5 base
   * fields (name, email, image, id) so we don't destroy them.
   */
  interface Session {
    user: {
      /** Internal database UUID */
      id: string;
      /** 'admin' | 'viewer' */
      role: string;
      /** e.g. 'google' | 'credentials' */
      authProvider: string;
    } & DefaultSession['user'];
  }

  /**
   * Extends the User object returned by the `authorize` callback
   * or OAuth profile. These fields may be undefined on initial sign-in
   * before a DB lookup is performed in the jwt callback.
   */
  interface User {
    role?: string;
    authProvider?: string;
  }
}

declare module '@auth/core/jwt' {
  /**
   * Extends the JWT payload with the custom claims we write in the
   * `jwt` callback inside authConfig. All fields are optional because
   * on the very first token creation they haven't been written yet.
   */
  interface JWT {
    /** Internal database UUID (written from DB or falls back to email) */
    userId?: string;
    /** 'admin' | 'viewer' */
    role?: string;
    /** e.g. 'google' | 'credentials' */
    authProvider?: string;
  }
}