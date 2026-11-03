// ---------------------------------------------------------------------------
// EVENT PACKAGES (sample data - NOT real offers or prices).
// These are the DEFAULTS. The dashboard lets the demo user add/edit/delete packages; those edits are
// saved in localStorage and override this list (see services/demoStore.ts).
// `price: null` shows "Contact for pricing".
// TODO: replace with a `packages` table + API endpoint.
// ---------------------------------------------------------------------------
import type { EventPackage } from '../types';
import { VENUE_ID } from '../config/venue';

export const defaultPackages: EventPackage[] = [
  {
    id: 'classic-celebration', venueId: VENUE_ID, capacity: 150, price: 4500, currency: 'USD', active: true,
    includes: ['soundSystem', 'airConditioning', 'parking'],
    services: ['decoration', 'buffet', 'welcomeDrinks'],
    name: { en: 'Classic Celebration', ar: 'احتفال كلاسيكي', 'fa-AF': 'جشن کلاسیک', 'ps-AF': 'کلاسیک جشن' },
    description: {
      en: 'A complete setup for engagements, birthdays and family gatherings.',
      ar: 'تجهيز متكامل لحفلات الخطوبة وأعياد الميلاد واللقاءات العائلية.',
      'fa-AF': 'تجهیزات کامل برای مراسم نامزدی، تولد و دورهمی‌های خانوادگی.',
      'ps-AF': 'بشپړ تجهیزات د انګېرنې، د زېږدنې او کورنیو غونډو لپاره.',
    },
  },
  {
    id: 'royal-wedding', venueId: VENUE_ID, capacity: 400, price: 12000, currency: 'USD', active: true,
    includes: ['stage', 'bridalSuite', 'soundSystem', 'generator', 'valet'],
    services: ['decoration', 'catering', 'lighting', 'photography', 'coordinator'],
    name: { en: 'Royal Wedding', ar: 'العرس الملكي', 'fa-AF': 'عروسی شاهانه', 'ps-AF': 'شاهي واده' },
    description: {
      en: 'Our most complete wedding experience in the Grand Ballroom, with a dedicated coordinator.',
      ar: 'تجربة الزفاف الأكمل لدينا في القاعة الكبرى مع منسّق مخصص.',
      'fa-AF': 'کامل‌ترین تجربهٔ عروسی ما در تالار بزرگ، همراه با هماهنگ‌کنندهٔ اختصاصی.',
      'ps-AF': 'زموږ ترټولو بشپړ د واده تجربه په لوی تالار کې، د ځانګړي همغږي کوونکي سره.',
    },
  },
  {
    id: 'corporate-day', venueId: VENUE_ID, capacity: 120, price: null, currency: 'USD', active: true,
    includes: ['projector', 'wifi', 'airConditioning'],
    services: ['catering', 'coordinator', 'welcomeDrinks'],
    name: { en: 'Corporate Day', ar: 'يوم الشركات', 'fa-AF': 'روز شرکتی', 'ps-AF': 'شرکتي ورځ' },
    description: {
      en: 'Full-day conference hall with refreshments, lunch and technical support. Tailored to your agenda.',
      ar: 'قاعة مؤتمرات ليوم كامل مع المرطبات والغداء والدعم الفني، وتُصمَّم وفق جدولكم.',
      'fa-AF': 'تالار کنفرانس برای یک روز کامل با پذیرایی، ناهار و پشتیبانی فنی، مطابق برنامهٔ شما.',
      'ps-AF': 'د بشپړې ورځې کنفرانس تالار د یخو څښاکونو، غرمې او تخنیکي ملاتړ سره، ستاسو د مهال ویش سره سم.',
    },
  },
  {
    id: 'intimate-gathering', venueId: VENUE_ID, capacity: 60, price: 2200, currency: 'USD', active: true,
    includes: ['garden', 'soundSystem', 'security'],
    services: ['decoration', 'buffet', 'cleanup'],
    name: { en: 'Intimate Gathering', ar: 'لقاء حميم', 'fa-AF': 'دورهمی صمیمی', 'ps-AF': 'صمیمي غونډه' },
    description: {
      en: 'The Garden Terrace for up to sixty guests, with lanterns, music and a simple buffet.',
      ar: 'شرفة الحديقة لما يصل إلى ستين ضيفاً مع الفوانيس والموسيقى وبوفيه بسيط.',
      'fa-AF': 'تراس باغ برای تا شصت مهمان، با فانوس، موسیقی و بوفهٔ ساده.',
      'ps-AF': 'د باغ تراس تر شپېتو میلمنو پورې، د فانوسونو، میوزیک او ساده بوفې سره.',
    },
  },
];
