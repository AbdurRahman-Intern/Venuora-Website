// ---------------------------------------------------------------------------
// useLocale(): everything a component needs to know about the active language.
//   const { code, dir, isRtl, intl, tx } = useLocale();
//   tx(venue.name)  -> the venue's name in the active language (with English fallback)
// ---------------------------------------------------------------------------
import { useTranslation } from 'react-i18next';
import { getLocaleMeta } from '../config/locales';
import { pickText } from '../utils/text';
import type { LocalizedText, Locale } from '../types';

export function useLocale() {
  const { i18n } = useTranslation();
  const meta = getLocaleMeta(i18n.language);
  return {
    code: meta.code as Locale,
    dir: meta.dir,
    isRtl: meta.dir === 'rtl',
    intl: meta.intl,
    weekStartsOn: meta.weekStartsOn,
    /** Localized business content (venue/room/package text), not interface text. */
    tx: (text: LocalizedText | undefined) => pickText(text, meta.code),
    setLanguage: (code: Locale) => i18n.changeLanguage(code),
  };
}
