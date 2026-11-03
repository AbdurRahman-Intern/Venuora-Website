// ---------------------------------------------------------------------------
// FINAL CTA + CONTACT. All details come from config/site.ts. The WhatsApp message is translated
// into the active language and URL-encoded by buildWhatsAppUrl().
// ---------------------------------------------------------------------------
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import Button from '../common/Button';
import { siteConfig } from '../../config/site';
import { buildWhatsAppUrl } from '../../utils/text';

export default function ContactCta() {
  const { t } = useTranslation();
  const wa = buildWhatsAppUrl(siteConfig.contact.whatsapp, t('marketing.contact.whatsappMessage'));
  const row = 'flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-ivory transition-colors hover:bg-white/10';
  return (
    <section id="contact" className="section scroll-target bg-emerald">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow !text-gold">{t('marketing.contact.eyebrow')}</p>
          <h2 className="mt-3 text-3xl !text-ivory sm:text-4xl">{t('marketing.cta.title')}</h2>
          <p className="mt-4 max-w-lg text-ivory/75">{t('marketing.cta.subtitle')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {wa && <Button href={wa} external variant="gold"><MessageCircle size={16} aria-hidden="true" />{t('marketing.contact.whatsappButton')}</Button>}
            <Button to="/demo" variant="light">{t('marketing.cta.demo')}</Button>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-ivory/60">{t('marketing.contact.subtitle')}</p>
          <a className={row} href={`mailto:${siteConfig.contact.email}`}><Mail size={18} className="text-gold" aria-hidden="true" /><span><span className="block text-xs text-ivory/60">{t('marketing.contact.email')}</span><span className="ltr-text">{siteConfig.contact.email}</span></span></a>
          <a className={row} href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}><Phone size={18} className="text-gold" aria-hidden="true" /><span><span className="block text-xs text-ivory/60">{t('marketing.contact.phone')}</span><span className="ltr-text">{siteConfig.contact.phone}</span></span></a>
        </div>
      </div>
    </section>
  );
}
