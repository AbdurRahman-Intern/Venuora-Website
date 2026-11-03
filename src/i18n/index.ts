// ---------------------------------------------------------------------------
// TRANSLATION INITIALISATION (i18next + react-i18next)
//
// How language switching works (read this before changing anything):
//   1. All interface text lives in src/i18n/locales/<code>.json and is looked up with t('group.key').
//   2. The chosen language is saved in localStorage (LANGUAGE_STORAGE_KEY) so it survives refreshes
//      and page navigation. On first visit we use the browser language if we support it, else English.
//   3. Whenever the language changes, applyDocumentLanguage() updates <html lang> and <html dir>.
//      Tailwind's `rtl:` variants, CSS logical properties and the fonts all react to that attribute.
//
// FALLBACK: if a key is missing in Arabic/Dari/Pashto, i18next shows the English text instead of
// the raw key. Run `npm run check:i18n` to list missing keys.
// ---------------------------------------------------------------------------
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';
import faAF from './locales/fa-AF.json';
import psAF from './locales/ps-AF.json';
import { DEFAULT_LOCALE, LANGUAGE_STORAGE_KEY, LOCALES, getLocaleMeta } from '../config/locales';

/** Reads the saved language, or guesses from the browser, or falls back to English. */
function detectInitialLanguage(): string {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && LOCALES.some((l) => l.code === saved)) return saved;
  } catch { /* localStorage blocked: ignore */ }

  // navigator.languages looks like ['fa-AF', 'en-US']. Match full code first, then the base language.
  for (const tag of navigator.languages ?? []) {
    const lower = tag.toLowerCase();
    const match = LOCALES.find((l) => l.code.toLowerCase() === lower)
      ?? LOCALES.find((l) => l.code.split('-')[0].toLowerCase() === lower.split('-')[0]);
    if (match) return match.code;
  }
  return DEFAULT_LOCALE;
}

/** Writes lang + dir on <html>. If you break this, RTL languages will render left-to-right. */
export function applyDocumentLanguage(code: string) {
  const meta = getLocaleMeta(code);
  document.documentElement.lang = meta.htmlLang;
  document.documentElement.dir = meta.dir;
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    'fa-AF': { translation: faAF },
    'ps-AF': { translation: psAF },
  },
  lng: detectInitialLanguage(),
  fallbackLng: DEFAULT_LOCALE,   // missing key in another language -> English
  supportedLngs: LOCALES.map((l) => l.code),
  load: 'currentOnly',           // don't try to load "fa" when "fa-AF" is requested
  interpolation: { escapeValue: false }, // React already escapes output
  returnNull: false,
});

applyDocumentLanguage(i18n.language);

// Runs every time the user picks another language.
i18n.on('languageChanged', (code) => {
  applyDocumentLanguage(code);
  try { localStorage.setItem(LANGUAGE_STORAGE_KEY, code); } catch { /* ignore */ }
});

export default i18n;
