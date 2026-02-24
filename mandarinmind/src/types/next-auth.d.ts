import "next-auth";

declare module "next-auth" {
  interface Session {
    /** Backend JWT obtained after exchanging the Google ID token */
    accessToken?: string;
    /** Raw user object returned by the backend */
    backendUser?: unknown;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    backendUser?: unknown;
  }
}
