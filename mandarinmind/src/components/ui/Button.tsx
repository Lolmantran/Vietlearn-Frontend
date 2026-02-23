import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-sm",
    secondary: "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-sm",
    outline:
      "border-2 border-teal-600 text-teal-600 hover:bg-teal-50 active:bg-teal-100 bg-transparent",
    ghost: "text-slate-700 hover:bg-slate-100 active:bg-slate-200 bg-transparent",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-sm",
  };

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
