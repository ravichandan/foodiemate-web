import { Media } from './Media';
import { CustomerInfo } from './CustomerInfo';
import { Item } from './Item';
import { Place } from './Place';

export interface Review {
  id: string;
  description: string;
  service: number;
  ambience: number;
  taste: number;
  presentation: number;
  medias: Media[];
  customer: CustomerInfo;
  place: Place;
  item: Item;
  helpful: number;
  notHelpful: number;
  likedBy: CustomerInfo[];
  children: Review[];
}

export interface NewReview {
  id?: string;
  description?: string;
  service?: number;
  ambience?: number;
  taste?: number;
  presentation?: number;
  medias?: Media[];
  customer?: CustomerInfo | string;
  place?: Place;
  item?: Item;
  children?: Review[];
}
