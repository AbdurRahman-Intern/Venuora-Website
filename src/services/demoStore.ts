// ---------------------------------------------------------------------------
// DEMO DATA STORE (localStorage)
//
// This file is the ONLY place that reads/writes localStorage for demo data. Components call the
// hooks at the bottom (useInquiries, usePackages, ...) and never touch localStorage directly.
//
// !!! This is a DEMONSTRATION, not a database !!!
//   - Data lives in one browser on one device; clearing site data deletes it.
//   - Anyone with access to the browser can read or edit it. There is no authentication or security.
//   - Do NOT collect real customer information with this build.
// TODO: when the Laravel + MySQL backend exists, replace the bodies of these hooks with API calls
//       (fetch / React Query). The components that use them should not need to change.
// ---------------------------------------------------------------------------
import { useCallback, useSyncExternalStore } from 'react';
import type { EventPackage, Inquiry, InquiryStatus, VenueOverrides, Venue } from '../types';
import { sampleInquiries, sampleUnavailableDates } from '../data/inquiries';
import { defaultPackages } from '../data/packages';
import { venue as baseVenue } from '../config/venue';
import { newId } from '../utils/text';

const PREFIX = 'venue-demo:v1:'; // bump v1 -> v2 if you change a stored data shape, so old data is ignored

// In-memory copy so React gets a STABLE object between renders (required by useSyncExternalStore).
const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<() => void>>();

function read<T>(key: string, fallback: T): T {
  if (cache.has(key)) return cache.get(key) as T;
  let value = fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw) value = JSON.parse(raw) as T;
  } catch {
    // Private mode / blocked storage / corrupted JSON: silently use the sample data.
  }
  cache.set(key, value);
  return value;
}

function write<T>(key: string, value: T) {
  cache.set(key, value);
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* storage full or blocked */ }
  listeners.get(key)?.forEach((l) => l()); // tell every component using this key to re-render
}

function subscribe(key: string, listener: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(listener);
  return () => listeners.get(key)!.delete(listener);
}

// Keep several browser tabs in sync: the 'storage' event fires in OTHER tabs when one tab writes.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (!e.key?.startsWith(PREFIX)) return;
    const key = e.key.slice(PREFIX.length);
    cache.delete(key); // force re-read from storage
    listeners.get(key)?.forEach((l) => l());
  });
}

/** Generic hook: [value, setValue]. `fallback` must be a stable reference (module-level constant). */
function useStored<T>(key: string, fallback: T) {
  const value = useSyncExternalStore(
    (cb) => subscribe(key, cb),
    () => read(key, fallback),
    () => fallback,
  );
  const setValue = useCallback((next: T | ((prev: T) => T)) => {
    const prev = read(key, fallback);
    write(key, typeof next === 'function' ? (next as (p: T) => T)(prev) : next);
  }, [key, fallback]);
  return [value, setValue] as const;
}

/** Deletes every demo record so the sample data comes back. Used by the dashboard "Reset" button. */
export function resetDemoData() {
  for (const key of ['inquiries', 'packages', 'unavailable', 'venue']) {
    cache.delete(key);
    try { localStorage.removeItem(PREFIX + key); } catch { /* ignore */ }
    listeners.get(key)?.forEach((l) => l());
  }
}

// ----- Inquiries -------------------------------------------------------------------------------
export function useInquiries() {
  const [inquiries, setInquiries] = useStored<Inquiry[]>('inquiries', sampleInquiries);

  /** Called by the public inquiry form. Returns the saved record (with its generated id). */
  const addInquiry = useCallback((data: Omit<Inquiry, 'id' | 'createdAt' | 'status' | 'venueId'>) => {
    const record: Inquiry = {
      ...data,
      id: newId('inq'),
      venueId: baseVenue.id,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    setInquiries((prev) => [record, ...prev]);
    return record;
  }, [setInquiries]);

  const updateStatus = useCallback((id: string, status: InquiryStatus) =>
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i))), [setInquiries]);

  const removeInquiry = useCallback((id: string) =>
    setInquiries((prev) => prev.filter((i) => i.id !== id)), [setInquiries]);

  return { inquiries, addInquiry, updateStatus, removeInquiry };
}

// ----- Packages --------------------------------------------------------------------------------
export function usePackages() {
  const [packages, setPackages] = useStored<EventPackage[]>('packages', defaultPackages);

  const savePackage = useCallback((pkg: EventPackage) =>
    setPackages((prev) => (prev.some((p) => p.id === pkg.id)
      ? prev.map((p) => (p.id === pkg.id ? pkg : p))   // edit existing
      : [...prev, pkg])),                              // add new
  [setPackages]);

  const removePackage = useCallback((id: string) =>
    setPackages((prev) => prev.filter((p) => p.id !== id)), [setPackages]);

  return { packages, savePackage, removePackage };
}

// ----- Availability ----------------------------------------------------------------------------
/** Unavailable dates are "YYYY-MM-DD" strings. NOTE: this is NOT a reservation system. */
export function useUnavailableDates() {
  const [dates, setDates] = useStored<string[]>('unavailable', sampleUnavailableDates);

  const toggleDate = useCallback((iso: string) =>
    setDates((prev) => (prev.includes(iso) ? prev.filter((d) => d !== iso) : [...prev, iso].sort())), [setDates]);

  return { unavailableDates: dates, toggleDate };
}

// ----- Venue settings --------------------------------------------------------------------------
const NO_OVERRIDES: VenueOverrides = {};

/**
 * Returns the venue config MERGED with edits made on the dashboard Settings page.
 * The original config file is never modified; overrides are stored separately, so it is always
 * possible to reset to the defaults.
 */
export function useVenue() {
  const [overrides, setOverrides] = useStored<VenueOverrides>('venue', NO_OVERRIDES);

  const venue: Venue = {
    ...baseVenue,
    name: overrides.name ?? baseVenue.name,
    tagline: overrides.tagline ?? baseVenue.tagline,
    description: overrides.description ?? baseVenue.description,
    address: overrides.address ?? baseVenue.address,
    contact: {
      ...baseVenue.contact,
      phone: overrides.phone ?? baseVenue.contact.phone,
      whatsapp: overrides.whatsapp ?? baseVenue.contact.whatsapp,
      email: overrides.email ?? baseVenue.contact.email,
    },
  };
  return { venue, overrides, saveOverrides: setOverrides };
}

/**
 * True if localStorage can really be written (it can be blocked in private mode or by browser settings).
 * The inquiry form checks this BEFORE claiming success, so a customer is never told "received" when
 * nothing was saved.
 */
export function isStorageAvailable(): boolean {
  try {
    const k = PREFIX + '__probe';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}
