// ---------------------------------------------------------------------------
// AVAILABILITY MANAGEMENT: the same Calendar component in "manage" mode. Clicking a date toggles it
// in the demo store; the public site's calendar and inquiry form read the very same list, so the
// owner can see the effect immediately.
// IMPORTANT concept shown to the user: "unavailable" is NOT a reservation (no customer, no overlap check).
// ---------------------------------------------------------------------------
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader';
import Calendar from '../../components/common/Calendar';
import { useUnavailableDates } from '../../services/demoStore';
import { useLocale } from '../../hooks/useLocale';
import { formatNumber } from '../../utils/dates';

export default function AvailabilityPage() {
  const { t } = useTranslation();
  const { intl } = useLocale();
  const { unavailableDates, toggleDate } = useUnavailableDates();
  return (
    <>
      <PageHeader title={t('dashboard.availability.title')} subtitle={t('dashboard.availability.intro')} />
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="card w-full max-w-md p-5"><Calendar mode="manage" unavailable={unavailableDates} onSelect={toggleDate} /></div>
        <div className="space-y-4">
          <p className="card p-5 font-serif text-xl text-emerald" aria-live="polite">{t('dashboard.availability.count', { count: unavailableDates.length, formattedCount: formatNumber(unavailableDates.length, intl) })}</p>
          <div className="flex gap-3 rounded-xl bg-gold/15 p-5 text-sm leading-relaxed text-charcoal/80">
            <Info size={18} className="mt-0.5 shrink-0 text-gold-dark" aria-hidden="true" />
            <div><p className="font-semibold text-emerald">{t('dashboard.availability.noteTitle')}</p><p className="mt-1">{t('dashboard.availability.note')}</p></div>
          </div>
        </div>
      </div>
    </>
  );
}
