"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface TopBarProps {
  title?: string;
  onMenuClick?: () => void;
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          className="md:hidden rounded-xl p-2 text-slate-500 hover:bg-slate-100 transition-colors"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        {title ? (
          <h1 className="text-base sm:text-lg font-semibold text-slate-800">{title}</h1>
        ) : (
          <div />
        )}
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-500" />
        </button>
        {user && (
          <button
            onClick={() => router.push("/settings")}
            className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-100 transition-colors"
          >
            <div className="relative h-8 w-8 shrink-0">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.removeProperty("display"); }}
                />
              ) : null}
              <div
                className="h-8 w-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-semibold"
                style={user.avatarUrl ? { display: "none" } : {}}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-700">{user.name}</span>
          </button>
        )}
        <Button variant="ghost" size="sm" onClick={handleLogout} leftIcon={<LogOut size={16} />}>
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
