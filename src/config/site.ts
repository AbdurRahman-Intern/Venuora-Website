// ---------------------------------------------------------------------------
// PLATFORM (marketing site) CONFIGURATION
// Change the values in this file to re-brand the platform website. All contact details used by the
// marketing site and its footer come from here - never type a phone number into a component.
// ---------------------------------------------------------------------------

export const siteConfig = {
  // CHANGE: your product / company name. Not translated on purpose (brand names stay the same).
  platformName: 'Venuora',

  // CHANGE: short brand mark shown in the logo badge.
  logoLetter: 'V',

  // CHANGE: PLACEHOLDER contact details. Replace with your real business details before going live.
  contact: {
    email: 'abdurrahmanaipy@gmail.com',
    phone: '+93 77 091 9175',
    // Digits only, with country code and no "+" or spaces (this is the format wa.me expects).
    whatsapp: '93700000000',
    address: { en: 'Kabul, Afghanistan (placeholder)' },
  },

  social: [
    { label: 'Facebook', url: 'https://facebook.com/' },
    { label: 'Instagram', url: 'https://instagram.com/' },
  ],

  // Where the legal pages will live. TODO: write real privacy and terms pages.
  legal: { privacyUrl: '#', termsUrl: '#' },
};

// ---------------------------------------------------------------------------
// PRICING PLANS
// `price: null` renders "Contact for pricing". To show a sample price set e.g. `price: 299`.
// `currency` is an ISO code. `featureIds` map to translations in `marketing.pricing.features.<id>`.
// The pricing note under the cards (translated) says final scope is agreed per project.
// ---------------------------------------------------------------------------
export interface PricingPlan {
  id: 'starter' | 'professional' | 'premium';
  price: number | null;
  currency: string;
  highlighted: boolean;
  featureIds: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'starter', price: null, currency: 'USD', highlighted: false,
    featureIds: ['premiumWebsite', 'basicInfo', 'gallery', 'contactDetails', 'whatsapp'],
  },
  {
    id: 'professional', price: null, currency: 'USD', highlighted: true,
    featureIds: ['everythingStarter', 'multiSection', 'packagesFacilities', 'inquiryForm', 'availabilityDisplay', 'basicSeo'],
  },
  {
    id: 'premium', price: null, currency: 'USD', highlighted: false,
    featureIds: ['everythingProfessional', 'dashboard', 'advancedCustomization', 'extraManagement', 'optionalSupport'],
  },
];

// ---------------------------------------------------------------------------
// FEATURE LIST + HONEST AVAILABILITY STATUS
//   'available' : works today in the demo build
//   'demo'      : works in the demo, but only against sample data in the browser (no backend yet)
//   'planned'   : not built yet
// The marketing site shows this status on each feature card so we never overclaim.
// ---------------------------------------------------------------------------
export type FeatureStatus = 'available' | 'demo' | 'planned';

export const features: { id: string; icon: string; status: FeatureStatus }[] = [
  { id: 'website',       icon: 'LayoutTemplate', status: 'available' },
  { id: 'gallery',       icon: 'Images',         status: 'available' },
  { id: 'spaces',        icon: 'BedDouble',      status: 'available' },
  { id: 'packages',      icon: 'Package',        status: 'available' },
  { id: 'inquiryForm',   icon: 'ClipboardList',  status: 'demo' },
  { id: 'availability',  icon: 'CalendarDays',   status: 'demo' },
  { id: 'whatsapp',      icon: 'MessageCircle',  status: 'available' },
  { id: 'inquiryMgmt',   icon: 'Inbox',          status: 'demo' },
  { id: 'multilingual',  icon: 'Languages',      status: 'available' },
  { id: 'responsive',    icon: 'Smartphone',     status: 'available' },
];
