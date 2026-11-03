// PACKAGES: cards built from the active packages (defaults in data/packages.ts, edits from the dashboard).
// Empty state: if no package is published we show a friendly message instead of a blank section.
import { useTranslation } from 'react-i18next';
import { Users, Check } from 'lucide-react';
import Chips from '../common/Chips';
import Button from '../common/Button';
import Price from '../common/Price';
import SectionHeading from '../common/SectionHeading';
import { useLocale } from '../../hooks/useLocale';
import { formatNumber } from '../../utils/dates';
import type { EventPackage } from '../../types';

export default function PackagesSection({ packages, onInquire }: { packages: EventPackage[]; onInquire: (id: string) => void }) {
  const { t } = useTranslation();
  const { tx, intl } = useLocale();
  return (
    <section id="packages" className="section scroll-target bg-sage/40">
      <div className="container-page">
        <SectionHeading eyebrow={t('venue.packages.eyebrow')} title={t('venue.packages.title')} subtitle={t('venue.packages.sampleNote')} />
        {packages.length === 0 ? (
          <div className="mx-auto mt-12 max-w-md rounded-xl border border-dashed border-emerald/25 bg-white/70 p-10 text-center">
            <p className="font-serif text-xl text-emerald">{t('venue.packages.empty')}</p>
            <p className="mt-2 text-sm text-charcoal/60">{t('venue.packages.emptyHint')}</p>
          </div>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {packages.map((p) => (
              <article key={p.id} className="card flex flex-col p-6">
                <h3 className="text-xl">{tx(p.name)}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-charcoal/55"><Users size={14} aria-hidden="true" />{t('common.upTo', { count: formatNumber(p.capacity, intl) as unknown as number })}</p>
                <p className="mt-4 font-serif text-2xl font-semibold text-emerald"><Price amount={p.price} currency={p.currency} /></p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{tx(p.description)}</p>
                <h4 className="mt-5 !font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/50">{t('venue.packages.includes')}</h4>
                <div className="mt-2"><Chips items={p.includes.map((f) => t(`enums.facility.${f}`))} /></div>
                <h4 className="mt-4 !font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/50">{t('venue.packages.services')}</h4>
                <ul className="mt-2 space-y-1.5 text-sm text-charcoal/80">
                  {p.services.map((s) => <li key={s} className="flex items-center gap-2"><Check size={14} className="text-gold-dark" aria-hidden="true" />{t(`enums.service.${s}`)}</li>)}
                </ul>
                <Button variant="dark" onClick={() => onInquire(p.id)} className="mt-auto w-full !mt-7">{t('venue.packages.inquire')}</Button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
