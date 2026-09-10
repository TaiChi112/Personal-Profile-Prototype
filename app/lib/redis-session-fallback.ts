import type { Session } from "next-auth";

/**
 * A fallback session getter for NextAuth when Redis is unavailable.
 */
export async function getFallbackSession(): Promise<Session | null> {
  return {
    user: {
      name: "Fallback User",
      email: "fallback@example.com",
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}
