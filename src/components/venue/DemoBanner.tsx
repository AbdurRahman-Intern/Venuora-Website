// Thin bar fixed at the very top of the venue demo. It labels the site as fictional/sample content
// and links back to the platform. Do NOT remove this on a demo shown to prospects: honesty is a feature.
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';

export default function DemoBanner() {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-9 items-center justify-center gap-3 bg-gold px-3 text-[11px] font-medium text-emerald sm:text-xs">
      <Info size={14} className="shrink-0" aria-hidden="true" />
      <p className="truncate">{t('venue.demoBanner')}</p>
      <Link to="/" className="hidden shrink-0 underline underline-offset-2 sm:inline">{t('navigation.backToPlatform')}</Link>
    </div>
  );
}
