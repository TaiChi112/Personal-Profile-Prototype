/**
 * Auth.js v5 Configuration
 *
 * Key v5 patterns used here:
 * - `NextAuthConfig` (replaces `NextAuthOptions`)
 * - `satisfies NextAuthConfig` for strict structural typing
 * - `export { handlers, auth, signIn, signOut }` from `NextAuth(config)`
 * - Callback parameters are inferred — no manual type annotations needed
 */
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

const OWNER_EMAIL = process.env.OWNER_EMAIL;
/**
 * Derives fallback auth claims when the DB is unavailable.
 * The owner email is always granted the 'admin' role.
 */
function getFallbackAuthClaims(
  email: string,
  provider?: string,
): { userId: string; role: string; authProvider: string } {
  if (email === OWNER_EMAIL) {
    return { userId: email, role: 'admin', authProvider: provider ?? 'google' };
  }
  return { userId: email, role: 'viewer', authProvider: provider ?? 'credentials' };
}

/**
 * Safe DB lookup — never throws. Returns null on any error so the
 * jwt callback can fall back to the in-memory claims above.
 */
async function safeFindUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true, provider: true },
    });
  } catch (error) {
    console.warn('[auth] DB lookup failed, using fallback claims:', error);
    return null;
  }
}

/**
 * Safe DB upsert — never throws. Logs a warning and continues if the
 * database is unavailable, so sign-in is not blocked by DB issues.
 */
async function safeUpsertUser(
  email: string,
  name: string | null | undefined,
  image: string | null | undefined,
  provider: string,
  providerAccountId: string,
): Promise<void> {
  try {
    await prisma.user.upsert({
      where: { email },
      update: { name, image, provider, providerAccountId },
      create: { email, name, image, provider, providerAccountId },
    });
  } catch (error) {
    console.warn('[auth] DB sync skipped — database unavailable:', error);
  }
}

/**
 * Auth.js v5 configuration object.
 * `satisfies NextAuthConfig` gives us full type-checking without widening
 * the type to `NextAuthConfig`, which would lose inference on callbacks.
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Admin Test Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_TEST_EMAIL ?? 'admin@example.com';
        const adminPassword = process.env.ADMIN_TEST_PASSWORD ?? 'admin123';
        const viewerPassword = process.env.VIEWER_TEST_PASSWORD ?? 'viewer123';

        if (!credentials?.email || !credentials?.password) return null;

        // credentials.email / .password are `string | undefined` in v5
        const inputEmail = credentials.email as string;
        const inputPassword = credentials.password as string;

        const isAdminLogin = inputEmail === adminEmail && inputPassword === adminPassword;
        const isViewerLogin = inputEmail !== adminEmail && inputPassword === viewerPassword;

        if (!isAdminLogin && !isViewerLogin) return null;

        const dbUser = await safeFindUserByEmail(inputEmail);

        if (dbUser) {
          if (isAdminLogin && dbUser.role !== 'admin') return null;
          if (isViewerLogin && dbUser.role !== 'viewer') return null;
          return { id: dbUser.id, email: dbUser.email, name: dbUser.name };
        }

        // DB unavailable — return a minimal user object; roles resolved in jwt cb
        return { id: inputEmail, email: inputEmail, name: inputEmail };
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    /**
     * Fired on every sign-in. Upserts the user into the DB.
     * Returning `false` blocks the sign-in.
     */
    async signIn({ user, account }) {
      if (!user.email || !account?.provider) return false;
      const providerAccountId = account.providerAccountId ?? user.email;
      await safeUpsertUser(user.email, user.name, user.image, account.provider, providerAccountId);
      return true;
    },

    /**
     * Writes custom claims into the JWT on initial sign-in.
     * On subsequent requests `user` and `account` are undefined — we
     * just pass the token through unchanged.
     */
    async jwt({ token, user, account }) {
      if (user?.email) {
        const providerHint = account?.provider ?? (token.authProvider as string | undefined);
        const fallback = getFallbackAuthClaims(user.email, providerHint);

        // Start with fallback claims (synchronous, always available)
        token.userId = fallback.userId;
        token.role = fallback.role;
        token.authProvider = fallback.authProvider;

        // Attempt to override with authoritative DB values
        const dbUser = await safeFindUserByEmail(user.email);
        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.role;
          token.authProvider = dbUser.provider;
        }
      }
      return token;
    },

    /**
     * Copies custom JWT claims onto the session.user object that is
     * exposed to the client. All fields come from the verified JWT so
     * they cannot be tampered with by the browser.
     */
    async session({ session, token }) {
      if (session.user && token.userId) {
        // token.userId / .role / .authProvider are typed via @auth/core/jwt augmentation
        session.user.id = token.userId;
        session.user.role = token.role ?? 'viewer';
        session.user.authProvider = token.authProvider ?? 'unknown';
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

/**
 * Export the four named Auth.js v5 primitives.
 *
 * - `handlers` → used in `app/api/auth/[...nextauth]/route.ts`
 * - `auth`     → used instead of `getServerSession` in Server Components / API routes
 * - `signIn`   → used in Server Actions for programmatic sign-in
 * - `signOut`  → used in Server Actions for programmatic sign-out
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);