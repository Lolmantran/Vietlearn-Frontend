import { formatDistanceToNow, format } from "date-fns";

/**
 * Formatting utility functions
 */

/**
 * Format a date relative to now (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, formatStr: string = "PPP"): string {
  return format(new Date(date), formatStr);
}

/**
 * Format XP with commas for thousands
 */
export function formatXP(xp: number): string {
  return xp.toLocaleString();
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

/**
 * Format streak count with appropriate suffix
 */
export function formatStreak(days: number): string {
  return `${days} day${days !== 1 ? "s" : ""}`;
}
