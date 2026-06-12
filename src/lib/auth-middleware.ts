import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

/**
 * Lightweight auth config for middleware use only.
 * No Prisma adapter — JWT decoding works with just the secret.
 */
const config: NextAuthConfig = {
  providers: [],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || "";
        session.user.role = (token.role as string) || "USER";
        session.user.onboardingDone = (token.onboardingDone as boolean) ?? false;
        session.user.targetExam = (token.targetExam as string) ?? null;
      }
      return session;
    },
  },
};

export const { auth } = NextAuth(config);
