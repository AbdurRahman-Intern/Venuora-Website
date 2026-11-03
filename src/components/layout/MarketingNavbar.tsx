// ---------------------------------------------------------------------------
// MARKETING NAVBAR
// Sticky bar. Anchor links use <Link to="/#id"> so they also work when you are on another page;
// ScrollManager performs the smooth scroll. On small screens the links move into a drop-down panel.
// Layout uses flex + logical properties only, so it mirrors automatically in RTL.
// To add a link: add an entry to `links` and a matching key in navigation.* of every locale file.
// ---------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../common/Button';
import LanguageSelector from '../common/LanguageSelector';

const links = [
  { id: 'product', key: 'product' },
  { id: 'features', key: 'features' },
  { id: 'how-it-works', key: 'howItWorks' },
  { id: 'pricing', key: 'pricing' },
  { id: 'contact', key: 'contact' },
];

export default function MarketingNavbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add a background once the page is scrolled, so the bar stays readable over the hero image.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile panel with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const solid = scrolled || open;
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors ${solid ? 'bg-ivory/95 shadow-sm backdrop-blur' : 'bg-transparent'}`}>
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Logo tone={solid ? 'dark' : 'light'} />

        <nav aria-label={t('navigation.mainNavigation')} className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link key={l.id} to={`/#${l.id}`}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${solid ? 'text-emerald hover:bg-emerald/5' : 'text-ivory/90 hover:bg-white/10'}`}>
              {t(`navigation.${l.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector tone={solid ? 'light' : 'dark'} />
          <Button to="/demo" variant={solid ? 'outline' : 'light'} className="hidden md:inline-flex">{t('navigation.exploreDemo')}</Button>
          <Button to="/#contact" variant="gold" className="hidden md:inline-flex">{t('navigation.getStarted')}</Button>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu"
            aria-label={open ? t('navigation.closeMenu') : t('navigation.openMenu')}
            className={`rounded-lg p-2 lg:hidden ${solid ? 'text-emerald' : 'text-ivory'}`}>
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-emerald/10 bg-ivory px-5 pb-6 pt-3 lg:hidden">
          <nav aria-label={t('navigation.mainNavigation')} className="flex flex-col">
            {links.map((l) => (
              <Link key={l.id} to={`/#${l.id}`} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-emerald hover:bg-emerald/5">
                {t(`navigation.${l.key}`)}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button to="/demo" variant="outline" className="flex-1">{t('navigation.exploreDemo')}</Button>
            <Button to="/#contact" variant="gold" className="flex-1">{t('navigation.getStarted')}</Button>
          </div>
        </div>
      )}
    </header>
  );
}
