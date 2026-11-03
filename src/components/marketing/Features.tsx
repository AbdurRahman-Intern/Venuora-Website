// ---------------------------------------------------------------------------
// FEATURES GRID. The list and each feature's honesty label come from config/site.ts (`features`).
// Icons are looked up by name from `iconMap`; to use a new icon, import it and add it to the map.
// ---------------------------------------------------------------------------
import { useTranslation } from 'react-i18next';
import { LayoutTemplate, Images, BedDouble, Package, ClipboardList, CalendarDays, MessageCircle, Inbox, Languages, Smartphone, type LucideIcon } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { features, type FeatureStatus } from '../../config/site';

const iconMap: Record<string, LucideIcon> = { LayoutTemplate, Images, BedDouble, Package, ClipboardList, CalendarDays, MessageCircle, Inbox, Languages, Smartphone };

const statusStyle: Record<FeatureStatus, string> = {
  available: 'bg-emerald/10 text-emerald',
  demo: 'bg-gold/20 text-gold-dark',
  planned: 'bg-charcoal/10 text-charcoal/70',
};

export default function Features() {
  const { t } = useTranslation();
  return (
    <section id="features" className="section scroll-target bg-ivory">
      <div className="container-page">
        <SectionHeading eyebrow={t('marketing.features.eyebrow')} title={t('marketing.features.title')} subtitle={t('marketing.features.subtitle')} />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = iconMap[f.icon] ?? Package;
            return (
              <li key={f.id} className="card p-6 transition-shadow hover:shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald text-gold"><Icon size={20} aria-hidden="true" /></span>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle[f.status]}`}>{t(`marketing.features.status.${f.status}`)}</span>
                </div>
                <h3 className="mt-5 text-lg">{t(`marketing.features.items.${f.id}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{t(`marketing.features.items.${f.id}.desc`)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
