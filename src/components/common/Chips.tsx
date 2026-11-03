// Small pill list used for facilities, event types and services. Pass already-translated labels.
export default function Chips({ items, tone = 'sage' }: { items: string[]; tone?: 'sage' | 'gold' }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((label) => (
        <li key={label} className={`rounded-full px-2.5 py-1 text-xs ${tone === 'gold' ? 'bg-gold/15 text-gold-dark' : 'bg-sage/70 text-emerald'}`}>{label}</li>
      ))}
    </ul>
  );
}
