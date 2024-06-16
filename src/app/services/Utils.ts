import { Review } from '../models/Review';
import { Place, WeekDays } from '../models/Place';
import { Item } from '../models/Item';

export const trackById = (index: number, k: Item | Place | Review | any) => {
  return k.id;
};

export const getMaterialIconNameForTag = (params: { id?: string; name?: string }) => {
  const str = params.name?.toLowerCase();
  if (str?.includes('kid') || str?.includes('child')) return 'child_friendly';
  if (str?.includes('vegan')) return 'nature_people';
  if (str?.includes('pet')) return 'pets';
  return '';
};

// var window: Window & typeof globalThis

export const generateCorrelationId = () => {
  const id = window.crypto.randomUUID();
  return id;
};

export const getFileType = (file: File | undefined) => {
  if (!file) {
    return undefined;
  }
  if (file.type.match('image.*')) return 'image';

  if (file.type.match('video.*')) return 'video';

  if (file.type.match('audio.*')) return 'audio';

  return 'other';
};

const DaySorter: any = {
  [WeekDays.SUNDAY]: 0, // << if sunday is first day of week
  [WeekDays.MONDAY]: 1,
  [WeekDays.TUESDAY]: 2,
  [WeekDays.WEDNESDAY]: 3,
  [WeekDays.THURSDAY]: 4,
  [WeekDays.FRIDAY]: 5,
  [WeekDays.SATURDAY]: 6,
};

// data.sort( (a: any, b: any)=> {
//   let day1 = a.day.toLowerCase();
//   let day2 = b.day.toLowerCase();
//   return DaySorter[day1] - DaySorter[day2];
// });

const sortDays = (days: WeekDays[]) => {
  days.sort((a: WeekDays, b: WeekDays) => {
    // let day1 = a.day.toLowerCase();
    // let day2 = b.day.toLowerCase();
    return DaySorter[a] - DaySorter[b];
  });
};
