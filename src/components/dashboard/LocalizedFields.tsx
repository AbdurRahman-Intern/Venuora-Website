// ---------------------------------------------------------------------------
// LocalizedFields: one input per language for a piece of business content (name, description...).
// English is the required fallback. Each box is tagged with lang/dir so Arabic-script text is typed
// right-to-left even when the dashboard itself is in English (and the reverse).
// This edits the VENUE'S stored content - it is independent of the interface language.
// ---------------------------------------------------------------------------
import { LOCALES } from '../../config/locales';
import type { LocalizedText } from '../../types';

interface Props { idPrefix: string; label: string; value: LocalizedText; onChange: (v: LocalizedText) => void; multiline?: boolean; error?: string; requiredEnglish?: boolean }

export default function LocalizedFields({ idPrefix, label, value, onChange, multiline, error, requiredEnglish = true }: Props) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-1 text-sm font-medium text-emerald">{label}</legend>
      {LOCALES.map((l) => {
        const id = `${idPrefix}-${l.code}`;
        const props = {
          id, lang: l.htmlLang, dir: l.dir, value: (value as Record<string, string | undefined>)[l.code] ?? '',
          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...value, [l.code]: e.target.value } as LocalizedText),
          className: `field ${l.code === 'en' && error ? 'field-error' : ''}`,
          'aria-invalid': l.code === 'en' && error ? true : undefined,
        };
        return (
          <div key={l.code}>
            <label htmlFor={id} className="mb-1 flex items-center gap-2 text-xs text-charcoal/60">
              <span lang={l.htmlLang}>{l.nativeName}</span>{l.code === 'en' && requiredEnglish && <span className="text-red-700" aria-hidden="true">*</span>}
            </label>
            {multiline ? <textarea rows={3} {...props} /> : <input type="text" {...props} />}
          </div>
        );
      })}
      {error && <p role="alert" className="text-xs font-medium text-red-700">{error}</p>}
    </fieldset>
  );
}
