import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:3000/api";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // After Google sign-in, exchange the Google ID token for our backend JWT
      if (account?.id_token) {
        try {
          const res = await fetch(`${API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: account.id_token }),
          });
          const data = await res.json();
          if (data?.data?.accessToken) {
            token.accessToken = data.data.accessToken;
            token.backendUser = data.data.user;
          }
        } catch (err) {
          console.error("[NextAuth] Google token exchange failed:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.backendUser = token.backendUser as unknown;
      return session;
    },
  },
});
