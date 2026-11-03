// HOTEL ROOMS: cards with photo, beds, occupancy, facilities and a nightly price (null = contact).
// Hidden entirely if venue.sections.rooms is false (e.g. a wedding hall with no accommodation).
import { useTranslation } from 'react-i18next';
import { BedDouble, Users } from 'lucide-react';
import Chips from '../common/Chips';
import Button from '../common/Button';
import Price from '../common/Price';
import SectionHeading from '../common/SectionHeading';
import { useLocale } from '../../hooks/useLocale';
import { formatNumber } from '../../utils/dates';
import type { Room } from '../../types';

export default function RoomsSection({ rooms, onInquire }: { rooms: Room[]; onInquire: (id: string) => void }) {
  const { t } = useTranslation();
  const { tx, intl } = useLocale();
  if (!rooms.length) return null;
  return (
    <section id="rooms" className="section scroll-target bg-white">
      <div className="container-page">
        <SectionHeading eyebrow={t('venue.rooms.eyebrow')} title={t('venue.rooms.title')} subtitle={t('venue.rooms.sampleNote')} />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((r) => (
            <article key={r.id} className="card flex flex-col overflow-hidden">
              <img src={r.image} alt={tx(r.name)} loading="lazy" width={1200} height={800} className="aspect-[3/2] w-full object-cover" />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl">{tx(r.name)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{tx(r.description)}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-charcoal/75">
                  <li className="flex items-center gap-2"><Users size={15} className="text-gold-dark" aria-hidden="true" />{t('venue.rooms.occupancy', { count: formatNumber(r.maxGuests, intl) as unknown as number })}</li>
                  <li className="flex items-center gap-2"><BedDouble size={15} className="text-gold-dark" aria-hidden="true" />
                    {r.beds.map((b) => `${formatNumber(b.count, intl)} × ${t(`enums.bed.${b.type}`)}`).join(' / ')}</li>
                </ul>
                <div className="mt-4"><Chips items={r.facilities.map((f) => t(`enums.facility.${f}`))} /></div>
                <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                  <p>
                    <span className="block text-xs text-charcoal/50">{t('venue.rooms.from')}</span>
                    <span className="font-serif text-xl font-semibold text-emerald"><Price amount={r.pricePerNight} currency={r.currency} /></span>
                    {r.pricePerNight !== null && <span className="ms-1 text-xs text-charcoal/55">{t('common.perNight')}</span>}
                  </p>
                  <Button variant="dark" onClick={() => onInquire(r.id)}>{t('venue.rooms.checkAvailability')}</Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
