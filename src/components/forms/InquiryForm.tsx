// ---------------------------------------------------------------------------
// INQUIRY FORM (public venue site)
//
// Two kinds of inquiry share one form: "event" (hall/package + event date) and "room" (check-in/out).
// Switching the toggle swaps the relevant fields; the labels and error messages are all translated.
//
// HOW IT WORKS
//   values  -> one object holding every field as text (see InquiryFormValues in utils/validation.ts)
//   errors  -> filled by validateInquiry() on submit, then re-checked on every change once the user
//              has tried to submit (so errors vanish as soon as they are fixed)
//   submit  -> validates, checks that storage works, saves via addInquiry(), shows the success panel
//
// DUPLICATE SUBMISSIONS: `submittedRef` blocks a second submit in the same tick (double-click), and
// once saved the form is replaced by the success panel until the user chooses "send another".
//
// DEMO LIMITATION: saving writes to localStorage only. Nothing is sent to the venue.
// TODO: replace addInquiry() with a POST to the Laravel API (POST /api/venues/{id}/inquiries), show
//       server-side validation errors the same way, and send an email/WhatsApp notification to the venue.
// ---------------------------------------------------------------------------
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import Button from '../common/Button';
import DatePickerField from './DatePickerField';
import { useLocale } from '../../hooks/useLocale';
import { addDays, todayISO } from '../../utils/dates';
import { normalizeDigits } from '../../utils/text';
import { MAX_MESSAGE_LENGTH, cleanPhone, parseGuests, validateInquiry, type FieldErrors, type InquiryFormValues } from '../../utils/validation';
import { isStorageAvailable, useInquiries } from '../../services/demoStore';
import type { EventPackage, EventSpace, InquiryKind, Room, Venue } from '../../types';

/** Lets the sections above (spaces, rooms, packages, calendar) pre-fill the form. `nonce` changes on every click. */
export interface InquiryPreset { kind: InquiryKind; itemId?: string; date?: string; nonce: number }

interface Props {
  venue: Venue;
  rooms: Room[];
  spaces: EventSpace[];
  packages: EventPackage[];
  unavailable: string[];
  preset: InquiryPreset | null;
}

const emptyValues = (kind: InquiryKind): InquiryFormValues => ({
  kind, name: '', phone: '', email: '', contactMethod: 'whatsapp', eventType: '', eventDate: '',
  checkIn: '', checkOut: '', guests: '', itemId: '', message: '',
});

/**
 * One labelled form row (label + control + hint + error message).
 * IMPORTANT: this lives OUTSIDE InquiryForm on purpose. A component defined inside another component
 * gets a new identity on every render, which makes React remount it and the input loses focus after
 * each keystroke. Keep it at module level.
 */
