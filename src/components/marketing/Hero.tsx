// ---------------------------------------------------------------------------
// HERO: full-bleed image with a dark gradient and the main message.
// The gradient direction flips in RTL (`rtl:bg-gradient-to-l`) so the text side always stays dark.
// The image is eager-loaded (it is the first thing seen); everything below the fold is lazy.
// To change the picture, replace public/images/hero.svg or point `src` to another file.
// ---------------------------------------------------------------------------
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../common/Button';
import { useLocale } from '../../hooks/useLocale';

export default function Hero() {
  const { t } = useTranslation();
  const { isRtl } = useLocale();
  const Arrow = isRtl ? ArrowLeft : ArrowRight; // directional icons mirror in RTL
  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-emerald">
      <img src="/images/hero.svg" alt="" width={1200} height={800} fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald via-emerald/85 to-emerald/20 rtl:bg-gradient-to-l" />
      <div className="container-page pb-20 pt-32">
        <div className="max-w-2xl">
          <p className="eyebrow fade-up !text-gold">{t('marketing.hero.eyebrow')}</p>
          <h1 className="fade-up mt-5 text-4xl !text-ivory sm:text-5xl lg:text-6xl" style={{ animationDelay: '.08s' }}>
            {t('marketing.hero.title')}
          </h1>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-ivory/80" style={{ animationDelay: '.16s' }}>
            {t('marketing.hero.subtitle')}
          </p>
          <div className="fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '.24s' }}>
            <Button to="/#contact" variant="gold" className="px-7 py-3.5 text-base">
              {t('marketing.hero.ctaPrimary')} <Arrow size={18} aria-hidden="true" />
            </Button>
            <Button to="/demo" variant="light" className="px-7 py-3.5 text-base">{t('marketing.hero.ctaSecondary')}</Button>
          </div>
        </div>
      </div>
      <p className="absolute bottom-4 end-5 text-xs text-ivory/60">{t('marketing.hero.caption')}</p>
    </section>
  );
}
