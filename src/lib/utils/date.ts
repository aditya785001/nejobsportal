import { format, formatDistanceToNow, isPast, isToday, differenceInDays } from "date-fns";

/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date | string, pattern: string = "dd MMM yyyy"): string {
  return format(new Date(date), pattern);
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy, hh:mm a");
}

/**
 * Get relative time (e.g., "3 days ago")
 */
export function timeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Check if a date is past (deadline expired)
 */
export function isDeadlinePassed(date: Date | string): boolean {
  return isPast(new Date(date));
}

/**
 * Check if a date is today
 */
export function isDateToday(date: Date | string): boolean {
  return isToday(new Date(date));
}

/**
 * Get days remaining until a date
 */
export function daysRemaining(date: Date | string): number {
  return differenceInDays(new Date(date), new Date());
}

/**
 * Format remaining time in days
 */
export function formatRemainingDays(date: Date | string): string {
  const days = daysRemaining(date);
  if (days < 0) return "Expired";
  if (days === 0) return "Last day today";
  if (days === 1) return "1 day remaining";
  return `${days} days remaining`;
}

/**
 * Get countdown urgency class
 */
export function getUrgencyClass(date: Date | string): string {
  const days = daysRemaining(date);
  if (days < 0) return "text-gray-400";
  if (days <= 3) return "text-red-600 font-bold";
  if (days <= 7) return "text-orange-500";
  if (days <= 15) return "text-yellow-600";
  return "text-green-600";
}
