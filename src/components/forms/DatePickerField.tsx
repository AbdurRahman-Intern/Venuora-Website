// ---------------------------------------------------------------------------
// DatePickerField: a button that shows the chosen date (formatted for the active language) and
// opens the shared Calendar in a popover. Used inside the inquiry form so customers can only pick
// dates the venue has not marked unavailable.
// The popover is anchored with `start-0` (logical) so it aligns correctly in LTR and RTL.
// ---------------------------------------------------------------------------
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays } from 'lucide-react';
import Calendar from '../common/Calendar';
import { useLocale } from '../../hooks/useLocale';
import { formatDate } from '../../utils/dates';

interface Props {
  id: string;
  value: string;
  onChange: (iso: string) => void;
  unavailable: string[];
  minDate?: string;
  invalid?: boolean;
  describedBy?: string;
}

export default function DatePickerField({ id, value, onChange, unavailable, minDate, invalid, describedBy }: Props) {
  const { t } = useTranslation();
  const { intl } = useLocale();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => setOpen((o) => !o)}
        className={`field flex items-center justify-between gap-2 text-start ${invalid ? 'field-error' : ''}`}
      >
        <span className={value ? '' : 'text-charcoal/40'}>{value ? formatDate(value, intl) : t('forms.chooseDate')}</span>
        <CalendarDays size={16} className="text-gold-dark" aria-hidden="true" />
      </button>
      {open && (
        <div role="dialog" aria-label={t('forms.chooseDate')} className="absolute start-0 z-30 mt-2 rounded-xl border border-emerald/10 bg-white p-4 shadow-xl">
          <Calendar mode="select" value={value} unavailable={unavailable} minDate={minDate}
            onSelect={(iso) => { onChange(iso); setOpen(false); }} showLegend={false} />
        </div>
      )}
    </div>
  );
}
