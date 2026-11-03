// ---------------------------------------------------------------------------
// Shared TypeScript types.
// These are intentionally "database-ready": each interface maps almost 1:1 to a table you could
// create later in MySQL (venues, rooms, event_spaces, packages, inquiries, unavailable_dates).
// ---------------------------------------------------------------------------

/** The four interface languages. These strings are also the keys of the translation files. */
export type Locale = 'en' | 'ar' | 'fa-AF' | 'ps-AF';

/**
 * Text that a BUSINESS writes about itself (venue name, room description...), stored once per language.
 * English is required and acts as the fallback; the other languages are optional.
 * This is deliberately separate from the interface translations in src/i18n/locales.
 * TODO: in the Laravel version, move this to a `translations` table or JSON columns.
 */
export type LocalizedText = { en: string } & Partial<Record<Exclude<Locale, 'en'>, string>>;

export type FacilityId =
  | 'wifi' | 'parking' | 'airConditioning' | 'bridalSuite' | 'stage' | 'soundSystem' | 'projector'
  | 'generator' | 'security' | 'prayerRoom' | 'garden' | 'lift' | 'breakfast' | 'roomService'
  | 'minibar' | 'workDesk' | 'tv' | 'laundry' | 'valet' | 'kidsArea';

export type ServiceId =
  | 'decoration' | 'catering' | 'buffet' | 'lighting' | 'photography' | 'coordinator' | 'welcomeDrinks' | 'cleanup';

export type EventTypeId = 'wedding' | 'engagement' | 'conference' | 'banquet' | 'birthday' | 'corporate' | 'graduation';

export type GalleryCategory = 'hall' | 'stage' | 'decor' | 'dining' | 'rooms' | 'exterior' | 'conference';

export interface GalleryImage {
  id: string;
  src: string;               // path under /public or a full URL
  category: GalleryCategory;
  title: LocalizedText;      // also used to build the alt text
}

export interface Room {
  id: string;
  venueId: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  maxGuests: number;
  beds: { type: 'king' | 'queen' | 'twin' | 'single'; count: number }[];
  facilities: FacilityId[];
  pricePerNight: number | null; // null => "Contact for pricing"
  currency: string;             // ISO 4217 code, e.g. 'USD'
}

export interface EventSpace {
  id: string;
  venueId: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  capacity: number;
  facilities: FacilityId[];
  eventTypes: EventTypeId[];
  packageIds: string[];
}

export interface EventPackage {
  id: string;
  venueId: string;
  name: LocalizedText;
  description: LocalizedText;
  capacity: number;
  price: number | null;      // null => "Contact for pricing"
  currency: string;
  includes: FacilityId[];
  services: ServiceId[];
  active: boolean;           // inactive packages are hidden from the public site
}

export type ContactMethod = 'phone' | 'whatsapp' | 'email';
export type InquiryKind = 'event' | 'room';
/** NOTE: there is deliberately no "confirmed" status. An inquiry is never a reservation. */
export type InquiryStatus = 'new' | 'contacted' | 'pending' | 'closed';

export interface Inquiry {
  id: string;
  venueId: string;           // TODO: tenant isolation - every query must be scoped by venueId on the server
  createdAt: string;         // ISO date-time
  customerName: string;
  phone: string;
  email: string;
  contactMethod: ContactMethod;
  kind: InquiryKind;
  eventType?: EventTypeId;
  eventDate?: string;        // YYYY-MM-DD
  checkIn?: string;          // YYYY-MM-DD
  checkOut?: string;         // YYYY-MM-DD
  guests: number;
  itemId?: string;           // selected room / space / package id
  message: string;
  status: InquiryStatus;
}

export interface Venue {
  id: string;
  name: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  about: LocalizedText[];          // paragraphs
  hospitality: LocalizedText;
  address: LocalizedText;
  capacity: number;                // largest event capacity
  heroImage: string;
  aboutImages: string[];
  facilities: FacilityId[];
  eventTypes: EventTypeId[];
  /** Turn sections on/off per business. A wedding hall can set rooms:false. */
  sections: { gallery: boolean; spaces: boolean; rooms: boolean; packages: boolean; availability: boolean };
  contact: {
    phone: string;
    whatsapp: string;              // digits with country code, e.g. 93700000000
    email: string;
    hours: LocalizedText;
    mapUrl: string;
    social: { label: string; url: string }[];
  };
}

/** The subset of Venue that the dashboard "Settings" page can edit (saved in localStorage). */
export interface VenueOverrides {
  name?: LocalizedText;
  tagline?: LocalizedText;
  description?: LocalizedText;
  address?: LocalizedText;
  phone?: string;
  whatsapp?: string;
  email?: string;
}
