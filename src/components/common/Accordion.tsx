// ---------------------------------------------------------------------------
// Accessible accordion (FAQ). Each header is a <button> with aria-expanded + aria-controls;
// the panel is hidden with the `hidden` attribute when closed. Only one item open at a time.
// ---------------------------------------------------------------------------
import { useId, useState } from 'react';
import { Plus } from 'lucide-react';

export interface AccordionItem { id: string; question: string; answer: string }

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const uid = useId();
  return (
    <div className="divide-y divide-emerald/10 rounded-xl border border-emerald/10 bg-white shadow-soft">
      {items.map((item) => {
        const open = openId === item.id;
        const panelId = `${uid}-${item.id}-panel`;
        return (
          <div key={item.id}>
            <h3 className="!font-sans">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-base font-semibold text-emerald sm:px-6"
              >
                <span>{item.question}</span>
                <Plus size={18} aria-hidden="true" className={`shrink-0 text-gold-dark transition-transform ${open ? 'rotate-45' : ''}`} />
              </button>
            </h3>
            <div id={panelId} role="region" hidden={!open} className="px-5 pb-5 text-sm leading-relaxed text-charcoal/75 sm:px-6">
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