function FormField({ id, label, required, error, hint, children }: { id: string; label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode }) {
  const { t } = useTranslation();
  return (
    <div>
      <label htmlFor={`inq-${id}`} className="mb-1.5 block text-sm font-medium text-emerald">
        {label}{required && <span className="text-red-700" aria-hidden="true"> *</span>}
        {!required && <span className="ms-1 text-xs font-normal text-charcoal/45">({t('common.optional')})</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-charcoal/50">{hint}</p>}
      {error && <p id={`inq-${id}-err`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"><AlertTriangle size={13} aria-hidden="true" />{error}</p>}
    </div>
  );
}

export default function InquiryForm({ venue, rooms, spaces, packages, unavailable, preset }: Props) {
  const { t } = useTranslation();
  const { tx } = useLocale();
  const { addInquiry } = useInquiries();

  const hasRooms = venue.sections.rooms && rooms.length > 0;
  const hasEvents = venue.sections.spaces || venue.sections.packages;
  const [values, setValues] = useState<InquiryFormValues>(() => emptyValues(hasEvents ? 'event' : 'room'));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [tried, setTried] = useState(false);                 // true after the first submit attempt
  const [status, setStatus] = useState<'idle' | 'success' | 'failure'>('idle');
  const [savedName, setSavedName] = useState('');
  const submittedRef = useRef(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  // Items the customer can pick for the current kind.
  const options = useMemo(() => (values.kind === 'room'
    ? [{ group: 'rooms', items: rooms.map((r) => ({ id: r.id, label: tx(r.name), max: r.maxGuests })) }]
    : [
        { group: 'packages', items: venue.sections.packages ? packages.map((p) => ({ id: p.id, label: tx(p.name), max: p.capacity })) : [] },
        { group: 'spaces', items: venue.sections.spaces ? spaces.map((s) => ({ id: s.id, label: tx(s.name), max: s.capacity })) : [] },
      ]), [values.kind, rooms, spaces, packages, venue.sections, tx]);
  const maxGuests = options.flatMap((g) => g.items).find((i) => i.id === values.itemId)?.max ?? null;

  // Apply a preset coming from a card/calendar elsewhere on the page.
  useEffect(() => {
    if (!preset) return;
    setValues((v) => ({
      ...emptyValues(preset.kind), name: v.name, phone: v.phone, email: v.email, contactMethod: v.contactMethod, message: v.message,
      itemId: preset.itemId ?? '', eventDate: preset.kind === 'event' ? preset.date ?? '' : '',
      checkIn: preset.kind === 'room' ? preset.date ?? '' : '',
    }));
    setErrors({}); setTried(false); setStatus('idle'); submittedRef.current = false;
  }, [preset]);

  // Once the user has tried to submit, validate live so errors disappear as soon as they are fixed.
  useEffect(() => {
    if (tried) setErrors(validateInquiry(values, unavailable, maxGuests));
  }, [values, tried, unavailable, maxGuests]);

  const set = <K extends keyof InquiryFormValues>(key: K, value: InquiryFormValues[K]) => setValues((v) => ({ ...v, [key]: value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submittedRef.current) return;                       // duplicate-submission guard
    setTried(true);
    const found = validateInquiry(values, unavailable, maxGuests);
    setErrors(found);
    if (Object.keys(found).length) { window.setTimeout(() => errorSummaryRef.current?.focus(), 0); return; }
    submittedRef.current = true;
    if (!isStorageAvailable()) { setStatus('failure'); submittedRef.current = false; return; }
    const isRoom = values.kind === 'room';
    addInquiry({
      customerName: values.name.trim(),
      phone: cleanPhone(values.phone),
      email: values.email.trim(),
      contactMethod: values.contactMethod,
      kind: values.kind,
      eventType: isRoom ? undefined : (values.eventType as never),
      eventDate: isRoom ? undefined : values.eventDate,
      checkIn: isRoom ? values.checkIn : undefined,
      checkOut: isRoom ? values.checkOut : undefined,
      guests: parseGuests(values.guests),
      itemId: values.itemId || undefined,
      message: values.message.trim(),
    });
    setSavedName(values.name.trim());
    setStatus('success');
  };

  const reset = () => { setValues(emptyValues(values.kind)); setErrors({}); setTried(false); setStatus('idle'); submittedRef.current = false; };

  // ---- small render helpers --------------------------------------------------------------------
  const errText = (k: keyof InquiryFormValues) => { const er = errors[k]; return er ? t(er.key, er.params) : ''; };
  const ctl = (id: keyof InquiryFormValues) => ({ id: `inq-${id}`, 'aria-invalid': errors[id] ? true : undefined, 'aria-describedby': errors[id] ? `inq-${id}-err` : undefined, className: `field ${errors[id] ? 'field-error' : ''}` });

  if (status === 'success') {
    return (
      <div role="status" className="card mx-auto max-w-2xl p-8 text-center">
        <CheckCircle2 size={44} className="mx-auto text-emerald" aria-hidden="true" />
        <h3 className="mt-4 text-2xl">{t('venue.inquiry.successTitle')}</h3>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{t('venue.inquiry.successText', { name: savedName })}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/dashboard/inquiries" variant="dark">{t('venue.inquiry.viewDashboard')}</Button>
          <Button variant="outline" onClick={reset}>{t('venue.inquiry.newInquiry')}</Button>
        </div>
      </div>
    );
  }
  if (status === 'failure') {
    return (
      <div role="alert" className="card mx-auto max-w-2xl border-red-200 p-8 text-center">
        <ShieldAlert size={44} className="mx-auto text-red-700" aria-hidden="true" />
        <h3 className="mt-4 text-2xl">{t('venue.inquiry.failureTitle')}</h3>
        <p className="mt-3 text-sm text-charcoal/75">{t('venue.inquiry.failureText')}</p>
        <Button variant="dark" className="mt-6" onClick={() => setStatus('idle')}>{t('common.back')}</Button>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;
  const isRoom = values.kind === 'room';
  return (
    <form onSubmit={onSubmit} noValidate className="card mx-auto max-w-3xl p-6 sm:p-9" aria-describedby="inq-demo-note">
      {/* Event / hotel-stay toggle (hidden when the venue offers only one kind) */}
      {hasEvents && hasRooms && (
        <div role="group" className="mb-7 inline-flex rounded-lg bg-sage/60 p-1">
          {(['event', 'room'] as InquiryKind[]).map((k) => (
            <button key={k} type="button" aria-pressed={values.kind === k}
              onClick={() => { setValues({ ...emptyValues(k), name: values.name, phone: values.phone, email: values.email, contactMethod: values.contactMethod, message: values.message }); setErrors({}); }}
              className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${values.kind === k ? 'bg-emerald text-ivory shadow' : 'text-emerald hover:bg-white/60'}`}>
              {k === 'event' ? t('venue.inquiry.kindEvent') : t('venue.inquiry.kindRoom')}
            </button>
          ))}
        </div>
      )}

      {tried && errorCount > 0 && (
        <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          <AlertTriangle size={16} aria-hidden="true" />{t('validation.fixErrors')}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="name" error={errText('name')} label={t('forms.name')} required>
          <input {...ctl('name')} type="text" autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} placeholder={t('forms.namePlaceholder')} />
        </FormField>
        <FormField id="phone" error={errText('phone')} label={t('forms.phone')} required>
          {/* dir="ltr": phone numbers always read left-to-right, even inside an Arabic/Pashto page */}
          <input {...ctl('phone')} dir="ltr" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={(e) => set('phone', normalizeDigits(e.target.value))} placeholder={t('forms.phonePlaceholder')} />
        </FormField>
        <FormField id="email" error={errText('email')} label={t('forms.email')} required={values.contactMethod === 'email'}>
          <input {...ctl('email')} dir="ltr" type="email" autoComplete="email" value={values.email} onChange={(e) => set('email', e.target.value)} placeholder={t('forms.emailPlaceholder')} />
        </FormField>
        <FormField id="contactMethod" error={errText('contactMethod')} label={t('forms.contactMethod')} required>
          <select {...ctl('contactMethod')} value={values.contactMethod} onChange={(e) => set('contactMethod', e.target.value as InquiryFormValues['contactMethod'])}>
            {(['whatsapp', 'phone', 'email'] as const).map((m) => <option key={m} value={m}>{t(`enums.contactMethod.${m}`)}</option>)}
          </select>
        </FormField>

        {isRoom ? (
          <>
            <FormField id="checkIn" error={errText('checkIn')} label={t('forms.checkIn')} required>
              <DatePickerField id="inq-checkIn" value={values.checkIn} onChange={(d) => setValues((v) => ({ ...v, checkIn: d, checkOut: v.checkOut && v.checkOut <= d ? '' : v.checkOut }))}
                unavailable={unavailable} invalid={!!errors.checkIn} describedBy={errors.checkIn ? 'inq-checkIn-err' : undefined} />
            </FormField>
            <FormField id="checkOut" error={errText('checkOut')} label={t('forms.checkOut')} required>
              <DatePickerField id="inq-checkOut" value={values.checkOut} onChange={(d) => set('checkOut', d)} unavailable={[]}
                minDate={values.checkIn ? addDays(values.checkIn, 1) : todayISO()} invalid={!!errors.checkOut} describedBy={errors.checkOut ? 'inq-checkOut-err' : undefined} />
            </FormField>
          </>
        ) : (
          <>
            <FormField id="eventType" error={errText('eventType')} label={t('forms.eventType')} required>
              <select {...ctl('eventType')} value={values.eventType} onChange={(e) => set('eventType', e.target.value)}>
                <option value="">{t('forms.chooseOption')}</option>
                {venue.eventTypes.map((et) => <option key={et} value={et}>{t(`enums.eventType.${et}`)}</option>)}
              </select>
            </FormField>
            <FormField id="eventDate" error={errText('eventDate')} label={t('forms.eventDate')} required hint={t('forms.unavailableHint')}>
              <DatePickerField id="inq-eventDate" value={values.eventDate} onChange={(d) => set('eventDate', d)} unavailable={unavailable}
                invalid={!!errors.eventDate} describedBy={errors.eventDate ? 'inq-eventDate-err' : undefined} />
            </FormField>
          </>
        )}

        <FormField id="guests" error={errText('guests')} label={isRoom ? t('forms.occupants') : t('forms.guests')} required>
          <input {...ctl('guests')} dir="ltr" type="text" inputMode="numeric" value={values.guests} onChange={(e) => set('guests', normalizeDigits(e.target.value).replace(/[^\d]/g, ''))} />
        </FormField>
        <FormField id="itemId" error={errText('itemId')} label={t('forms.selectedItem')}>
          <select {...ctl('itemId')} value={values.itemId} onChange={(e) => set('itemId', e.target.value)}>
            <option value="">{t('forms.noPreference')}</option>
            {options.map((g) => g.items.length > 0 && (
              <optgroup key={g.group} label={t(`forms.optionGroups.${g.group}`)}>
                {g.items.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
              </optgroup>
            ))}
          </select>
        </FormField>
        <div className="sm:col-span-2">
          <FormField id="message" error={errText('message')} label={t('forms.message')}>
            <textarea {...ctl('message')} rows={4} maxLength={MAX_MESSAGE_LENGTH + 200} value={values.message} onChange={(e) => set('message', e.target.value)} placeholder={t('forms.messagePlaceholder')} />
          </FormField>
        </div>
      </div>

      <p className="mt-5 text-xs text-charcoal/55">{t('forms.required')}</p>
      <p id="inq-demo-note" className="mt-3 flex gap-2 rounded-lg bg-gold/15 p-3 text-xs leading-relaxed text-charcoal/75">
        <ShieldAlert size={15} className="mt-0.5 shrink-0 text-gold-dark" aria-hidden="true" />{t('venue.inquiry.demoStorage')}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-charcoal/55">{t('venue.inquiry.privacy')}</p>
      <Button type="submit" variant="gold" className="mt-6 w-full py-3.5 text-base sm:w-auto sm:px-10">{t('venue.inquiry.submit')}</Button>
      <Link to="/dashboard/inquiries" className="sr-only">{t('venue.inquiry.viewDashboard')}</Link>
    </form>
  );
}
