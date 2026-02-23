"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Brain,
  Sparkles,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/learn/vocab", label: "Vocabulary", icon: <BookOpen size={18} /> },
  { href: "/learn/sentences", label: "Sentences", icon: <GraduationCap size={18} /> },
  { href: "/tutor", label: "AI Tutor", icon: <MessageSquare size={18} /> },
  { href: "/quiz", label: "Quiz", icon: <Brain size={18} /> },
  { href: "/content", label: "Content", icon: <Sparkles size={18} /> },
  { href: "/settings", label: "Settings", icon: <Settings size={18} /> },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        "flex flex-col bg-white border-r border-slate-200 h-screen sticky top-0 transition-all duration-200 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-100 px-4">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-sm">
            V
          </div>
          {!collapsed && (
            <span className="text-base font-bold text-slate-800 whitespace-nowrap">
              VietLearn
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              {!collapsed && active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      {user && !collapsed && (
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-3 rounded-xl bg-amber-50 px-3 py-2">
            <Flame size={16} className="text-amber-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-700 truncate">{user.name}</p>
              <p className="text-xs text-amber-500">{user.streakDays} day streak 🔥</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex h-10 w-full items-center justify-center border-t border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
