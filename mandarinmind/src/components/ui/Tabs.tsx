"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  children: (activeTab: string) => ReactNode;
  className?: string;
  variant?: "underline" | "pills";
}

export function Tabs({ tabs, defaultTab, onChange, children, className, variant = "underline" }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "");

  const handleChange = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex",
          variant === "underline" ? "border-b border-slate-200" : "gap-1 rounded-xl bg-slate-100 p-1"
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium transition-all duration-150",
              variant === "underline"
                ? cn(
                    "px-4 py-2.5 -mb-px border-b-2",
                    active === tab.id
                      ? "border-teal-600 text-teal-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  )
                : cn(
                    "flex-1 justify-center rounded-lg px-4 py-2",
                    active === tab.id
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-500 hover:text-slate-700"
                  )
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{children(active)}</div>
    </div>
  );
}
