// ---------------------------------------------------------------------------
// Small text helpers: localized business content, digit normalisation, WhatsApp links.
// ---------------------------------------------------------------------------
import type { LocalizedText, Locale } from '../types';

/**
 * Pick the venue's text for the active interface language.
 * FALLBACK STRATEGY: requested language -> English. An empty string counts as "missing", so a
 * half-translated venue never shows blank headings. (Interface language and stored content are
 * separate: this function only READS the content, it never modifies it.)
 */
export function pickText(text: LocalizedText | undefined, locale: Locale | string): string {
  if (!text) return '';
  const value = (text as Record<string, string | undefined>)[locale];
  return value && value.trim() ? value : text.en;
}

/**
 * Converts Arabic-Indic (٠١٢…) and Persian/Pashto (۰۱۲…) digits to Western digits (0-9).
 * Users on RTL keyboards often type these, and `Number("٣٠")` is NaN - so we normalise before
 * validating or saving any numeric field or phone number.
 */
export function normalizeDigits(input: string): string {
  return input
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/**
 * Builds a WhatsApp "click to chat" URL.
 *  - wa.me needs the number as digits only, with country code, no "+", spaces or dashes.
 *  - The message must be URL-encoded; encodeURIComponent handles Arabic-script text and new lines.
 * If you pass a number that is not configured (empty), returns '' so the UI can hide the button.
 */
export function buildWhatsAppUrl(number: string, message: string): string {
  const digits = normalizeDigits(number).replace(/\D/g, '').replace(/^00/, '');
  if (!digits) return '';
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Small unique id for demo records. TODO: replace with database auto-increment / UUID from the API. */
export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
