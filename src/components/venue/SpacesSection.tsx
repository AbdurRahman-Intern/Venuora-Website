// EVENT SPACES: one card per hall/terrace/conference room. Hidden entirely if venue.sections.spaces is false.
// "Inquire" calls onInquire(spaceId) which pre-fills the inquiry form further down the page.
import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';
import Chips from '../common/Chips';
import Button from '../common/Button';
import SectionHeading from '../common/SectionHeading';
import { useLocale } from '../../hooks/useLocale';
import { formatNumber } from '../../utils/dates';
import type { EventSpace } from '../../types';

export default function SpacesSection({ spaces, onInquire }: { spaces: EventSpace[]; onInquire: (id: string) => void }) {
  const { t } = useTranslation();
  const { tx, intl } = useLocale();
  if (!spaces.length) return null;
  return (
    <section id="spaces" className="section scroll-target bg-ivory">
      <div className="container-page">
        <SectionHeading eyebrow={t('venue.spaces.eyebrow')} title={t('venue.spaces.title')} />
        <div className="mt-14 space-y-16">
          {spaces.map((s, i) => (
            <article key={s.id} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <img src={s.image} alt={tx(s.name)} loading="lazy" width={1200} height={800}
                className={`aspect-[3/2] w-full rounded-2xl object-cover shadow-soft ${i % 2 ? 'lg:order-2' : ''}`} />
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-gold-dark"><Users size={16} aria-hidden="true" />{t('venue.spaces.capacity')}: {formatNumber(s.capacity, intl)}</p>
                <h3 className="mt-2 text-3xl">{tx(s.name)}</h3>
                <p className="mt-3 leading-relaxed text-charcoal/70">{tx(s.description)}</p>
                <h4 className="mt-5 !font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/50">{t('venue.packages.includes')}</h4>
                <div className="mt-2"><Chips items={s.facilities.map((f) => t(`enums.facility.${f}`))} /></div>
                <h4 className="mt-4 !font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/50">{t('venue.spaces.eventTypes')}</h4>
                <div className="mt-2"><Chips tone="gold" items={s.eventTypes.map((e) => t(`enums.eventType.${e}`))} /></div>
                <Button variant="dark" onClick={() => onInquire(s.id)} className="mt-7">{t('venue.spaces.inquire')}</Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
