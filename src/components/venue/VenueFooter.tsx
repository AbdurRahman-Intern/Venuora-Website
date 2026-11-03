// VENUE FOOTER: venue name, back link to the platform and the dashboard demo. Notice that the venue is fictional.
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocale } from '../../hooks/useLocale';
import type { Venue } from '../../types';

export default function VenueFooter({ venue }: { venue: Venue }) {
  const { t } = useTranslation();
  const { tx } = useLocale();
  return (
    <footer className="bg-emerald py-10 text-ivory">
      <div className="container-page flex flex-col items-center gap-4 text-center text-sm">
        <p className="font-serif text-2xl">{tx(venue.name)}</p>
        <p className="max-w-xl text-xs text-ivory/60">{t('footer.demoNotice')}</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link to="/" className="text-gold hover:underline">{t('navigation.backToPlatform')}</Link>
          <Link to="/dashboard" className="text-gold hover:underline">{t('navigation.dashboardDemo')}</Link>
        </div>
      </div>
    </footer>
  );
}
