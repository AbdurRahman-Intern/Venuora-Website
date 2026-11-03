// ---------------------------------------------------------------------------
// PRODUCT PREVIEW: a browser-style frame showing a miniature of the demo venue site.
// The whole frame is one link to /demo. Name/tagline come from the venue config in the active language.
// ---------------------------------------------------------------------------
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import { venue } from '../../config/venue';
import { useLocale } from '../../hooks/useLocale';

export default function ProductPreview() {
  const { t } = useTranslation();
  const { tx, isRtl } = useLocale();
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const navKeys = ['about', 'gallery', 'packages', 'availability'];
  return (
    <section id="product" className="section scroll-target bg-sage/40">
      <div className="container-page">
        <SectionHeading eyebrow={t('marketing.preview.eyebrow')} title={t('marketing.preview.title')} subtitle={t('marketing.preview.subtitle')} />
        <Link to="/demo" aria-label={t('marketing.preview.browserLabel')}
          className="group mx-auto mt-12 block max-w-5xl overflow-hidden rounded-2xl border border-emerald/15 bg-white shadow-2xl transition-transform hover:-translate-y-1">
          {/* Fake browser toolbar. dir="ltr" keeps the three dots and URL on the same side in every language. */}
          <div dir="ltr" className="flex items-center gap-3 border-b border-emerald/10 bg-ivory px-4 py-3">
            <span className="flex gap-1.5" aria-hidden="true"><i className="h-3 w-3 rounded-full bg-red-400" /><i className="h-3 w-3 rounded-full bg-amber-400" /><i className="h-3 w-3 rounded-full bg-green-500" /></span>
            <span className="flex-1 truncate rounded-md bg-white px-3 py-1 text-center text-xs text-charcoal/50">grand-emerald.example</span>
          </div>
          <div className="relative aspect-[16/10] bg-emerald sm:aspect-[16/9]">
            <img src={venue.heroImage} alt="" loading="lazy" width={1200} height={800} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald/90 via-emerald/40 to-emerald/30" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 text-ivory sm:px-8">
              <span className="font-serif text-base font-semibold sm:text-xl">{tx(venue.name)}</span>
              <span className="hidden gap-5 text-xs sm:flex">{navKeys.map((k) => <span key={k}>{t(`navigation.${k}`)}</span>)}</span>
              <span className="rounded-md bg-gold px-3 py-1.5 text-[11px] font-semibold text-emerald sm:text-xs">{t('navigation.makeInquiry')}</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 text-ivory sm:p-10">
              <p className="mb-2 text-[11px] uppercase tracking-widest text-gold">{t('marketing.preview.fictional')}</p>
              <p className="max-w-lg font-serif text-2xl font-semibold leading-tight sm:text-4xl">{tx(venue.tagline)}</p>
              <p className="mt-3 hidden max-w-xl text-sm text-ivory/80 sm:block">{tx(venue.description)}</p>
            </div>
          </div>
        </Link>
        <p className="mt-8 text-center">
          <Link to="/demo" className="inline-flex items-center gap-2 font-semibold text-emerald underline-offset-4 hover:underline">
            {t('marketing.preview.cta')} <Arrow size={16} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
