// ---------------------------------------------------------------------------
// EVENT SPACES (halls, terraces, conference rooms). Sample data.
// `packageIds` link a space to the packages in packages.ts.
// TODO: replace with an `event_spaces` table + API endpoint.
// ---------------------------------------------------------------------------
import type { EventSpace } from '../types';
import { VENUE_ID } from '../config/venue';

export const spaces: EventSpace[] = [
  {
    id: 'grand-ballroom', venueId: VENUE_ID, image: '/images/hall.svg', capacity: 600,
    facilities: ['stage', 'soundSystem', 'airConditioning', 'bridalSuite', 'generator', 'parking'],
    eventTypes: ['wedding', 'engagement', 'banquet'],
    packageIds: ['royal-wedding', 'classic-celebration'],
    name: { en: 'Grand Ballroom', ar: 'القاعة الكبرى', 'fa-AF': 'تالار بزرگ', 'ps-AF': 'لوی تالار' },
    description: {
      en: 'Our flagship hall with crystal chandeliers, a full stage and flexible seating for up to 600 guests.',
      ar: 'قاعتنا الرئيسية بثريات كريستالية ومنصة كاملة وترتيبات جلوس مرنة تتسع حتى 600 ضيف.',
      'fa-AF': 'تالار اصلی ما با چراغ‌های آویز کریستالی، استیج کامل و چیدمان انعطاف‌پذیر برای تا ۶۰۰ مهمان.',
      'ps-AF': 'زموږ اصلي تالار د کرسټالي څراغونو، بشپړ سټیج او تر ۶۰۰ میلمنو پورې انعطاف منونکې ناستې سره.',
    },
  },
  {
    id: 'crystal-conference', venueId: VENUE_ID, image: '/images/conference.svg', capacity: 250,
    facilities: ['projector', 'soundSystem', 'wifi', 'airConditioning', 'generator'],
    eventTypes: ['conference', 'corporate', 'graduation'],
    packageIds: ['corporate-day'],
    name: { en: 'Crystal Conference Hall', ar: 'قاعة كريستال للمؤتمرات', 'fa-AF': 'تالار کنفرانس کریستال', 'ps-AF': 'د کرسټال کنفرانس تالار' },
    description: {
      en: 'A modern conference space with projection, reliable internet and breakout areas.',
      ar: 'قاعة مؤتمرات عصرية مزودة بجهاز عرض وإنترنت موثوق ومساحات جانبية للنقاش.',
      'fa-AF': 'فضای کنفرانس مدرن با پروجکتور، انترنت مطمئن و بخش‌های جانبی برای بحث گروهی.',
      'ps-AF': 'یو عصري کنفرانس ځای د پروجکټر، باوري انټرنېټ او اړخیزو ګوښو سره.',
    },
  },
  {
    id: 'garden-terrace', venueId: VENUE_ID, image: '/images/decor.svg', capacity: 150,
    facilities: ['garden', 'soundSystem', 'kidsArea', 'security'],
    eventTypes: ['engagement', 'birthday', 'banquet'],
    packageIds: ['intimate-gathering', 'classic-celebration'],
    name: { en: 'Garden Terrace', ar: 'شرفة الحديقة', 'fa-AF': 'تراس باغ', 'ps-AF': 'د باغ تراس' },
    description: {
      en: 'An open-air terrace lit by lanterns in the evening, perfect for smaller celebrations.',
      ar: 'شرفة مفتوحة تضيئها الفوانيس مساءً، مثالية للاحتفالات الأصغر.',
      'fa-AF': 'تراسی روباز که شام‌ها با فانوس روشن می‌شود، مناسب برای مراسم کوچک‌تر.',
      'ps-AF': 'یو خلاص تراس چې ماښام د فانوسونو په رڼا روښانه کېږي، د کوچنیو مراسمو لپاره مناسب.',
    },
  },
];
