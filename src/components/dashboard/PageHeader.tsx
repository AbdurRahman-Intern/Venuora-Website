// Title row used at the top of every dashboard page. `action` is an optional button on the far side.
import type { ReactNode } from 'react';
export default function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-3xl">{title}</h1>{subtitle && <p className="mt-1.5 max-w-2xl text-sm text-charcoal/65">{subtitle}</p>}</div>
      {action}
    </div>
  );
}
