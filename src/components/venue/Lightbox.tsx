// ---------------------------------------------------------------------------
// LIGHTBOX: full-screen image viewer built on the native <dialog> element.
//   - showModal() gives us a focus trap, a backdrop and Escape-to-close for free.
//   - Keyboard: Escape closes, arrow keys navigate. In RTL the visual "next" side is on the LEFT, so
//     ArrowLeft goes forward there. (`forwardKey` below.) Remove that and arrows feel reversed in Arabic.
//   - The previous/next buttons use logical positions (start-3 / end-3) so they mirror in RTL, and
//     their chevrons are swapped for the same reason.
// Focus goes back to the thumbnail you clicked, because <dialog> restores focus when it closes.
// ---------------------------------------------------------------------------
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLocale } from '../../hooks/useLocale';

interface Item { src: string; title: string; alt: string }
interface Props { images: Item[]; index: number; onIndexChange: (i: number) => void; onClose: () => void }

export default function Lightbox({ images, index, onIndexChange, onClose }: Props) {
  const { t } = useTranslation();
  const { isRtl } = useLocale();
  const ref = useRef<HTMLDialogElement>(null);
  const count = images.length;
  const go = (delta: number) => onIndexChange((index + delta + count) % count); // wraps around

  useEffect(() => { ref.current?.showModal(); }, []);

  const forwardKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
  const backKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === forwardKey) { e.preventDefault(); go(1); }
    else if (e.key === backKey) { e.preventDefault(); go(-1); }
  };

  const current = images[index];
  if (!current) return null;
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const btn = 'absolute z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/25';

  return (
    <dialog ref={ref} onClose={onClose} onKeyDown={onKeyDown} aria-label={t('venue.gallery.viewer')}
      className="m-0 h-full max-h-none w-full max-w-none bg-emerald/95 p-0 backdrop:bg-black/80">
      <button type="button" onClick={onClose} aria-label={t('common.close')} className={`${btn} end-3 top-3`}><X size={20} aria-hidden="true" /></button>
      {count > 1 && <button type="button" onClick={() => go(-1)} aria-label={t('venue.gallery.previous')} className={`${btn} start-3 top-1/2 -translate-y-1/2`}><PrevIcon size={22} aria-hidden="true" /></button>}
      {count > 1 && <button type="button" onClick={() => go(1)} aria-label={t('venue.gallery.next')} className={`${btn} end-3 top-1/2 -translate-y-1/2`}><NextIcon size={22} aria-hidden="true" /></button>}
      <figure className="flex h-full flex-col items-center justify-center px-16 py-14">
        <img src={current.src} alt={current.alt} className="max-h-full max-w-full rounded-lg object-contain shadow-2xl" />
        <figcaption className="mt-4 text-center text-sm text-ivory/85" aria-live="polite">
          <span className="font-serif text-base text-ivory">{current.title}</span>
          <span className="mx-2 text-ivory/40" aria-hidden="true">·</span>
          {t('venue.gallery.counter', { current: index + 1, total: count })}
        </figcaption>
      </figure>
    </dialog>
  );
}
