// ---------------------------------------------------------------------------
// DASHBOARD LAYOUT (route /dashboard/*) - a LOCAL DEMO. There is deliberately NO login screen:
// a fake login would imply real authentication exists. The banner says so.
//
// Layout: a sidebar on large screens, a horizontal scrolling tab bar on small screens.
// The sidebar uses `border-e` / logical spacing, so it sits on the right in RTL automatically.
// TODO: wrap this layout in real authentication (Laravel Sanctum) and load only the signed-in
//       business's data (tenant isolation enforced on the server, never in the browser).
// ---------------------------------------------------------------------------
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CalendarDays, ExternalLink, Inbox, LayoutDashboard, Package, Settings, ShieldAlert, type LucideIcon } from 'lucide-react';
import Logo from '../../components/common/Logo';
import LanguageSelector from '../../components/common/LanguageSelector';
import { useVenue } from '../../services/demoStore';
import { useLocale } from '../../hooks/useLocale';
import { usePageMeta } from '../../hooks/usePageMeta';

const items: { to: string; key: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '/dashboard', key: 'overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/inquiries', key: 'inquiries', icon: Inbox },
  { to: '/dashboard/packages', key: 'packages', icon: Package },
  { to: '/dashboard/availability', key: 'availability', icon: CalendarDays },
  { to: '/dashboard/settings', key: 'settings', icon: Settings },
];

export default function DashboardLayout() {
  const { t } = useTranslation();
  const { tx } = useLocale();
  const { venue } = useVenue();
  usePageMeta(`${t('dashboard.metaTitle')} | ${tx(venue.name)}`, t('dashboard.subtitle', { venue: tx(venue.name) }));

  const link = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-emerald text-ivory' : 'text-emerald hover:bg-emerald/5'}`;

  return (
    <div className="min-h-screen bg-ivory">
      <div role="note" className="flex items-start justify-center gap-2 bg-gold px-4 py-2 text-center text-xs font-medium text-emerald">
        <ShieldAlert size={14} className="mt-0.5 shrink-0" aria-hidden="true" /><p>{t('dashboard.demoBanner')}</p>
      </div>
      <div className="lg:flex">
        <aside className="border-b border-emerald/10 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-e">
          <div className="flex items-center justify-between gap-3 px-4 py-4 lg:flex-col lg:items-start lg:px-5">
            <Logo to="/" />
            <div className="lg:hidden"><LanguageSelector /></div>
          </div>
          <p className="hidden px-5 pb-4 text-xs text-charcoal/55 lg:block">{tx(venue.name)}</p>
          <nav aria-label={t('dashboard.title')} className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
            {items.map(({ to, key, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={link}><Icon size={17} aria-hidden="true" />{t(`dashboard.nav.${key}`)}</NavLink>
            ))}
          </nav>
          <div className="hidden space-y-3 border-t border-emerald/10 p-4 lg:block">
            <Link to="/demo" className="flex items-center gap-2 text-sm text-emerald hover:underline"><ExternalLink size={15} aria-hidden="true" />{t('dashboard.nav.viewSite')}</Link>
            <LanguageSelector />
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
