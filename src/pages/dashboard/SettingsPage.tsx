// ---------------------------------------------------------------------------
// VENUE SETTINGS: edit name/tagline/description/address in every language + contact details.
// Saved as OVERRIDES in localStorage (see useVenue in services/demoStore.ts); the original config file
// is never touched, and "Reset demo data" restores everything.
// NOTE: this edits the venue's own content. Changing the INTERFACE language does not modify these values.
// ---------------------------------------------------------------------------
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader';
import LocalizedFields from '../../components/dashboard/LocalizedFields';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import { resetDemoData, useVenue } from '../../services/demoStore';
import { normalizeDigits } from '../../utils/text';
import type { LocalizedText } from '../../types';

/** Remove empty translations so pickText() falls back to English instead of showing a blank. */
const prune = (txt: LocalizedText): LocalizedText => Object.fromEntries(Object.entries(txt).filter(([k, v]) => k === 'en' || (v && v.trim()))) as LocalizedText;

/** Remounting SettingsForm (by changing `key`) reloads its fields from the freshly reset data. */
export default function SettingsPage() {
  const [formKey, setFormKey] = useState(0);
  return <SettingsForm key={formKey} onReset={() => setFormKey((k) => k + 1)} />;
}

function SettingsForm({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation();
  const { venue, saveOverrides } = useVenue();
  const [form, setForm] = useState({
    name: venue.name, tagline: venue.tagline, description: venue.description, address: venue.address,
    phone: venue.contact.phone, whatsapp: venue.contact.whatsapp, email: venue.contact.email,
  });
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<'save' | 'reset' | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.en.trim()) { setError(t('dashboard.settings.englishRequired')); return; }
    setError('');
    saveOverrides({
      name: prune(form.name), tagline: prune(form.tagline), description: prune(form.description), address: prune(form.address),
      phone: form.phone.trim(), whatsapp: normalizeDigits(form.whatsapp).replace(/\D/g, ''), email: form.email.trim(),
    });
    setSaved('save');
  };

  const doReset = () => {
    resetDemoData();
    setConfirmReset(false);
    onReset();
  };

  return (
    <>
      <PageHeader title={t('dashboard.settings.title')} subtitle={t('dashboard.settings.intro')} />
      <form onSubmit={onSave} noValidate className="max-w-3xl space-y-8">
        <section className="card space-y-6 p-6">
          <h2 className="text-xl">{t('dashboard.settings.content')}</h2>
          <p className="rounded-lg bg-sage/50 p-3 text-xs text-charcoal/70">{t('dashboard.settings.interfaceNote')}</p>
          <LocalizedFields idPrefix="set-name" label={t('dashboard.settings.name')} value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={error} />
          <LocalizedFields idPrefix="set-tag" label={t('dashboard.settings.tagline')} value={form.tagline} onChange={(v) => setForm({ ...form, tagline: v })} requiredEnglish={false} />
          <LocalizedFields idPrefix="set-desc" label={t('dashboard.settings.description')} value={form.description} onChange={(v) => setForm({ ...form, description: v })} multiline requiredEnglish={false} />
          <LocalizedFields idPrefix="set-addr" label={t('dashboard.settings.address')} value={form.address} onChange={(v) => setForm({ ...form, address: v })} requiredEnglish={false} />
        </section>
        <section className="card grid gap-5 p-6 sm:grid-cols-3">
          <h2 className="text-xl sm:col-span-3">{t('dashboard.settings.business')}</h2>
          {([['phone', 'phone', 'tel'], ['whatsapp', 'whatsapp', 'text'], ['email', 'email', 'email']] as const).map(([key, label, type]) => (
            <div key={key}><label htmlFor={`set-${key}`} className="mb-1 block text-sm font-medium text-emerald">{t(`dashboard.settings.${label}`)}</label>
              <input id={`set-${key}`} dir="ltr" type={type} className="field" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></div>
          ))}
        </section>
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" variant="dark">{t('common.save')}</Button>
          {saved === 'save' && <p role="status" className="flex items-center gap-2 text-sm text-emerald"><CheckCircle2 size={16} aria-hidden="true" />{t('dashboard.settings.saved')}</p>}
        </div>
      </form>

      <section className="mt-12 max-w-3xl rounded-xl border border-red-200 bg-red-50/50 p-6">
        <p className="text-sm text-charcoal/75">{t('dashboard.settings.resetNote')}</p>
        <Button variant="outline" onClick={() => setConfirmReset(true)} className="mt-4"><RotateCcw size={15} aria-hidden="true" />{t('common.reset')}</Button>
      </section>
      <ConfirmDialog open={confirmReset} title={t('dashboard.settings.resetTitle')} message={t('dashboard.settings.resetMessage')} confirmLabel={t('common.reset')} onCancel={() => setConfirmReset(false)} onConfirm={doReset} />
    </>
  );
}
