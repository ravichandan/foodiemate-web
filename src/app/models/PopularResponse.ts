import { Place } from './Place';
import { Item } from './Item';

export interface PopularResponse {
  page: number;
  size: number;
  places: Place[];
  items: Item[];
}
