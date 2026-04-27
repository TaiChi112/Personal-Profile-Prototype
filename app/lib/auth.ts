import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

const OWNER_EMAIL = 'anothai.0978452316@gmail.com';

function getFallbackAuthClaims(email: string, provider?: string) {
  if (email === OWNER_EMAIL) {
    return {
      userId: email,
      role: 'admin',
      authProvider: provider ?? 'google',
    };
  }

  return {
    userId: email,
    role: 'viewer',
    authProvider: provider,
  };
}

async function safeFindUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true, provider: true },
    });
  } catch (error) {
    console.warn('Auth DB lookup failed, using fallback claims:', error);
    return null;
  }
}

async function safeUpsertUser(email: string, name: string | null | undefined, image: string | null | undefined, provider: string, providerAccountId: string): Promise<void> {
  try {
    await prisma.user.upsert({
      where: { email },
      update: {
        name,
        image,
        provider,
        providerAccountId,
      },
      create: {
        email,
        name,
        image,
        provider,
        providerAccountId,
      },
    });
  } catch (error) {
    console.warn('Auth DB sync skipped because database is unavailable:', error);
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
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

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const isAdminLogin = credentials.email === adminEmail && credentials.password === adminPassword;
        const isViewerLogin = credentials.email !== adminEmail && credentials.password === viewerPassword;

        if (!isAdminLogin && !isViewerLogin) {
          return null;
        }

        const dbUser = await safeFindUserByEmail(credentials.email);

        if (dbUser) {
          if (isAdminLogin && dbUser.role !== 'admin') {
            return null;
          }

          if (isViewerLogin && dbUser.role !== 'viewer') {
            return null;
          }

          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
          };
        }

        return {
          id: credentials.email,
          email: credentials.email,
          name: credentials.email,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account?.provider) {
        return false;
      }

      const providerAccountId = account.providerAccountId ?? user.email;

      await safeUpsertUser(user.email, user.name, user.image, account.provider, providerAccountId);

      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.email) {
        const fallbackClaims = getFallbackAuthClaims(user.email, account?.provider ?? token.authProvider);

        token.userId = fallbackClaims.userId;
        token.role = fallbackClaims.role;
        token.authProvider = fallbackClaims.authProvider;

        const dbUser = await safeFindUserByEmail(user.email);

        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.role;
          token.authProvider = dbUser.provider;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.authProvider = token.authProvider;
      }

      return session;
    },
  },
};
