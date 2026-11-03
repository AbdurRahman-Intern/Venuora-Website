// ---------------------------------------------------------------------------
// usePageMeta(): sets the browser tab title, meta description and Open Graph tags for a page.
// Pass already-translated strings. (Single-page apps can't give crawlers per-page HTML on their
// own; TODO for real SEO: pre-render or server-render public pages, e.g. via Laravel Blade/Inertia SSR.)
// ---------------------------------------------------------------------------
import { useEffect } from 'react';

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function usePageMeta(title: string, description: string, image = '/images/hero.svg') {
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image);
  }, [title, description, image]);
}
