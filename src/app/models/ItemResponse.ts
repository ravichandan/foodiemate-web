import { Item } from './Item';

export interface ItemResponse {
  size: number;
  page: number;
  items: Item[];
}
