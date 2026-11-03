// ---------------------------------------------------------------------------
// PACKAGE MANAGEMENT (CRUD on the demo store): view, add, edit, delete with confirmation.
// The add/edit form is a modal. `draft` holds the package being edited; `isNew` decides whether
// Save creates a new id or replaces an existing one (see savePackage in services/demoStore.ts).
// Saved packages appear immediately on the public /demo site (only those marked `active`).
// TODO: replace savePackage/removePackage with API calls (POST/PUT/DELETE /api/venues/{id}/packages).
// ---------------------------------------------------------------------------
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { EyeOff, Pencil, Plus, Trash2, Users } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader';
import LocalizedFields from '../../components/dashboard/LocalizedFields';
import ConfirmDialog, { Modal } from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import Price from '../../components/common/Price';
import { VENUE_ID } from '../../config/venue';
import { CURRENCIES, FACILITY_IDS, SERVICE_IDS } from '../../config/options';
import { usePackages } from '../../services/demoStore';
import { useLocale } from '../../hooks/useLocale';
import { formatNumber } from '../../utils/dates';
import { newId, normalizeDigits } from '../../utils/text';
import type { EventPackage } from '../../types';

const blank = (): EventPackage => ({ id: newId('pkg'), venueId: VENUE_ID, name: { en: '' }, description: { en: '' }, capacity: 100, price: null, currency: 'USD', includes: [], services: [], active: true });

export default function PackagesPage() {
  const { t } = useTranslation();
  const { tx, intl } = useLocale();
  const { packages, savePackage, removePackage } = usePackages();
  const [draft, setDraft] = useState<EventPackage | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [priceText, setPriceText] = useState('');
  const [nameError, setNameError] = useState('');
  const [toDelete, setToDelete] = useState<EventPackage | null>(null);

  const open = (pkg: EventPackage | null) => {
    const base = pkg ? structuredClone(pkg) : blank();
    setDraft(base); setIsNew(!pkg); setPriceText(base.price === null ? '' : String(base.price)); setNameError('');
  };
  const close = () => setDraft(null);

  const toggle = <T extends string>(list: T[], id: T) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    if (!draft.name.en.trim()) { setNameError(t('dashboard.packages.englishRequired')); return; }
    const digits = normalizeDigits(priceText).trim();
    const price = digits === '' ? null : Number(digits);
    // Drop empty translations so the English fallback is used instead of showing blank text.
    const clean = (txt: EventPackage['name']) => Object.fromEntries(Object.entries(txt).filter(([, v]) => v && v.trim())) as EventPackage['name'];
    savePackage({ ...draft, name: clean(draft.name), description: { ...clean(draft.description), en: draft.description.en ?? '' }, price: price !== null && Number.isFinite(price) && price >= 0 ? price : null });
    close();
  };

  const checkboxGroup = (legend: string, ids: readonly string[], selected: string[], kind: 'facility' | 'service', onToggle: (id: string) => void) => (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-emerald">{legend}</legend>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-3">
        {ids.map((id) => (
          <label key={id} className="flex items-center gap-2"><input type="checkbox" checked={selected.includes(id)} onChange={() => onToggle(id)} className="h-4 w-4 accent-[#102B26]" />{t(`enums.${kind}.${id}`)}</label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <>
      <PageHeader title={t('dashboard.packages.title')} action={<Button variant="dark" onClick={() => open(null)}><Plus size={16} aria-hidden="true" />{t('dashboard.packages.add')}</Button>} />
      {packages.length === 0 ? (
        <div className="card p-12 text-center"><p className="font-serif text-xl text-emerald">{t('dashboard.packages.empty')}</p><p className="mt-2 text-sm text-charcoal/60">{t('dashboard.packages.emptyHint')}</p></div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {packages.map((p) => (
            <li key={p.id} className="card flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl">{tx(p.name)}</h2>
                {!p.active && <span className="inline-flex items-center gap-1 rounded-full bg-charcoal/10 px-2.5 py-1 text-xs"><EyeOff size={12} aria-hidden="true" />{t('dashboard.packages.hidden')}</span>}
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-charcoal/55"><Users size={13} aria-hidden="true" />{t('common.upTo', { count: formatNumber(p.capacity, intl) as unknown as number })}</p>
              <p className="mt-3 font-serif text-2xl text-emerald"><Price amount={p.price} currency={p.currency} /></p>
              <p className="mt-2 line-clamp-3 text-sm text-charcoal/65">{tx(p.description)}</p>
              <div className="mt-auto flex gap-2 pt-5">
                <Button variant="outline" onClick={() => open(p)}><Pencil size={14} aria-hidden="true" />{t('common.edit')}</Button>
                <Button variant="ghost" onClick={() => setToDelete(p)} className="!text-red-700 hover:!bg-red-50"><Trash2 size={14} aria-hidden="true" />{t('common.delete')}</Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={!!draft} onClose={close} wide title={isNew ? t('dashboard.packages.new') : t('dashboard.packages.edit')}>
        {draft && (
          <form onSubmit={onSave} noValidate className="space-y-6">
            <p className="rounded-lg bg-sage/50 p-3 text-xs text-charcoal/70">{t('dashboard.packages.languageNote')}</p>
            <LocalizedFields idPrefix="pkg-name" label={t('dashboard.packages.name')} value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} error={nameError} />
            <LocalizedFields idPrefix="pkg-desc" label={t('dashboard.packages.description')} value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} multiline requiredEnglish={false} />
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label htmlFor="pkg-cap" className="mb-1 block text-sm font-medium text-emerald">{t('dashboard.packages.capacity')}</label>
                <input id="pkg-cap" dir="ltr" inputMode="numeric" className="field" value={String(draft.capacity)} onChange={(e) => setDraft({ ...draft, capacity: Number(normalizeDigits(e.target.value).replace(/\D/g, '')) || 0 })} /></div>
              <div><label htmlFor="pkg-price" className="mb-1 block text-sm font-medium text-emerald">{t('dashboard.packages.price')}</label>
                <input id="pkg-price" dir="ltr" inputMode="decimal" className="field" value={priceText} onChange={(e) => setPriceText(e.target.value)} /></div>
              <div><label htmlFor="pkg-cur" className="mb-1 block text-sm font-medium text-emerald">{t('dashboard.packages.currency')}</label>
                <select id="pkg-cur" className="field" value={draft.currency} onChange={(e) => setDraft({ ...draft, currency: e.target.value })}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></div>
            </div>
            {checkboxGroup(t('dashboard.packages.includes'), FACILITY_IDS, draft.includes, 'facility', (id) => setDraft({ ...draft, includes: toggle(draft.includes, id as never) }))}
            {checkboxGroup(t('dashboard.packages.services'), SERVICE_IDS, draft.services, 'service', (id) => setDraft({ ...draft, services: toggle(draft.services, id as never) }))}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} className="h-4 w-4 accent-[#102B26]" />{t('dashboard.packages.active')}</label>
            <div className="flex justify-end gap-3 border-t border-emerald/10 pt-5">
              <Button variant="outline" onClick={close}>{t('common.cancel')}</Button>
              <Button type="submit" variant="dark">{t('common.save')}</Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog open={!!toDelete} title={t('dashboard.packages.deleteTitle')} confirmLabel={t('common.delete')}
        message={t('dashboard.packages.deleteMessage', { name: toDelete ? tx(toDelete.name) : '' })}
        onCancel={() => setToDelete(null)} onConfirm={() => { if (toDelete) removePackage(toDelete.id); setToDelete(null); }} />
    </>
  );
}
