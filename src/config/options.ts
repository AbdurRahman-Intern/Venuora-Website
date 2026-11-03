// Lists of selectable ids (facilities, services). Their display names live in the translation files
// under enums.facility.<id> / enums.service.<id>. To add a facility: add its id here AND to the
// FacilityId type in types/index.ts AND a translation in all four locale files.
import type { FacilityId, ServiceId } from '../types';

export const FACILITY_IDS: FacilityId[] = ['wifi', 'parking', 'airConditioning', 'bridalSuite', 'stage', 'soundSystem', 'projector', 'generator', 'security', 'prayerRoom', 'garden', 'lift', 'breakfast', 'roomService', 'minibar', 'workDesk', 'tv', 'laundry', 'valet', 'kidsArea'];
export const SERVICE_IDS: ServiceId[] = ['decoration', 'catering', 'buffet', 'lighting', 'photography', 'coordinator', 'welcomeDrinks', 'cleanup'];
export const CURRENCIES = ['USD', 'EUR', 'AED', 'SAR', 'AFN'];
