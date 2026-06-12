import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // Dev-only credentials provider (disabled in production)
    ...(process.env.DEV_ADMIN_PASSWORD
      ? [
          Credentials({
            id: "dev-credentials",
            name: "Dev Admin",
            credentials: {
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              if (credentials?.password === process.env.DEV_ADMIN_PASSWORD) {
                // Return a dev admin user (find or create in DB)
                let user = await prisma.user.findFirst({
                  where: { email: "admin@nejobsportal.dev" },
                });
                if (!user) {
                  user = await prisma.user.create({
                    data: {
                      email: "admin@nejobsportal.dev",
                      name: "Dev Admin",
                      role: "ADMIN",
                      emailVerified: new Date(),
                    },
                  });
                }
                return {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  role: user.role,
                };
              }
              return null;
            },
          }),
        ]
      : []),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM || "noreply@nejobsportal.in",
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        if (user.id) token.id = user.id;
        token.role = (user as any).role || "USER";
        // Fetch onboarding status from DB on first sign-in
        if (user.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { onboardingDone: true, targetExam: true },
          });
          token.onboardingDone = dbUser?.onboardingDone ?? false;
          token.targetExam = dbUser?.targetExam ?? null;
        }
      }
      if (trigger === "update") {
        // Re-fetch from DB to get the latest onboarding status
        if (token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { onboardingDone: true, targetExam: true, name: true, email: true, image: true },
          });
          if (dbUser) {
            token.onboardingDone = dbUser.onboardingDone;
            token.targetExam = dbUser.targetExam;
            if (dbUser.name) token.name = dbUser.name;
            if (dbUser.email) token.email = dbUser.email;
            if (dbUser.image) token.picture = dbUser.image;
          }
        }
      }
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
});
