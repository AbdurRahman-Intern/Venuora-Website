// ---------------------------------------------------------------------------
// LANGUAGE METADATA - the single source of truth for everything that differs per language.
//
// To add a fifth language: add an entry here, create src/i18n/locales/<code>.json,
// and register it in src/i18n/index.ts. Nothing else needs to change.
// ---------------------------------------------------------------------------
import type { Locale } from '../types';

export interface LocaleMeta {
  code: Locale;          // key used by i18next and by LocalizedText
  nativeName: string;    // shown in the language selector, always in its own script
  htmlLang: string;      // value written to <html lang="...">
  dir: 'ltr' | 'rtl';    // value written to <html dir="...">
  /**
   * BCP-47 tag passed to Intl (dates, numbers). The "-u-" extension forces:
   *   ca-gregory = Gregorian calendar (our calendar grid is Gregorian; without this, fa-AF would
   *                default to the Solar Hijri calendar and months would not match the day grid)
   *   nu-latn / nu-arabext = Western digits (0-9) or Persian/Pashto digits (۰-۹)
   * CHANGE nu-arabext to nu-latn if your customers prefer Western digits in Dari/Pashto.
   */
  intl: string;
  weekStartsOn: 0 | 1 | 6; // 0 = Sunday, 1 = Monday, 6 = Saturday
}

export const LOCALES: LocaleMeta[] = [
  { code: 'en',    nativeName: 'English',  htmlLang: 'en',    dir: 'ltr', intl: 'en-GB-u-ca-gregory-nu-latn',       weekStartsOn: 1 },
  { code: 'ar',    nativeName: 'العربية',  htmlLang: 'ar',    dir: 'rtl', intl: 'ar-u-ca-gregory-nu-latn',          weekStartsOn: 6 },
  { code: 'fa-AF', nativeName: 'دری',      htmlLang: 'fa-AF', dir: 'rtl', intl: 'fa-AF-u-ca-gregory-nu-arabext',    weekStartsOn: 6 },
  { code: 'ps-AF', nativeName: 'پښتو',     htmlLang: 'ps',    dir: 'rtl', intl: 'ps-AF-u-ca-gregory-nu-arabext',    weekStartsOn: 6 },
];

export const DEFAULT_LOCALE: Locale = 'en';
export const LANGUAGE_STORAGE_KEY = 'venue-platform:language';

export function getLocaleMeta(code: string): LocaleMeta {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}
