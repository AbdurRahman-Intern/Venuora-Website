// ---------------------------------------------------------------------------
// ScrollManager: React Router does not scroll to "#section" anchors by itself.
// On every navigation: if the URL has a #hash, scroll that element into view (smooth), otherwise
// jump to the top. The tiny timeout waits for lazy pages to finish rendering.
// ---------------------------------------------------------------------------
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    const timer = window.setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 20) {
        window.clearInterval(timer);
        el?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [pathname, hash]);
  return null;
}
