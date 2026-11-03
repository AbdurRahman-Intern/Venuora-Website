// ---------------------------------------------------------------------------
// INQUIRY FORM VALIDATION (pure functions, no React).
// Returns a map of field -> translation key (e.g. 'validation.phoneInvalid'). The form translates the
// key with t(), so error messages always follow the active language.
//
// !! This is CLIENT-SIDE validation for user experience only. !!
// TODO: the Laravel API must repeat every rule (FormRequest) because the browser can be bypassed.
//       Availability / overlap checks must also be done on the server against real data.
// ---------------------------------------------------------------------------
import type { InquiryKind, ContactMethod } from '../types';
import { normalizeDigits } from './text';
import { eachDay, todayISO } from './dates';

export interface InquiryFormValues {
  kind: InquiryKind;
  name: string;
  phone: string;
  email: string;
  contactMethod: ContactMethod;
  eventType: string;
  eventDate: string;
  checkIn: string;
  checkOut: string;
  guests: string;       // kept as text while typing, converted on submit
  itemId: string;
  message: string;
}

export type FieldErrors = Partial<Record<keyof InquiryFormValues, { key: string; params?: Record<string, unknown> }>>;

export const MAX_MESSAGE_LENGTH = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** "+93 (70) 000-0000" -> "+93700000000". Accepts Arabic/Persian digits too. */
export function cleanPhone(raw: string): string {
  return normalizeDigits(raw).replace(/[\s\-().]/g, '');
}

export function parseGuests(raw: string): number {
  const n = Number(normalizeDigits(raw).trim());
  return Number.isInteger(n) ? n : NaN;
}

export function validateInquiry(v: InquiryFormValues, unavailable: string[], maxGuests: number | null): FieldErrors {
  const e: FieldErrors = {};
  const today = todayISO();

  if (v.name.trim().length < 2) e.name = { key: 'validation.nameShort' };

  if (!v.phone.trim()) e.phone = { key: 'validation.required' };
  else if (!/^\+?\d{7,15}$/.test(cleanPhone(v.phone))) e.phone = { key: 'validation.phoneInvalid' };

  if (v.email.trim()) { if (!EMAIL_RE.test(v.email.trim())) e.email = { key: 'validation.emailInvalid' }; }
  else if (v.contactMethod === 'email') e.email = { key: 'validation.emailRequired' };

  if (v.kind === 'event') {
    if (!v.eventType) e.eventType = { key: 'validation.required' };
    if (!v.eventDate) e.eventDate = { key: 'validation.dateRequired' };
    else if (v.eventDate < today) e.eventDate = { key: 'validation.datePast' };
    else if (unavailable.includes(v.eventDate)) e.eventDate = { key: 'validation.dateUnavailable' };
  } else {
    if (!v.checkIn) e.checkIn = { key: 'validation.dateRequired' };
    else if (v.checkIn < today) e.checkIn = { key: 'validation.datePast' };
    if (!v.checkOut) e.checkOut = { key: 'validation.dateRequired' };
    else if (v.checkIn && v.checkOut <= v.checkIn) e.checkOut = { key: 'validation.checkOutAfter' };
    // Every NIGHT of the stay (check-in inclusive, check-out exclusive) must be free.
    if (!e.checkIn && !e.checkOut && eachDay(v.checkIn, v.checkOut).some((d) => unavailable.includes(d))) {
      e.checkOut = { key: 'validation.stayUnavailable' };
    }
  }

  const guests = parseGuests(v.guests);
  if (!v.guests.trim() || !(guests >= 1)) e.guests = { key: 'validation.guestsInvalid' };
  else if (maxGuests !== null && guests > maxGuests) e.guests = { key: 'validation.guestsTooMany', params: { max: maxGuests } };

  if (v.message.length > MAX_MESSAGE_LENGTH) e.message = { key: 'validation.messageLong', params: { max: MAX_MESSAGE_LENGTH } };
  return e;
}
