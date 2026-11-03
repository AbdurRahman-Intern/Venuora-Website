// ABOUT: editorial two-column layout - text on one side, two overlapping photos on the other.
// Facilities / event types / hospitality come from the venue config and are shown as translated chips.
import { useTranslation } from 'react-i18next';
import Chips from '../common/Chips';
import SectionHeading from '../common/SectionHeading';
import { useLocale } from '../../hooks/useLocale';
import type { Venue } from '../../types';

export default function AboutSection({ venue }: { venue: Venue }) {
  const { t } = useTranslation();
  const { tx } = useLocale();
  return (
    <section id="about" className="section scroll-target bg-ivory">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading align="start" eyebrow={t('venue.about.eyebrow')} title={t('venue.about.title')} />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal/75">
            {venue.about.map((p, i) => <p key={i}>{tx(p)}</p>)}
          </div>
          <h3 className="mt-8 !font-sans text-sm font-semibold uppercase tracking-wider text-gold-dark">{t('venue.about.facilities')}</h3>
          <div className="mt-3"><Chips items={venue.facilities.map((f) => t(`enums.facility.${f}`))} /></div>
          <h3 className="mt-6 !font-sans text-sm font-semibold uppercase tracking-wider text-gold-dark">{t('venue.about.eventTypes')}</h3>
          <div className="mt-3"><Chips tone="gold" items={venue.eventTypes.map((e) => t(`enums.eventType.${e}`))} /></div>
          <div className="mt-8 border-s-2 border-gold ps-5">
            <h3 className="!font-sans text-sm font-semibold uppercase tracking-wider text-emerald">{t('venue.about.hospitality')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{tx(venue.hospitality)}</p>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg pb-12 pe-10">
          <img src={venue.aboutImages[0]} alt={`${t('navigation.about')} - ${tx(venue.name)}`} loading="lazy" width={1200} height={800} className="aspect-[4/5] w-full rounded-2xl object-cover shadow-soft" />
          <img src={venue.aboutImages[1]} alt="" loading="lazy" width={1200} height={800} className="absolute bottom-0 end-0 aspect-square w-1/2 rounded-2xl border-4 border-ivory object-cover shadow-xl" />
        </div>
      </div>
    </section>
  );
}
