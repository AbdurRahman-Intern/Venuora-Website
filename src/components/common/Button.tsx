// ---------------------------------------------------------------------------
// Button: one component for every button/link look. Pass `to` for internal routes (React Router),
// `href` for external links, or neither for a normal <button>.
// Variants: gold (main CTA), dark, outline, ghost, light (for dark backgrounds).
// ---------------------------------------------------------------------------
import { Link } from 'react-router-dom';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

type Variant = 'gold' | 'dark' | 'outline' | 'ghost' | 'light' | 'danger';

const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60';
const variants: Record<Variant, string> = {
  gold: 'bg-gold text-emerald hover:bg-[#d3b57f]',
  dark: 'bg-emerald text-ivory hover:bg-emerald-800',
  outline: 'border border-emerald/30 text-emerald hover:bg-emerald/5',
  ghost: 'text-emerald hover:bg-emerald/5',
  light: 'border border-white/40 text-white hover:bg-white/10',
  danger: 'bg-red-700 text-white hover:bg-red-800',
};

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: Variant;
  to?: string;
  href?: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
}

export default function Button({ variant = 'gold', to, href, external, className = '', children, ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) {
    return (
      <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  }
  return <button type="button" className={cls} {...rest}>{children}</button>;
}
