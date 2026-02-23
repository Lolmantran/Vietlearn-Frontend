"use client";

import { Bell, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface TopBarProps {
  title?: string;
}

export function TopBar({ title }: TopBarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {title ? (
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      ) : (
        <div />
      )}
      <div className="flex items-center gap-3">
        <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-500" />
        </button>
        {user && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-700">{user.name}</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={handleLogout} leftIcon={<LogOut size={16} />}>
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
