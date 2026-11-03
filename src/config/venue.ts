// ---------------------------------------------------------------------------
// DEMONSTRATION VENUE: "The Grand Emerald" (a FICTIONAL venue)
//
// TO CUSTOMISE THIS DEMO FOR A REAL CUSTOMER, edit only this file plus the files in src/data/:
//   1. name / tagline / description / about / address  -> write each language you have; any
//      language you leave out automatically falls back to English (see pickText in utils/text.ts)
//   2. contact (phone, whatsapp, email, hours, mapUrl, social)
//   3. sections            -> hide parts a business does not offer (e.g. rooms: false for a wedding hall)
//   4. gallery images      -> put photos in public/images and update the `src` paths below
//   5. rooms, spaces, packages -> src/data/rooms.ts, spaces.ts, packages.ts
//
// Everything here is SAMPLE content. The phone/WhatsApp numbers are placeholders, not real numbers.
// TODO: replace with a `venues` table loaded from the Laravel API (one row per customer = multi-tenant).
// ---------------------------------------------------------------------------
import type { Venue, GalleryImage } from '../types';

export const VENUE_ID = 'grand-emerald';

export const venue: Venue = {
  id: VENUE_ID,
  name: {
    en: 'The Grand Emerald',
    ar: 'ذا غراند إميرالد',
    'fa-AF': 'گرند امرالد',
    'ps-AF': 'ګرانډ ایمرالډ',
  },
  tagline: {
    en: 'Where Extraordinary Celebrations Begin.',
    ar: 'حيث تبدأ الاحتفالات الاستثنائية.',
    'fa-AF': 'جایی که جشن‌های فراموش‌نشدنی آغاز می‌شود.',
    'ps-AF': 'چېرته چې ځانګړي جشنونه پیلېږي.',
  },
  description: {
    en: 'A fictional luxury hotel and event venue: grand ballrooms, elegant suites and attentive service for weddings, conferences and every occasion worth remembering.',
    ar: 'فندق وقاعة مناسبات افتراضية فاخرة: قاعات كبرى وأجنحة أنيقة وخدمة متميزة لحفلات الزفاف والمؤتمرات وكل مناسبة تستحق أن تُذكر.',
    'fa-AF': 'یک هتل و تالار فرضی لوکس: تالارهای بزرگ، اتاق‌های زیبا و خدمات دقیق برای عروسی، کنفرانس و هر مناسبتی که شایستهٔ یادگاری باشد.',
    'ps-AF': 'یو فرضي لوکس هوټل او د مراسمو تالار: لوی تالارونه، ښکلې خونې او ځانګړې خدمات د واده، کنفرانس او هر هغه مراسمو لپاره چې د یادولو وړ وي.',
  },
  about: [
    {
      en: 'The Grand Emerald is a fictional venue created to show what a premium hospitality website can look like. Imagine a landmark hotel with a ballroom for six hundred guests, a quiet garden terrace and a team that treats every event as its own.',
      ar: 'ذا غراند إميرالد مكان افتراضي أُنشئ ليُظهر كيف يمكن أن يبدو موقع ضيافة راقٍ. تخيّل فندقاً عريقاً بقاعة تتسع لستمائة ضيف، وشرفة حدائق هادئة، وفريقاً يعامل كل مناسبة كأنها مناسبته الخاصة.',
      'fa-AF': 'گرند امرالد یک مکان فرضی است که برای نشان دادن ظاهر یک وبسایت مهمان‌نوازی عالی ساخته شده است. هتلی معروف را تصور کنید با تالاری برای ششصد مهمان، تراس باغی آرام و تیمی که هر مراسم را مراسم خودش می‌داند.',
      'ps-AF': 'ګرانډ ایمرالډ یو فرضي ځای دی چې د یوې عالي میلمستیا وېب پاڼې بڼه ښيي. یو نامتو هوټل وګورئ چې شپږ سوه میلمنو لپاره تالار، آرام باغي تراس او داسې ډله لري چې هر مراسم خپل ګڼي.',
    },
    {
      en: 'From intimate engagements to large weddings and corporate conferences, our spaces adapt to your plans, with catering, décor and coordination handled by one dedicated team.',
      ar: 'من حفلات الخطوبة الصغيرة إلى الأعراس الكبيرة والمؤتمرات المؤسسية، تتكيّف قاعاتنا مع خططكم، مع تولّي فريق واحد متخصص للضيافة والديكور والتنسيق.',
      'fa-AF': 'از مراسم نامزدی کوچک تا عروسی‌های بزرگ و کنفرانس‌های شرکتی، تالارهای ما با برنامهٔ شما سازگار می‌شوند و پذیرایی، دیکور و هماهنگی را یک تیم اختصاصی انجام می‌دهد.',
      'ps-AF': 'له کوچنیو انګېرنو نیولې تر لویو ودونو او شرکتي کنفرانسونو پورې، زموږ تالارونه ستاسو له پلان سره برابرېږي، او خواړه، سجاوټ او همغږي یوه ځانګړې ډله سمبالوي.',
    },
  ],
  hospitality: {
    en: 'A dedicated coordinator guides you from your first visit to the last guest leaving. Tasting sessions, flexible layouts and multilingual staff are part of how we work.',
    ar: 'ينسّق معكم منسّق مخصص منذ الزيارة الأولى حتى مغادرة آخر ضيف. جلسات تذوّق وتصاميم مرنة وفريق متعدد اللغات جزء من أسلوب عملنا.',
    'fa-AF': 'یک هماهنگ‌کنندهٔ اختصاصی از نخستین دیدار تا رفتن آخرین مهمان شما را همراهی می‌کند. جلسات چشیدن غذا، چیدمان‌های انعطاف‌پذیر و کارمندان چندزبانه بخشی از شیوهٔ کار ماست.',
    'ps-AF': 'یو ځانګړی همغږي کوونکی له لومړي لیدنې تر وروستي میلمه پورې ستاسو ملګری وي. د خواړو ازمېښت، انعطاف منونکې ترتیبات او څو ژبی کارکوونکي زموږ د کار برخه ده.',
  },
  address: {
    en: 'Demo Boulevard, Sample City',
    ar: 'شارع العرض، مدينة نموذجية',
    'fa-AF': 'سرک نمایشی، شهر نمونه',
    'ps-AF': 'نمایشي سړک، نمونه ښار',
  },
  capacity: 600,
  heroImage: '/images/hall.svg',
  aboutImages: ['/images/lobby.svg', '/images/dining.svg'],
  facilities: ['parking', 'wifi', 'airConditioning', 'bridalSuite', 'soundSystem', 'generator', 'security', 'prayerRoom', 'valet', 'garden'],
  eventTypes: ['wedding', 'engagement', 'conference', 'banquet', 'birthday', 'corporate', 'graduation'],

  // Set any of these to false to hide that part of the site and its navigation link.
  sections: { gallery: true, spaces: true, rooms: true, packages: true, availability: true },

  contact: {
    // PLACEHOLDERS - never use a personal number in a public demo.
    phone: '+93 70 000 0001',
    whatsapp: '93700000001', // digits only, with country code (see buildWhatsAppUrl)
    email: 'events@example.com',
    hours: {
      en: 'Daily, 9:00 - 21:00 (sample hours)',
      ar: 'يومياً، 9:00 - 21:00 (ساعات تجريبية)',
      'fa-AF': 'هر روز، ۹:۰۰ - ۲۱:۰۰ (ساعات نمونه)',
      'ps-AF': 'هره ورځ، ۹:۰۰ - ۲۱:۰۰ (نمونه وختونه)',
    },
    mapUrl: 'https://www.openstreetmap.org/#map=5/34.5/66.0', // TODO: link to the real location
    social: [
      { label: 'Facebook', url: 'https://facebook.com/' },
      { label: 'Instagram', url: 'https://instagram.com/' },
    ],
  },
};

