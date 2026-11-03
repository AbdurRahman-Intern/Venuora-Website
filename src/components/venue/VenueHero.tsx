// VENUE HERO: big photo, venue name, tagline, address, capacity and the two main buttons.
import { MapPin, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import { useLocale } from '../../hooks/useLocale';
import { formatNumber } from '../../utils/dates';
import type { Venue } from '../../types';

export default function VenueHero({ venue }: { venue: Venue }) {
  const { t } = useTranslation();
  const { tx, intl } = useLocale();
  return (
    <section id="top" className="relative isolate flex min-h-[100vh] items-end overflow-hidden bg-emerald">
      <img src={venue.heroImage} alt={tx(venue.name)} width={1200} height={800} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-emerald via-emerald/55 to-emerald/20" />
      <div className="container-page pb-16 pt-44 sm:pb-24">
        <p className="fade-up inline-flex items-center rounded-full border border-gold/50 px-3 py-1 text-xs tracking-wide text-gold">{t('venue.hero.fictional')}</p>
        <h1 className="fade-up mt-5 max-w-3xl text-4xl !text-ivory sm:text-6xl" style={{ animationDelay: '.08s' }}>{tx(venue.tagline)}</h1>
        <p className="fade-up mt-3 font-serif text-xl text-gold" style={{ animationDelay: '.14s' }}>{tx(venue.name)}</p>
        <p className="fade-up mt-5 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg" style={{ animationDelay: '.2s' }}>{tx(venue.description)}</p>
        <ul className="fade-up mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ivory/85" style={{ animationDelay: '.26s' }}>
          <li className="flex items-center gap-2"><MapPin size={16} className="text-gold" aria-hidden="true" />{tx(venue.address)}</li>
          <li className="flex items-center gap-2"><Users size={16} className="text-gold" aria-hidden="true" />{t('venue.hero.capacity', { count: formatNumber(venue.capacity, intl) as unknown as number })}</li>
        </ul>
        <div className="fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '.32s' }}>
          <Button to="/demo#about" variant="gold" className="px-7 py-3.5 text-base">{t('venue.hero.explore')}</Button>
          <Button to="/demo#inquiry" variant="light" className="px-7 py-3.5 text-base">{t('venue.hero.inquire')}</Button>
        </div>
      </div>
    </section>
  );
}
