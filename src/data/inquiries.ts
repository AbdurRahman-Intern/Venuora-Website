// ---------------------------------------------------------------------------
// SAMPLE INQUIRIES and SAMPLE UNAVAILABLE DATES for the dashboard demo.
// All names, phone numbers and e-mails are FICTIONAL (example.com / 000 numbers).
// Dates are generated relative to "today" so the demo never looks stale.
// TODO: replace with API calls: GET /api/venues/{id}/inquiries and /availability.
// ---------------------------------------------------------------------------
import type { Inquiry } from '../types';
import { VENUE_ID } from '../config/venue';
import { addDays, todayISO } from '../utils/dates';

const today = todayISO();
const received = (daysAgo: number, hour = 10) => `${addDays(today, -daysAgo)}T${String(hour).padStart(2, '0')}:15:00`;

export const sampleInquiries: Inquiry[] = [
  { id: 'inq-1', venueId: VENUE_ID, createdAt: received(0, 9), customerName: 'Ahmad Rahimi', phone: '+93 70 000 0101', email: 'ahmad@example.com',
    contactMethod: 'whatsapp', kind: 'event', eventType: 'wedding', eventDate: addDays(today, 75), guests: 350, itemId: 'royal-wedding',
    message: 'We would like a tour of the ballroom and a quotation.', status: 'new' },
  { id: 'inq-2', venueId: VENUE_ID, createdAt: received(1, 15), customerName: 'Mariam Noori', phone: '+93 70 000 0102', email: '',
    contactMethod: 'phone', kind: 'event', eventType: 'engagement', eventDate: addDays(today, 40), guests: 120, itemId: 'classic-celebration',
    message: '', status: 'new' },
  { id: 'inq-3', venueId: VENUE_ID, createdAt: received(2, 11), customerName: 'Khalid Mansour', phone: '+971 50 000 0103', email: 'khalid@example.com',
    contactMethod: 'email', kind: 'room', checkIn: addDays(today, 20), checkOut: addDays(today, 23), guests: 2, itemId: 'deluxe-king',
    message: 'Late arrival expected around midnight.', status: 'contacted' },
  { id: 'inq-4', venueId: VENUE_ID, createdAt: received(4, 14), customerName: 'Sara Al-Hakim', phone: '+966 55 000 0104', email: 'sara@example.com',
    contactMethod: 'email', kind: 'event', eventType: 'conference', eventDate: addDays(today, 55), guests: 180, itemId: 'corporate-day',
    message: 'Full-day conference, need projector and lunch for 180.', status: 'pending' },
  { id: 'inq-5', venueId: VENUE_ID, createdAt: received(6, 16), customerName: 'Zarghona Popal', phone: '+93 70 000 0105', email: '',
    contactMethod: 'whatsapp', kind: 'event', eventType: 'birthday', eventDate: addDays(today, 18), guests: 45, itemId: 'intimate-gathering',
    message: 'Outdoor evening party if the weather allows.', status: 'contacted' },
  { id: 'inq-6', venueId: VENUE_ID, createdAt: received(9, 10), customerName: 'Omar Farouk', phone: '+20 10 0000 0106', email: 'omar@example.com',
    contactMethod: 'phone', kind: 'room', checkIn: addDays(today, 30), checkOut: addDays(today, 34), guests: 4, itemId: 'royal-suite',
    message: '', status: 'pending' },
  { id: 'inq-7', venueId: VENUE_ID, createdAt: received(14, 13), customerName: 'Nilofar Karimi', phone: '+93 70 000 0107', email: 'nilofar@example.com',
    contactMethod: 'email', kind: 'event', eventType: 'graduation', eventDate: addDays(today, -5), guests: 90, itemId: 'crystal-conference',
    message: 'Date has passed; customer chose another venue.', status: 'closed' },
];

/** Dates the venue has marked as unavailable (private events, maintenance...). Relative to today. */
export const sampleUnavailableDates: string[] = [
  addDays(today, 3), addDays(today, 4), addDays(today, 10), addDays(today, 11),
  addDays(today, 17), addDays(today, 24), addDays(today, 25), addDays(today, 26), addDays(today, 38),
];