// Gallery photos. The files in public/images are illustrated placeholders (see scripts/generate-images.mjs).
export const gallery: GalleryImage[] = [
  { id: 'g1', src: '/images/hall.svg', category: 'hall',
    title: { en: 'Grand Ballroom', ar: 'القاعة الكبرى', 'fa-AF': 'تالار بزرگ', 'ps-AF': 'لوی تالار' } },
  { id: 'g2', src: '/images/stage.svg', category: 'stage',
    title: { en: 'Wedding Stage', ar: 'منصة العروسين', 'fa-AF': 'استیج عروسی', 'ps-AF': 'د واده سټیج' } },
  { id: 'g3', src: '/images/decor.svg', category: 'decor',
    title: { en: 'Event Décor', ar: 'ديكور المناسبات', 'fa-AF': 'دیکور مراسم', 'ps-AF': 'د مراسمو سجاوټ' } },
  { id: 'g4', src: '/images/dining.svg', category: 'dining',
    title: { en: 'Banquet Dining', ar: 'مائدة الولائم', 'fa-AF': 'دسترخوان مهمانی', 'ps-AF': 'د میلمستیا دسترخوان' } },
  { id: 'g5', src: '/images/room.svg', category: 'rooms',
    title: { en: 'Deluxe Room', ar: 'غرفة ديلوكس', 'fa-AF': 'اتاق دیلوکس', 'ps-AF': 'ډیلوکس خونه' } },
  { id: 'g6', src: '/images/suite.svg', category: 'rooms',
    title: { en: 'Royal Suite', ar: 'الجناح الملكي', 'fa-AF': 'سوییت شاهانه', 'ps-AF': 'شاهي سوېټ' } },
  { id: 'g7', src: '/images/exterior.svg', category: 'exterior',
    title: { en: 'Hotel Exterior', ar: 'واجهة الفندق', 'fa-AF': 'نمای بیرونی هتل', 'ps-AF': 'د هوټل بهرنی بڼه' } },
  { id: 'g8', src: '/images/conference.svg', category: 'conference',
    title: { en: 'Conference Hall', ar: 'قاعة المؤتمرات', 'fa-AF': 'تالار کنفرانس', 'ps-AF': 'د کنفرانس تالار' } },
  { id: 'g9', src: '/images/lobby.svg', category: 'hall',
    title: { en: 'Grand Lobby', ar: 'البهو الرئيسي', 'fa-AF': 'لابی اصلی', 'ps-AF': 'لوی لابي' } },
];
