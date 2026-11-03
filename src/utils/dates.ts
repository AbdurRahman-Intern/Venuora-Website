// ---------------------------------------------------------------------------
// Date helpers.
//
// IMPORTANT: dates are stored as plain "YYYY-MM-DD" strings (no time, no timezone).
// We deliberately avoid `date.toISOString()` for these: it converts to UTC, so in a timezone like
// Kabul (UTC+4:30) midnight local time becomes the PREVIOUS day. Always use toISODate() below.
// ---------------------------------------------------------------------------

const pad = (n: number) => String(n).padStart(2, '0');

/** Date -> "YYYY-MM-DD" using LOCAL time (not UTC). */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "YYYY-MM-DD" -> Date at local midnight. */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days); // setDate handles month/year overflow for us
  return toISODate(d);
}

export function addMonths(iso: string, months: number): string {
  const d = parseISODate(iso);
  d.setDate(1); // avoid "Jan 31 + 1 month = Mar 3" surprises
  d.setMonth(d.getMonth() + months);
  return toISODate(d);
}

/** Every date from `from` (inclusive) up to `to` (exclusive). Used for hotel nights. */
export function eachDay(from: string, to: string): string[] {
  const out: string[] = [];
  for (let cur = from; cur < to; cur = addDays(cur, 1)) out.push(cur); // ISO strings compare correctly as text
  return out;
}

/**
 * Builds the grid for one month: an array of weeks, each week an array of 7 cells.
 * A cell is either an ISO date string or null (padding before the 1st / after the last day).
 * `weekStartsOn` comes from config/locales.ts (Saturday for the Afghan locales).
 */
export function buildMonthGrid(anyDayInMonth: string, weekStartsOn: number): (string | null)[][] {
  const first = parseISODate(anyDayInMonth);
  first.setDate(1);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const leading = (first.getDay() - weekStartsOn + 7) % 7; // empty cells before day 1
  const cells: (string | null)[] = Array(leading).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(toISODate(new Date(first.getFullYear(), first.getMonth(), day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

// --- Locale-aware formatting (all take the Intl tag from config/locales.ts) -------------------

export function formatDate(iso: string, intl: string, style: 'short' | 'long' = 'long'): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat(intl, style === 'long'
    ? { day: 'numeric', month: 'long', year: 'numeric' }
    : { day: 'numeric', month: 'short', year: 'numeric' }).format(parseISODate(iso));
}

export function formatMonthYear(iso: string, intl: string): string {
  return new Intl.DateTimeFormat(intl, { month: 'long', year: 'numeric' }).format(parseISODate(iso));
}

/** Weekday names in the order the grid shows them (respecting weekStartsOn). */
export function weekdayNames(intl: string, weekStartsOn: number, width: 'short' | 'narrow' = 'short'): string[] {
  const fmt = new Intl.DateTimeFormat(intl, { weekday: width });
  // 2024-01-07 was a Sunday, so offsets 0..6 walk Sunday..Saturday.
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 7 + ((weekStartsOn + i) % 7))));
}

export function formatNumber(n: number, intl: string): string {
  return new Intl.NumberFormat(intl).format(n);
}

export function formatCurrency(amount: number, currency: string, intl: string): string {
  return new Intl.NumberFormat(intl, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}
