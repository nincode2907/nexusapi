import { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

// Extend NextAuth Session to include the user's ID
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for easier edge/SSR compatibility
  },
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign in, attach user id to token
      if (user) {
        token.sub = user.id;
        // Also fetch the role from the db, but user typing is basic here.
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub; // Inject user id into session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
