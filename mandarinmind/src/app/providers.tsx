"use client";

import type { ReactNode } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { AuthProvider } from "@/hooks/useAuth";
import { setToken } from "@/lib/api/client";

/**
 * Waits for NextAuth to resolve its session check, then seeds the backend
 * access token into localStorage BEFORE AuthProvider mounts.
 *
 * This prevents the race where:
 *   AuthProvider calls GET /api/me (no token → 401 → user=null)
 *   ProtectedRoute redirects to /login
 *   ...and only THEN does useSession() fire its effect with the token.
 *
 * By blocking AuthProvider until the session is known, the very first
 * /api/me call already carries the Bearer token.
 */
function PreTokenSeeder({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  // Hold rendering while NextAuth is checking the session cookie
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  // Synchronously seed the token so AuthProvider's first /api/me call has it
  if (status === "authenticated" && session?.accessToken) {
    setToken(session.accessToken);
  }

  return <AuthProvider>{children}</AuthProvider>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <PreTokenSeeder>{children}</PreTokenSeeder>
    </SessionProvider>
  );
}
