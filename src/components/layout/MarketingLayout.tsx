// Wraps every marketing page with the navbar and footer. <Outlet/> is where the page renders.
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MarketingNavbar from './MarketingNavbar';
import MarketingFooter from './MarketingFooter';

export default function MarketingLayout() {
  const { t } = useTranslation();
  return (
    <>
      {/* Keyboard users can jump past the navigation. Visible only when focused. */}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-emerald">
        {t('common.skipToContent')}
      </a>
      <MarketingNavbar />
      <main id="main"><Outlet /></main>
      <MarketingFooter />
    </>
  );
}
