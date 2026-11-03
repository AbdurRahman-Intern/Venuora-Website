// ---------------------------------------------------------------------------
// HOTEL ROOMS (sample data). Prices are demonstration values only.
// A venue with no rooms simply exports an empty array (or sets venue.sections.rooms = false).
// TODO: replace with a `rooms` table + API endpoint.
// ---------------------------------------------------------------------------
import type { Room } from '../types';
import { VENUE_ID } from '../config/venue';

export const rooms: Room[] = [
  {
    id: 'deluxe-king', venueId: VENUE_ID, image: '/images/room.svg', maxGuests: 2,
    beds: [{ type: 'king', count: 1 }],
    facilities: ['wifi', 'airConditioning', 'minibar', 'tv', 'workDesk'],
    pricePerNight: 120, currency: 'USD',
    name: { en: 'Deluxe King Room', ar: 'غرفة ديلوكس بسرير كبير', 'fa-AF': 'اتاق دیلوکس با تخت بزرگ', 'ps-AF': 'ډیلوکس خونه د لوی بستر سره' },
    description: {
      en: 'A calm, light-filled room with a king bed, a work desk and views over the garden.',
      ar: 'غرفة هادئة مليئة بالضوء بسرير كبير ومكتب عمل وإطلالة على الحديقة.',
      'fa-AF': 'اتاقی آرام و روشن با تخت بزرگ، میز کار و منظره به باغ.',
      'ps-AF': 'یوه آرامه او روښانه خونه د لوی بستر، د کار میز او باغ ته لید سره.',
    },
  },
  {
    id: 'executive-twin', venueId: VENUE_ID, image: '/images/room.svg', maxGuests: 3,
    beds: [{ type: 'twin', count: 2 }],
    facilities: ['wifi', 'airConditioning', 'tv', 'laundry', 'roomService'],
    pricePerNight: 95, currency: 'USD',
    name: { en: 'Executive Twin Room', ar: 'غرفة تنفيذية بسريرين', 'fa-AF': 'اتاق اجرایی دو تخته', 'ps-AF': 'اجرایوي دوه بستره خونه' },
    description: {
      en: 'Two comfortable beds and extra space, ideal for colleagues or family travelling together.',
      ar: 'سريران مريحان ومساحة إضافية، مثالية للزملاء أو للعائلة المسافرة معاً.',
      'fa-AF': 'دو تخت راحت و فضای بیشتر، مناسب برای همکاران یا خانواده‌هایی که با هم سفر می‌کنند.',
      'ps-AF': 'دوه آرامه بسترونه او ډیر ځای، د همکارانو یا کورنۍ لپاره چې یوځای سفر کوي.',
    },
  },
  {
    id: 'royal-suite', venueId: VENUE_ID, image: '/images/suite.svg', maxGuests: 4,
    beds: [{ type: 'king', count: 1 }, { type: 'single', count: 2 }],
    facilities: ['wifi', 'airConditioning', 'minibar', 'tv', 'roomService', 'lift'],
    pricePerNight: 260, currency: 'USD',
    name: { en: 'Royal Suite', ar: 'الجناح الملكي', 'fa-AF': 'سوییت شاهانه', 'ps-AF': 'شاهي سوېټ' },
    description: {
      en: 'Our signature suite with a separate lounge, ideal for the wedding couple or distinguished guests.',
      ar: 'جناحنا المميز بصالة جلوس منفصلة، مثالي للعروسين أو للضيوف الكرام.',
      'fa-AF': 'سوییت ویژهٔ ما با اتاق نشیمن جداگانه، مناسب برای عروس و داماد یا مهمانان گرامی.',
      'ps-AF': 'زموږ ځانګړی سوېټ د جلا ناستې خونې سره، د ناوې او زوم یا محترمو میلمنو لپاره.',
    },
  },
];
