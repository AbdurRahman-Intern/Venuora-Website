// Consistent section title block: small gold label, serif heading, optional intro paragraph.
interface Props { eyebrow?: string; title: string; subtitle?: string; align?: 'start' | 'center'; light?: boolean }

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', light }: Props) {
  return (
    <div className={`mx-auto max-w-2xl ${align === 'center' ? 'text-center' : 'text-start'}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className={`text-3xl sm:text-4xl leading-tight ${light ? '!text-ivory' : ''}`}>{title}</h2>
      {subtitle && <p className={`mt-4 text-base leading-relaxed ${light ? 'text-ivory/75' : 'text-charcoal/70'}`}>{subtitle}</p>}
    </div>
  );
}
