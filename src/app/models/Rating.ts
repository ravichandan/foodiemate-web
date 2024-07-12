import { Item } from './Item';
import { Place } from './Place';

export interface Rating {
  id: string;
  place: Place;
  item: Item;
  taste: number;
  presentation: number;
  service: number;
  ambience: number;
  noOfReviews: number;
  createdAt: Date;
  modifiedAt: Date;
}
