// ---------------------------------------------------------------------------
// VENUE NAVBAR (The Grand Emerald). Links to sections are hidden automatically when the venue turns
// a section off in config/venue.ts -> sections. "Back to platform" returns to the marketing site.
// ---------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ArrowLeft, ArrowRight } from 'lucide-react';
import LanguageSelector from '../common/LanguageSelector';
import Button from '../common/Button';
import { useLocale } from '../../hooks/useLocale';
import type { Venue } from '../../types';

export default function VenueNavbar({ venue }: { venue: Venue }) {
  const { t } = useTranslation();
  const { tx, isRtl } = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const Back = isRtl ? ArrowRight : ArrowLeft; // "back" arrow points away from the reading direction

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const s = venue.sections;
  const links = [
    { id: 'about', key: 'about', show: true },
    { id: 'gallery', key: 'gallery', show: s.gallery },
    { id: 'spaces', key: 'spaces', show: s.spaces },
    { id: 'rooms', key: 'rooms', show: s.rooms },
    { id: 'packages', key: 'packages', show: s.packages },
    { id: 'availability', key: 'availability', show: s.availability },
    { id: 'contact', key: 'contact', show: true },
  ].filter((l) => l.show);

  const solid = scrolled || open;
  return (
    <header className={`fixed inset-x-0 top-9 z-40 transition-colors ${solid ? 'bg-emerald/95 shadow-lg backdrop-blur' : 'bg-gradient-to-b from-emerald/70 to-transparent'}`}>
      <div className="container-page flex h-[68px] items-center justify-between gap-4 text-ivory">
        <Link to="/demo#top" className="font-serif text-xl font-semibold tracking-wide">{tx(venue.name)}</Link>
        <nav aria-label={t('navigation.mainNavigation')} className="hidden items-center gap-0.5 xl:flex">
          {links.map((l) => (
            <Link key={l.id} to={`/demo#${l.id}`} className="rounded-lg px-3 py-2 text-sm font-medium text-ivory/90 hover:bg-white/10">{t(`navigation.${l.key}`)}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSelector tone="dark" />
          <Button to="/demo#inquiry" variant="gold" className="hidden md:inline-flex">{t('navigation.makeInquiry')}</Button>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="venue-mobile-menu"
            aria-label={open ? t('navigation.closeMenu') : t('navigation.openMenu')} className="rounded-lg p-2 xl:hidden">
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <div id="venue-mobile-menu" className="border-t border-white/10 bg-emerald px-5 pb-6 pt-3 text-ivory xl:hidden">
          <nav aria-label={t('navigation.mainNavigation')} className="flex flex-col">
            {links.map((l) => (
              <Link key={l.id} to={`/demo#${l.id}`} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 hover:bg-white/10">{t(`navigation.${l.key}`)}</Link>
            ))}
            <Link to="/demo#inquiry" onClick={() => setOpen(false)} className="mt-2 rounded-lg bg-gold px-3 py-3 text-center font-semibold text-emerald">{t('navigation.makeInquiry')}</Link>
            <Link to="/" className="mt-3 inline-flex items-center gap-2 px-3 py-2 text-sm text-ivory/70"><Back size={14} aria-hidden="true" />{t('navigation.backToPlatform')}</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
