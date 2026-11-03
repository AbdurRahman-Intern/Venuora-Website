// MARKETING HOME PAGE: just stacks the sections in order. Reorder or remove sections here.
import { useTranslation } from 'react-i18next';
import Hero from '../../components/marketing/Hero';
import Problem from '../../components/marketing/Problem';
import Features from '../../components/marketing/Features';
import ProductPreview from '../../components/marketing/ProductPreview';
import HowItWorks from '../../components/marketing/HowItWorks';
import Pricing from '../../components/marketing/Pricing';
import Faq from '../../components/marketing/Faq';
import ContactCta from '../../components/marketing/ContactCta';
import { usePageMeta } from '../../hooks/usePageMeta';
import { siteConfig } from '../../config/site';

export default function HomePage() {
  const { t } = useTranslation();
  usePageMeta(`${siteConfig.platformName} | ${t('marketing.meta.title')}`, t('marketing.meta.description'));
  return (
    <>
      <Hero />
      <Problem />
      <Features />
      <ProductPreview />
      <HowItWorks />
      <Pricing />
      <Faq />
      <ContactCta />
    </>
  );
}
