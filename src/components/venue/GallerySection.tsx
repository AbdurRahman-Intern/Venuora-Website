// ---------------------------------------------------------------------------
// GALLERY: filterable masonry-inspired grid + full-screen lightbox.
// The grid uses fixed-height rows and a few "big tile" positions (see `spanFor`) to get the
// editorial look without a masonry library. Images below the fold use loading="lazy".
// ---------------------------------------------------------------------------
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeading from '../common/SectionHeading';
import Lightbox from './Lightbox';
import { useLocale } from '../../hooks/useLocale';
import type { GalleryCategory, GalleryImage, Venue } from '../../types';

const CATEGORIES: GalleryCategory[] = ['hall', 'stage', 'decor', 'dining', 'rooms', 'exterior', 'conference'];

/** Which tiles are larger. Index within the CURRENT (filtered) list. Edit to change the rhythm. */
function spanFor(i: number) {
  if (i % 7 === 0) return 'sm:col-span-2 sm:row-span-2';
  if (i % 7 === 4) return 'sm:col-span-2';
  return '';
}

export default function GallerySection({ venue, images }: { venue: Venue; images: GalleryImage[] }) {
  const { t } = useTranslation();
  const { tx } = useLocale();
  const [category, setCategory] = useState<GalleryCategory | 'all'>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const present = CATEGORIES.filter((c) => images.some((img) => img.category === c)); // only show filters that have photos
  const visible = category === 'all' ? images : images.filter((img) => img.category === category);
  const altFor = (img: GalleryImage) => t('venue.gallery.alt', { title: tx(img.title), venue: tx(venue.name) });

  return (
    <section id="gallery" className="section scroll-target bg-white">
      <div className="container-page">
        <SectionHeading eyebrow={t('venue.gallery.eyebrow')} title={t('venue.gallery.title')} subtitle={t('venue.gallery.subtitle')} />
        <div className="mt-8 flex flex-wrap justify-center gap-2" role="group" aria-label={t('venue.gallery.eyebrow')}>
          {(['all', ...present] as const).map((c) => (
            <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${category === c ? 'bg-emerald text-ivory' : 'bg-sage/60 text-emerald hover:bg-sage'}`}>
              {c === 'all' ? t('common.all') : t(`venue.gallery.categories.${c}`)}
            </button>
          ))}
        </div>
        <ul className="mt-10 grid auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:grid-cols-4">
          {visible.map((img, i) => (
            <li key={img.id} className={`overflow-hidden rounded-xl ${spanFor(i)}`}>
              <button type="button" onClick={() => setOpenIndex(i)} aria-label={t('venue.gallery.open', { title: tx(img.title) })} className="group relative block h-full w-full">
                <img src={img.src} alt={altFor(img)} loading="lazy" width={1200} height={800} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald/80 to-transparent p-3 text-start text-sm font-medium text-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{tx(img.title)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {openIndex !== null && (
        <Lightbox images={visible.map((img) => ({ src: img.src, title: tx(img.title), alt: altFor(img) }))}
          index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  );
}
