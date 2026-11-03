// ---------------------------------------------------------------------------
// AVAILABILITY CALENDAR (used on the public site AND in the dashboard)
//
// mode="select": a customer picks a free date. Unavailable and past dates are disabled.
// mode="manage": the venue owner toggles dates unavailable/available. Past dates are disabled.
//
// All data comes in through props, so this component never reads storage itself.
// Dates are "YYYY-MM-DD" strings (see utils/dates.ts for why).
//
// KEYBOARD (WAI-ARIA grid pattern): arrow keys move between days, PageUp/PageDown change month,
// Home/End jump to the first/last day of the week. Only ONE day is tabbable at a time (roving
// tabindex) so Tab doesn't have to cross 30 buttons.
//
// RTL: in a right-to-left layout the first weekday column is on the RIGHT, so pressing the
// RIGHT arrow must move to the PREVIOUS day. That is what `horizontalStep` below handles. If you
// remove it, keyboard navigation will feel backwards in Arabic, Dari and Pashto.
// ---------------------------------------------------------------------------
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '../../hooks/useLocale';
import { addDays, addMonths, buildMonthGrid, formatDate, formatMonthYear, formatNumber, parseISODate, todayISO, weekdayNames } from '../../utils/dates';

interface Props {
  mode: 'select' | 'manage';
  value?: string | null;               // selected date (select mode)
  unavailable: string[];
  onSelect: (iso: string) => void;     // select mode: chosen date; manage mode: date to toggle
  minDate?: string;                    // dates before this are disabled (defaults to today)
  showLegend?: boolean;
}

export default function Calendar({ mode, value, unavailable, onSelect, minDate, showLegend = true }: Props) {
  const { t } = useTranslation();
  const { intl, weekStartsOn, isRtl } = useLocale();
  const today = todayISO();
  const min = minDate && minDate > today ? minDate : today;
  const blocked = useMemo(() => new Set(unavailable), [unavailable]);

  const [focusIso, setFocusIso] = useState(value && value >= min ? value : min); // the one tabbable day
  const [visibleMonth, setVisibleMonth] = useState(focusIso);
  const gridRef = useRef<HTMLDivElement>(null);
  const wantsFocus = useRef(false); // true only after a keyboard move, so we don't steal focus on first render

  const weeks = useMemo(() => buildMonthGrid(visibleMonth, weekStartsOn), [visibleMonth, weekStartsOn]);
  const weekdays = useMemo(() => weekdayNames(intl, weekStartsOn), [intl, weekStartsOn]);

  // After a keyboard move, put DOM focus on the newly focused day button.
  useEffect(() => {
    if (!wantsFocus.current) return;
    wantsFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-iso="${focusIso}"]`)?.focus();
  }, [focusIso, visibleMonth]);

  const moveFocus = (iso: string) => {
    wantsFocus.current = true;
    setFocusIso(iso);
    // If the target day is in another month, flip the visible month to show it.
    if (iso.slice(0, 7) !== visibleMonth.slice(0, 7)) setVisibleMonth(iso);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const horizontalStep = isRtl ? -1 : 1; // see RTL note at the top of the file
    const dayOfWeek = (parseISODate(focusIso).getDay() - weekStartsOn + 7) % 7;
    let next: string | null = null;
    switch (e.key) {
      case 'ArrowRight': next = addDays(focusIso, horizontalStep); break;
      case 'ArrowLeft': next = addDays(focusIso, -horizontalStep); break;
      case 'ArrowDown': next = addDays(focusIso, 7); break;
      case 'ArrowUp': next = addDays(focusIso, -7); break;
      case 'Home': next = addDays(focusIso, -dayOfWeek); break;
      case 'End': next = addDays(focusIso, 6 - dayOfWeek); break;
      case 'PageDown': next = addMonths(focusIso, 1); break;
      case 'PageUp': next = addMonths(focusIso, -1); break;
    }
    if (next) { e.preventDefault(); moveFocus(next); }
  };

  const monthIsMin = visibleMonth.slice(0, 7) <= min.slice(0, 7); // don't browse into the past
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft; // arrows mirror in RTL
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  const statusLabel = (iso: string, isBlocked: boolean, isPast: boolean) =>
    isPast ? t('availability.past') : isBlocked ? t('availability.unavailable') : t('availability.available');

  return (
    <div className="w-full max-w-md">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" disabled={monthIsMin} onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}
          aria-label={t('availability.previousMonth')} className="rounded-lg p-2 text-emerald hover:bg-emerald/5 disabled:opacity-30">
          <PrevIcon size={18} aria-hidden="true" />
        </button>
        <h3 className="!font-sans text-base font-semibold text-emerald" aria-live="polite">{formatMonthYear(visibleMonth, intl)}</h3>
        <button type="button" onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
          aria-label={t('availability.nextMonth')} className="rounded-lg p-2 text-emerald hover:bg-emerald/5">
          <NextIcon size={18} aria-hidden="true" />
        </button>
      </div>

      <div role="grid" aria-label={formatMonthYear(visibleMonth, intl)} ref={gridRef} onKeyDown={onKeyDown}>
        <div role="row" className="grid grid-cols-7 text-center text-xs font-medium text-charcoal/50">
          {weekdays.map((d, i) => <div key={i} role="columnheader" className="py-2">{d}</div>)}
        </div>
        {weeks.map((week, wi) => (
          <div role="row" key={wi} className="grid grid-cols-7">
            {week.map((iso, ci) => {
              if (!iso) return <div role="gridcell" key={ci} />;
              const isPast = iso < min;
              const isBlocked = blocked.has(iso);
              const isSelected = mode === 'select' && value === iso;
              const disabled = isPast || (mode === 'select' && isBlocked); // owners CAN click blocked dates (to free them)
              const isToday = iso === today;
              const cls = [
                'relative m-0.5 flex h-10 items-center justify-center rounded-lg text-sm transition-colors',
                isSelected ? 'bg-emerald font-semibold text-ivory'
                  : isPast ? 'text-charcoal/25'
                  : isBlocked ? 'bg-red-50 text-red-800 line-through decoration-red-400/70' + (mode === 'select' ? ' cursor-not-allowed' : ' hover:bg-red-100')
                  : 'text-charcoal hover:bg-sage',
                isToday && !isSelected ? 'ring-1 ring-gold' : '',
              ].join(' ');
              return (
                <div role="gridcell" key={ci}>
                  <button
                    type="button"
                    data-iso={iso}
                    tabIndex={iso === focusIso ? 0 : -1}
                    disabled={disabled}
                    aria-pressed={mode === 'manage' ? isBlocked : isSelected}
                    aria-label={`${formatDate(iso, intl)}, ${statusLabel(iso, isBlocked, isPast)}`}
                    onClick={() => { setFocusIso(iso); onSelect(iso); }}
                    className={`${cls} w-[calc(100%-0.25rem)]`}
                  >
                    {formatNumber(parseISODate(iso).getDate(), intl)}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {showLegend && (
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-charcoal/70">
          <li className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded bg-white ring-1 ring-emerald/30" />{t('availability.available')}</li>
          <li className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded bg-red-100 ring-1 ring-red-300" />{t('availability.unavailable')}</li>
          {mode === 'select' && <li className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded bg-emerald" />{t('availability.selected')}</li>}
          <li className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded ring-1 ring-gold" />{t('availability.today')}</li>
        </ul>
      )}
    </div>
  );
}
