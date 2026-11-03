// ---------------------------------------------------------------------------
// PRICING. Plans, prices and feature lists come from config/site.ts (pricingPlans) - edit them there.
// price === null renders "Contact for pricing". Never hardcode amounts in this component.
// ---------------------------------------------------------------------------
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';
import { pricingPlans } from '../../config/site';
import { useLocale } from '../../hooks/useLocale';
import { formatCurrency } from '../../utils/dates';

export default function Pricing() {
  const { t } = useTranslation();
  const { intl } = useLocale();
  return (
    <section id="pricing" className="section scroll-target bg-ivory">
      <div className="container-page">
        <SectionHeading eyebrow={t('marketing.pricing.eyebrow')} title={t('marketing.pricing.title')} subtitle={t('marketing.pricing.subtitle')} />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article key={plan.id} className={`relative flex flex-col rounded-2xl p-7 ${plan.highlighted ? 'bg-emerald text-ivory shadow-2xl lg:-my-4 lg:py-11' : 'card'}`}>
              {plan.highlighted && (
                <span className="absolute -top-3 start-7 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-emerald">{t('marketing.pricing.popular')}</span>
              )}
              <h3 className={`text-2xl ${plan.highlighted ? '!text-ivory' : ''}`}>{t(`marketing.pricing.plans.${plan.id}.name`)}</h3>
              <p className={`mt-2 text-sm ${plan.highlighted ? 'text-ivory/70' : 'text-charcoal/65'}`}>{t(`marketing.pricing.plans.${plan.id}.desc`)}</p>
              <p className={`mt-6 font-serif text-3xl font-semibold ${plan.highlighted ? 'text-gold' : 'text-emerald'}`}>
                {plan.price === null ? <span className="text-xl">{t('common.contactForPricing')}</span> : formatCurrency(plan.price, plan.currency, intl)}
              </p>
              <ul className="mt-7 flex-1 space-y-3 text-sm">
                {plan.featureIds.map((fid) => (
                  <li key={fid} className="flex items-start gap-3">
                    <Check size={16} className={`mt-0.5 shrink-0 ${plan.highlighted ? 'text-gold' : 'text-emerald'}`} aria-hidden="true" />
                    <span className={plan.highlighted ? 'text-ivory/90' : 'text-charcoal/80'}>{t(`marketing.pricing.features.${fid}`)}</span>
                  </li>
                ))}
              </ul>
              <Button to="/#contact" variant={plan.highlighted ? 'gold' : 'outline'} className="mt-8 w-full">{t('marketing.pricing.cta')}</Button>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-charcoal/60">{t('marketing.pricing.note')}</p>
      </div>
    </section>
  );
}
