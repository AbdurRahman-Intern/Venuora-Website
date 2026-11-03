// ---------------------------------------------------------------------------
// AVAILABILITY (public): the shared Calendar in "select" mode plus a summary panel.
// Unavailable dates come from the demo store (editable in the dashboard). The notice makes it clear
// this is sample data and that a free date is NOT a reservation.
// TODO: real-time availability must come from an authoritative server-side source.
// ---------------------------------------------------------------------------
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import Calendar from '../common/Calendar';
import Button from '../common/Button';
import SectionHeading from '../common/SectionHeading';
import { useLocale } from '../../hooks/useLocale';
import { formatDate } from '../../utils/dates';

export default function AvailabilitySection({ unavailable, onContinue }: { unavailable: string[]; onContinue: (iso: string) => void }) {
  const { t } = useTranslation();
  const { intl } = useLocale();
  const [date, setDate] = useState<string | null>(null);
  return (
    <section id="availability" className="section scroll-target bg-ivory">
      <div className="container-page">
        <SectionHeading eyebrow={t('venue.availability.eyebrow')} title={t('venue.availability.title')} subtitle={t('venue.availability.subtitle')} />
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-[auto_1fr] md:items-start">
          <div className="card mx-auto w-full max-w-md p-5"><Calendar mode="select" value={date} unavailable={unavailable} onSelect={setDate} /></div>
          <div>
            <p className="flex gap-3 rounded-xl bg-gold/15 p-4 text-sm leading-relaxed text-charcoal/80"><Info size={18} className="mt-0.5 shrink-0 text-gold-dark" aria-hidden="true" />{t('venue.availability.demoNotice')}</p>
            <div className="card mt-5 p-5" aria-live="polite">
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">{t('venue.availability.yourDate')}</p>
              <p className="mt-1 font-serif text-2xl text-emerald">{date ? formatDate(date, intl) : t('venue.availability.noDate')}</p>
              <Button variant="dark" disabled={!date} onClick={() => date && onContinue(date)} className="mt-4">{t('venue.availability.continue')}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
