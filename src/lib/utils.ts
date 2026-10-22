import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names and resolves Tailwind CSS class conflicts.
 *
 * @param inputs - List of class names, conditionals, or objects
 * @returns Merged and deduped class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats integer monetary cents into a localized currency string.
 *
 * @param cents - Integer amount in cents (e.g. 150000 = $1,500)
 * @param currency - ISO 4217 currency code (default: USD)
 * @returns Formatted currency string without fraction digits
 */
export function formatCurrency(cents: number, currency = "USD"): string {
  const safeCents = Number.isFinite(cents) ? cents : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(safeCents / 100);
}

/**
 * Converts decimal dollar amount into exact integer cents to eliminate floating-point drift.
 *
 * @param dollars - Amount in standard dollar units
 * @returns Integer cents rounded to nearest whole cent
 */
export function dollarsToCents(dollars: number): number {
  if (!Number.isFinite(dollars)) return 0;
  return Math.round(dollars * 100);
}

/**
 * Converts integer cents into standard decimal dollar units.
 *
 * @param cents - Amount in integer cents
 * @returns Decimal dollars
 */
export function centsToDollars(cents: number): number {
  if (!Number.isFinite(cents)) return 0;
  return cents / 100;
}

/**
 * Calculates the whole calendar days remaining between current date and target event date.
 *
 * @param date - Target date as Date object or ISO string
 * @returns Integer number of days (positive for future, 0 for today, negative for past)
 */
export function daysUntil(date: Date | string): number {
  const target = typeof date === "string" ? new Date(date) : date;
  if (isNaN(target.getTime())) return 0;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Normalizes title string by trimming and collapsing multiple whitespace characters.
 *
 * @param title - Raw input string
 * @returns Cleaned title
 */
export function normalizeTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Computes percentage share of a value relative to a total, bounded between 0 and 100.
 *
 * @param portion - Numeric portion
 * @param total - Total reference value
 * @returns Integer percentage between 0 and 100
 */
export function calculatePercentage(portion: number, total: number): number {
  if (!Number.isFinite(portion) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round((portion / total) * 100)));
}

/**
 * Clamps a number within an inclusive [min, max] range.
 *
 * @param val - Input value
 * @param min - Lower bound
 * @param max - Upper bound
 * @returns Clamped numeric value
 */
export function clamp(val: number, min: number, max: number): number {
  if (!Number.isFinite(val)) return min;
  return Math.min(Math.max(val, min), max);
}
