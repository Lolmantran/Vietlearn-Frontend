import { cn } from "@/lib/utils/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeMap = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export function Spinner({ size = "md", className, label }: SpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-teal-500 border-t-transparent",
          sizeMap[size]
        )}
        aria-label={label ?? "Loading"}
      />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size="lg" label="Loading…" />
    </div>
  );
}
