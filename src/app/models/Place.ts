import { Media } from './Media';
import { Item } from './Item';
import { Review } from './Review';
import { Address } from './Address';
import { Rating } from './Rating';

export interface Place {
  _id: string;
  type: 'place';
  placeName: string;
  name: string;
  description: string;
  service: number;
  ambience: number;
  noOfReviews: number;
  // items: { [k: string]: Item };
  items: Item[];
  tags: { id: string; label: string }[];
  openingTimes: OpeningTimes;
  reviews: Review[];
  medias: Media[];
  address: Address;
  placeItem: any;
  placeItems: any;
  ratingInfo: Rating;
}

export enum FriendlyTag {
  PET = 'Pet Friendly',
  VEGAN = 'Vegan Options',
  KID = 'Kid Friendly',
  DATE = 'Ideal For Date nights',
}

export enum WeekDays {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}
// o: {[p: string]: WeekDays} | ArrayLike<WeekDays>):
export type OpeningTimes = {
  [p in WeekDays]: [{
    open: number;
    close: number;
    mayDiffer: boolean;
  }];
};
