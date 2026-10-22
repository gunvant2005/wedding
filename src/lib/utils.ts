import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts with twMerge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an integer cent value as a localized currency string.
 * @param cents - The amount in cents (integer).
 * @param currency - ISO 4217 currency code (default: "USD").
 * @returns Formatted currency string, e.g. "$1,500"
 */
export function formatCurrency(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/**
 * Converts a dollar amount to integer cents, rounding half-up.
 * @param dollars - The dollar amount.
 * @returns Integer cent value.
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Converts an integer cent value to a decimal dollar amount.
 * @param cents - The amount in cents.
 * @returns Dollar amount as a decimal number.
 */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Clamps a cent value between 0 and the configured maximum (2 billion).
 * Useful for preventing invalid database writes.
 * @param cents - The raw cent value to clamp.
 * @param max - Maximum allowed value (default: 2_000_000_000).
 * @returns Clamped integer cent value.
 */
export function clampCents(cents: number, max = 2_000_000_000): number {
  return Math.max(0, Math.min(Math.round(cents), max));
}

/**
 * Formats a ratio (0–1) as a percentage string.
 * @param ratio - Decimal ratio (e.g. 0.75 → "75%").
 * @param digits - Number of decimal places (default: 0).
 * @returns Formatted percentage string.
 */
export function formatPercent(ratio: number, digits = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(ratio);
}

/**
 * Returns the singular or plural form of a word based on count.
 * @param count - The quantity.
 * @param singular - Singular form of the word.
 * @param plural - Plural form (default: `singular + "s"`).
 * @returns The appropriate inflected string including the count.
 * @example pluralize(1, "guest") → "1 guest"
 * @example pluralize(3, "task") → "3 tasks"
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count.toLocaleString("en-US")} ${word}`;
}

/**
 * Computes the number of whole calendar days between today and a future (or past) date.
 * @param date - Target date (Date object or ISO string).
 * @returns Positive number for future dates, 0 for today, negative for past dates.
 */
export function daysUntil(date: Date | string): number {
  const target = typeof date === "string" ? new Date(date) : date;
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
 * Normalizes a title string: trims whitespace, collapses internal spaces,
 * and converts to lowercase for comparison.
 * @param title - Raw title string.
 * @returns Normalized lowercase string.
 */
export function normalizeTitle(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Truncates a string to the specified maximum length, appending an ellipsis
 * if truncation occurred.
 * @param text - Input string.
 * @param maxLength - Maximum character length (default: 80).
 * @returns Truncated string, never exceeding maxLength.
 */
export function truncate(text: string, maxLength = 80): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

/**
 * Returns a budget utilization percentage (0–100), clamped to avoid overflow.
 * @param spentCents - Amount actually spent in cents.
 * @param budgetCents - Total budget in cents.
 * @returns Integer percentage 0–100.
 */
export function budgetUsagePercent(spentCents: number, budgetCents: number): number {
  if (budgetCents <= 0) return 0;
  return Math.min(100, Math.round((spentCents / budgetCents) * 100));
}
