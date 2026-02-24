"use client";

import type { ReactNode } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { AuthProvider } from "@/hooks/useAuth";
import { setToken, setAvatarUrl } from "@/lib/api/client";

function PreTokenSeeder({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (status === "authenticated" && session?.accessToken) {
    setToken(session.accessToken);
    // Seed Google profile picture so normalizeUser can pick it up
    if (session.user?.image) {
      setAvatarUrl(session.user.image);
    }
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
