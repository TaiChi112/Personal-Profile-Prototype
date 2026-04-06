import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

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

        const dbUser = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, email: true, name: true, role: true },
        });

        if (!dbUser) {
          return null;
        }

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

      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          image: user.image,
          provider: account.provider,
          providerAccountId,
        },
        create: {
          email: user.email,
          name: user.name,
          image: user.image,
          provider: account.provider,
          providerAccountId,
        },
      });

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, role: true },
        });

        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId;
        session.user.role = token.role;
      }

      return session;
    },
  },
};
