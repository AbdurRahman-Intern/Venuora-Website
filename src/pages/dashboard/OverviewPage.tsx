// ---------------------------------------------------------------------------
// DASHBOARD OVERVIEW: counters + recent activity + upcoming requested dates, all computed from the
// inquiries in the demo store. "Confirmed bookings" is honestly 0: there are no reservation records.
// ---------------------------------------------------------------------------
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarCheck, Clock, Inbox, MailPlus, ShieldQuestion } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useInquiries, useVenue } from '../../services/demoStore';
import { useLocale } from '../../hooks/useLocale';
import { formatDate, formatNumber, todayISO } from '../../utils/dates';

export default function OverviewPage() {
  const { t } = useTranslation();
  const { intl, tx } = useLocale();
  const { venue } = useVenue();
  const { inquiries } = useInquiries();
  const today = todayISO();

  const stats = useMemo(() => {
    const requestedDate = (i: (typeof inquiries)[number]) => (i.kind === 'room' ? i.checkIn : i.eventDate);
    const upcoming = inquiries
      .filter((i) => i.status !== 'closed' && (requestedDate(i) ?? '') >= today)
      .sort((a, b) => (requestedDate(a) ?? '').localeCompare(requestedDate(b) ?? ''));
    return {
      total: inquiries.length,
      fresh: inquiries.filter((i) => i.status === 'new').length,
      pending: inquiries.filter((i) => i.status === 'pending').length,
      upcoming,
      recent: [...inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
      requestedDate,
    };
  }, [inquiries, today]);

  const cards = [
    { label: t('dashboard.overview.total'), value: formatNumber(stats.total, intl), icon: Inbox },
    { label: t('dashboard.overview.new'), value: formatNumber(stats.fresh, intl), icon: MailPlus },
    { label: t('dashboard.overview.pending'), value: formatNumber(stats.pending, intl), icon: Clock },
    { label: t('dashboard.overview.upcoming'), value: formatNumber(stats.upcoming.length, intl), icon: CalendarCheck },
    { label: t('dashboard.overview.confirmed'), value: formatNumber(0, intl), icon: ShieldQuestion, note: t('dashboard.overview.confirmedNote') },
  ];

  return (
    <>
      <PageHeader title={t('dashboard.overview.title')} subtitle={t('dashboard.subtitle', { venue: tx(venue.name) })}
        action={<span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold-dark">{t('dashboard.overview.sampleLabel')}</span>} />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, note }) => (
          <li key={label} className="card p-5">
            <Icon size={18} className="text-gold-dark" aria-hidden="true" />
            <p className="mt-3 font-serif text-3xl font-semibold text-emerald">{value}</p>
            <p className="mt-1 text-sm text-charcoal/70">{label}</p>
            {note && <p className="mt-2 text-xs text-charcoal/50">{note}</p>}
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="card p-6" aria-labelledby="recent-h">
          <h2 id="recent-h" className="text-xl">{t('dashboard.overview.recent')}</h2>
          {stats.recent.length === 0 ? <p className="mt-4 text-sm text-charcoal/55">{t('dashboard.overview.noRecent')}</p> : (
            <ul className="mt-4 divide-y divide-emerald/10">
              {stats.recent.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span><span className="font-medium">{t('dashboard.overview.receivedInquiry', { name: i.customerName })}</span><span className="block text-xs text-charcoal/50">{formatDate(i.createdAt.slice(0, 10), intl, 'short')}</span></span>
                  <StatusBadge status={i.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card p-6" aria-labelledby="upcoming-h">
          <h2 id="upcoming-h" className="text-xl">{t('dashboard.overview.upcomingList')}</h2>
          {stats.upcoming.length === 0 ? <p className="mt-4 text-sm text-charcoal/55">{t('dashboard.overview.noUpcoming')}</p> : (
            <ul className="mt-4 divide-y divide-emerald/10">
              {stats.upcoming.slice(0, 5).map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span><span className="font-medium">{i.customerName}</span><span className="block text-xs text-charcoal/50">{t(`enums.inquiryKind.${i.kind}`)}</span></span>
                  <span className="text-charcoal/75">{formatDate(stats.requestedDate(i) ?? '', intl, 'short')}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/dashboard/inquiries" className="mt-4 inline-block text-sm font-semibold text-emerald underline-offset-4 hover:underline">{t('common.viewAll')}</Link>
        </section>
      </div>
    </>
  );
}
