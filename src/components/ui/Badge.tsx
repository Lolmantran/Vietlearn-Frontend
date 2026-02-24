import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "teal" | "amber";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

const variantMap: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  teal: "bg-teal-100 text-teal-700",
  amber: "bg-orange-100 text-orange-700",
};

export function Badge({ variant = "default", size = "md", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === "md" ? "px-2.5 py-0.5 text-xs" : "px-2 py-0.5 text-[11px]",
        variantMap[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
