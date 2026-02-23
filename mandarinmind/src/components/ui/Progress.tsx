import { cn } from "@/lib/utils/cn";

interface ProgressProps {
  value: number; // 0-100
  max?: number;
  color?: "teal" | "amber" | "emerald" | "violet" | "rose";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

const colorMap: Record<NonNullable<ProgressProps["color"]>, string> = {
  teal: "bg-teal-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
};

const sizeMap: Record<NonNullable<ProgressProps["size"]>, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function Progress({
  value,
  max = 100,
  color = "teal",
  size = "md",
  showLabel = false,
  label,
  className,
  animated = false,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="text-xs text-slate-500">{label}</span>}
          {showLabel && (
            <span className="text-xs font-medium text-slate-600">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-slate-200", sizeMap[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorMap[color],
            animated && "animate-pulse"
          )}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
