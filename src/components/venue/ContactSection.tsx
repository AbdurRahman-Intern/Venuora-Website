// ---------------------------------------------------------------------------
// CONTACT + WHATSAPP. Everything comes from venue.contact (config/venue.ts or dashboard overrides).
// The WhatsApp link is built by buildWhatsAppUrl(): number as digits, message URL-encoded, and the
// message text is translated into the ACTIVE language. The button is hidden if no number is set.
// Phone/e-mail use the .ltr-text class so they stay readable inside right-to-left sentences.
// ---------------------------------------------------------------------------
import { useTranslation } from 'react-i18next';
import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Button from '../common/Button';
import SectionHeading from '../common/SectionHeading';
import { useLocale } from '../../hooks/useLocale';
import { buildWhatsAppUrl } from '../../utils/text';
import type { Venue } from '../../types';

export default function ContactSection({ venue }: { venue: Venue }) {
  const { t } = useTranslation();
  const { tx } = useLocale();
  const c = venue.contact;
  const wa = buildWhatsAppUrl(c.whatsapp, t('venue.contact.whatsappMessage', { venue: tx(venue.name), topic: t('venue.contact.whatsappTopic') }));
  const item = 'flex items-start gap-4';
  const icon = 'mt-1 shrink-0 text-gold-dark';
  return (
    <section id="contact" className="section scroll-target bg-white">
      <div className="container-page">
        <SectionHeading eyebrow={t('venue.contact.eyebrow')} title={t('venue.contact.title')} />
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
          <ul className="space-y-6">
            <li className={item}><MapPin size={20} className={icon} aria-hidden="true" /><div><p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">{t('venue.contact.address')}</p><p>{tx(venue.address)}</p></div></li>
            <li className={item}><Phone size={20} className={icon} aria-hidden="true" /><div><p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">{t('venue.contact.phone')}</p><a className="ltr-text hover:underline" href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a></div></li>
            <li className={item}><Mail size={20} className={icon} aria-hidden="true" /><div><p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">{t('venue.contact.email')}</p><a className="ltr-text hover:underline" href={`mailto:${c.email}`}>{c.email}</a></div></li>
            <li className={item}><Clock size={20} className={icon} aria-hidden="true" /><div><p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">{t('venue.contact.hours')}</p><p>{tx(c.hours)}</p></div></li>
          </ul>
          <div className="card flex flex-col justify-center gap-4 p-7">
            {wa && <Button href={wa} external variant="gold" className="w-full py-3.5"><MessageCircle size={18} aria-hidden="true" />{t('venue.contact.whatsapp')}</Button>}
            <Button href={c.mapUrl} external variant="outline" className="w-full"><ExternalLink size={16} aria-hidden="true" />{t('venue.contact.map')}</Button>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-sm text-charcoal/70">
              <span className="font-medium">{t('venue.contact.social')}:</span>
              {c.social.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">{s.label}</a>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
