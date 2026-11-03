// Platform logo: a monogram badge + brand name. Colours/name come from config/site.ts.
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site';

export default function Logo({ tone = 'dark', to = '/' }: { tone?: 'dark' | 'light'; to?: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2.5" aria-label={siteConfig.platformName}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald font-serif text-lg font-semibold text-gold ring-1 ring-gold/40">
        {siteConfig.logoLetter}
      </span>
      <span className={`font-serif text-xl font-semibold ${tone === 'dark' ? 'text-emerald' : 'text-ivory'}`}>{siteConfig.platformName}</span>
    </Link>
  );
}
