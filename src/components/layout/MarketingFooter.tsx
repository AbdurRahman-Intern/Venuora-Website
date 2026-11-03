// ---------------------------------------------------------------------------
// MARKETING FOOTER. Contact details come from config/site.ts (never typed here).
// The privacy/terms links are placeholders until real pages exist (see siteConfig.legal).
// ---------------------------------------------------------------------------
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../common/Logo';
import LanguageSelector from '../common/LanguageSelector';
import { siteConfig } from '../../config/site';

export default function MarketingFooter() {
  const { t } = useTranslation();
  const col = 'text-sm text-ivory/70 hover:text-gold';
  return (
    <footer className="bg-emerald text-ivory">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">{t('footer.description')}</p>
          <div className="mt-5"><LanguageSelector tone="dark" /></div>
        </div>
        <div>
          <h2 className="!font-sans mb-3 text-sm font-semibold !text-gold">{t('footer.product')}</h2>
          <ul className="space-y-2">
            {[['features', 'features'], ['how-it-works', 'howItWorks'], ['pricing', 'pricing']].map(([id, key]) => (
              <li key={id}><Link className={col} to={`/#${id}`}>{t(`navigation.${key}`)}</Link></li>
            ))}
            <li><Link className={col} to="/demo">{t('navigation.exploreDemo')}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="!font-sans mb-3 text-sm font-semibold !text-gold">{t('footer.company')}</h2>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><a className="ltr-text hover:text-gold" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></li>
            <li><span className="ltr-text">{siteConfig.contact.phone}</span></li>
            <li className="text-xs text-ivory/50">{t('footer.placeholderNote')}</li>
          </ul>
        </div>
        <div>
          <h2 className="!font-sans mb-3 text-sm font-semibold !text-gold">{t('footer.legal')}</h2>
          <ul className="space-y-2">
            <li><a className={col} href={siteConfig.legal.privacyUrl}>{t('footer.privacy')}</a></li>
            <li><a className={col} href={siteConfig.legal.termsUrl}>{t('footer.terms')}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('footer.copyright', { year: new Date().getFullYear(), name: siteConfig.platformName })}</p>
          <p>{t('footer.demoNotice')}</p>
        </div>
      </div>
    </footer>
  );
}
