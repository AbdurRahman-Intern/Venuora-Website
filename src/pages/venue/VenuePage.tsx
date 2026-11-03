// ---------------------------------------------------------------------------
// THE GRAND EMERALD: the demonstration venue website (route /demo).
//
// This page only ASSEMBLES sections. Content comes from:
//   useVenue()            config/venue.ts merged with dashboard edits
//   rooms / spaces        src/data/*.ts
//   usePackages()         src/data/packages.ts merged with dashboard edits (only `active` ones are shown)
//   useUnavailableDates() sample dates, editable in the dashboard
//
// `preset` connects the page's buttons to the inquiry form: "Inquire about this package" sets the
// preset and scrolls down to #inquiry, where InquiryForm pre-fills itself.
// ---------------------------------------------------------------------------
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DemoBanner from '../../components/venue/DemoBanner';
import VenueNavbar from '../../components/venue/VenueNavbar';
import VenueHero from '../../components/venue/VenueHero';
import AboutSection from '../../components/venue/AboutSection';
import GallerySection from '../../components/venue/GallerySection';
import SpacesSection from '../../components/venue/SpacesSection';
import RoomsSection from '../../components/venue/RoomsSection';
import PackagesSection from '../../components/venue/PackagesSection';
import AvailabilitySection from '../../components/venue/AvailabilitySection';
import ContactSection from '../../components/venue/ContactSection';
import VenueFooter from '../../components/venue/VenueFooter';
import SectionHeading from '../../components/common/SectionHeading';
import InquiryForm, { type InquiryPreset } from '../../components/forms/InquiryForm';
import { gallery } from '../../config/venue';
import { rooms } from '../../data/rooms';
import { spaces } from '../../data/spaces';
import { usePackages, useUnavailableDates, useVenue } from '../../services/demoStore';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useLocale } from '../../hooks/useLocale';

export default function VenuePage() {
  const { t } = useTranslation();
  const { tx } = useLocale();
  const navigate = useNavigate();
  const { venue } = useVenue();
  const { packages } = usePackages();
  const { unavailableDates } = useUnavailableDates();
  const [preset, setPreset] = useState<InquiryPreset | null>(null);

  usePageMeta(t('venue.metaTitle', { name: tx(venue.name) }), tx(venue.description), venue.heroImage);

  const activePackages = useMemo(() => packages.filter((p) => p.active), [packages]);
  const s = venue.sections;

  /** Pre-fill the form and scroll to it. */
  const startInquiry = useCallback((next: Omit<InquiryPreset, 'nonce'>) => {
    setPreset({ ...next, nonce: Date.now() });
    navigate('/demo#inquiry', { replace: false });
    document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
  }, [navigate]);

  return (
    <div>
      <DemoBanner />
      <VenueNavbar venue={venue} />
      <main>
        <VenueHero venue={venue} />
        <AboutSection venue={venue} />
        {s.gallery && <GallerySection venue={venue} images={gallery} />}
        {s.spaces && <SpacesSection spaces={spaces} onInquire={(id) => startInquiry({ kind: 'event', itemId: id })} />}
        {s.rooms && <RoomsSection rooms={rooms} onInquire={(id) => startInquiry({ kind: 'room', itemId: id })} />}
        {s.packages && <PackagesSection packages={activePackages} onInquire={(id) => startInquiry({ kind: 'event', itemId: id })} />}
        {s.availability && <AvailabilitySection unavailable={unavailableDates} onContinue={(date) => startInquiry({ kind: 'event', date })} />}
        <section id="inquiry" className="section scroll-target bg-sage/40">
          <div className="container-page">
            <SectionHeading eyebrow={t('venue.inquiry.eyebrow')} title={t('venue.inquiry.title')} subtitle={t('venue.inquiry.subtitle')} />
            <div className="mt-12">
              <InquiryForm venue={venue} rooms={s.rooms ? rooms : []} spaces={spaces} packages={activePackages} unavailable={unavailableDates} preset={preset} />
            </div>
          </div>
        </section>
        <ContactSection venue={venue} />
      </main>
      <VenueFooter venue={venue} />
    </div>
  );
}
