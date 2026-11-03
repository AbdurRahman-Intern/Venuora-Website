// ---------------------------------------------------------------------------
// LANGUAGE SELECTOR
// A button that opens a small menu with the four languages, each in its own script.
// - Closes on outside click and on Escape (focus returns to the button).
// - The menu is anchored with `end-0` (logical property) so it opens toward the screen's inner
//   edge in BOTH directions: right-aligned in LTR, left-aligned in RTL.
// - Choosing a language calls i18n.changeLanguage(); the listener in src/i18n/index.ts then saves
//   the choice and updates <html lang/dir>.
// `tone="dark"` is for use on dark backgrounds (hero, footer).
// ---------------------------------------------------------------------------
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { LOCALES, getLocaleMeta } from '../../config/locales';

export default function LanguageSelector({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const current = getLocaleMeta(i18n.language);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); } };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const text = tone === 'dark' ? 'text-ivory hover:bg-white/10' : 'text-emerald hover:bg-emerald/5';

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t('common.language')}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${text}`}
      >
        <Globe size={16} aria-hidden="true" />
        <span lang={current.htmlLang}>{current.nativeName}</span>
        <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul className="absolute end-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-emerald/10 bg-white py-1 shadow-xl">
          {LOCALES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                lang={l.htmlLang}
                dir={l.dir}
                aria-current={l.code === current.code}
                onClick={() => { i18n.changeLanguage(l.code); setOpen(false); buttonRef.current?.focus(); }}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm text-charcoal hover:bg-sage/50"
              >
                <span>{l.nativeName}</span>
                {l.code === current.code && <Check size={15} className="text-gold-dark" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
