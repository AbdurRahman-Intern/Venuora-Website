// HOW IT WORKS: three numbered steps joined by a line on large screens. Numbers use the locale's digits.
import { useTranslation } from 'react-i18next';
import SectionHeading from '../common/SectionHeading';
import { useLocale } from '../../hooks/useLocale';
import { formatNumber } from '../../utils/dates';

const steps = ['one', 'two', 'three'];

export default function HowItWorks() {
  const { t } = useTranslation();
  const { intl } = useLocale();
  return (
    <section id="how-it-works" className="section scroll-target bg-white">
      <div className="container-page">
        <SectionHeading eyebrow={t('marketing.how.eyebrow')} title={t('marketing.how.title')} />
        <ol className="relative mt-14 grid gap-10 md:grid-cols-3">
          <span aria-hidden="true" className="absolute inset-x-[16%] top-7 hidden h-px bg-gradient-to-r from-transparent via-gold to-transparent md:block" />
          {steps.map((s, i) => (
            <li key={s} className="relative text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald font-serif text-xl font-semibold text-gold ring-4 ring-white">{formatNumber(i + 1, intl)}</span>
              <h3 className="mt-5 text-xl">{t(`marketing.how.steps.${s}.title`)}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-charcoal/70">{t(`marketing.how.steps.${s}.desc`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
