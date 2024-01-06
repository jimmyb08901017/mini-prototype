import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { privateEnv } from "../env/private";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: privateEnv.AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: privateEnv.AUTH_GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const email = token.email || session?.user?.email;
      if (!email) return session;
      const [user] = await db
        .select({
          id: usersTable.displayId,
          username: usersTable.username,
          provider: usersTable.provider,
          email: usersTable.email,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase()))
        .execute();

      return {
        ...session,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          provider: user.provider,
        },
      };
    },

    async jwt({ token, account }) {
      // Sign in with social account, e.g. GitHub, Google, etc.
      if (!account) return token;
      const { name, email } = token;
      const provider = account.provider;
      if (!name || !email || !provider) return token;

      // Check if the email has been registered
      const [existedUser] = await db
        .select({
          id: usersTable.displayId,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase()))
        .execute();
      if (existedUser) return { ...token, id: existedUser.id };
      if (provider !== "google") return token;

      // Sign up
      const [newUser] = await db
        .insert(usersTable)
        .values({
          username: name,
          email: email.toLowerCase(),
          provider,
        })
        .returning();

      return {
        ...token,
        id: newUser.displayId,
      };
    },
  },
  pages: {
    signIn: "/",
  },
});
