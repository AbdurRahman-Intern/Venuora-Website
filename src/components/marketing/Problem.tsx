// PROBLEM / SOLUTION: six pairs. Left of each row = the problem, right = what the platform changes.
// Content keys: marketing.problem.items.<id>.{problem,solution}
import { useTranslation } from 'react-i18next';
import { X, Check } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

const ids = ['noWebsite', 'photos', 'packages', 'repeated', 'inquiries', 'availability'];

export default function Problem() {
  const { t } = useTranslation();
  return (
    <section className="section bg-white">
      <div className="container-page">
        <SectionHeading eyebrow={t('marketing.problem.eyebrow')} title={t('marketing.problem.title')} subtitle={t('marketing.problem.subtitle')} />
        <div className="mx-auto mt-14 max-w-4xl">
          <div className="mb-3 hidden grid-cols-2 gap-6 px-2 text-xs font-semibold uppercase tracking-wider text-charcoal/50 sm:grid">
            <span>{t('marketing.problem.before')}</span><span className="text-gold-dark">{t('marketing.problem.after')}</span>
          </div>
          <ul className="space-y-4">
            {ids.map((id) => (
              <li key={id} className="grid gap-px overflow-hidden rounded-xl border border-emerald/10 bg-emerald/10 sm:grid-cols-2">
                <div className="flex items-start gap-3 bg-ivory p-5">
                  <X size={18} className="mt-0.5 shrink-0 text-red-700" aria-hidden="true" />
                  <p className="text-sm font-medium text-charcoal/80">{t(`marketing.problem.items.${id}.problem`)}</p>
                </div>
                <div className="flex items-start gap-3 bg-sage/40 p-5">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald" aria-hidden="true" />
                  <p className="text-sm text-emerald">{t(`marketing.problem.items.${id}.solution`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
