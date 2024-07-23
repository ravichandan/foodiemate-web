import { Media } from './Media';
import { CustomerInfo } from './CustomerInfo';
import { Item } from './Item';
import { Place } from './Place';

export interface ReviewThread {
  _id: string;
  likedBy: CustomerInfo[];

}
export interface Review {
  _id: string;
  description: string;
  service: number;
  ambience: number;
  taste: number;
  presentation: number;
  medias: Media[];
  customer: CustomerInfo;
  place: Place;
  item: Item;
  placeItem: any;
  helpful: number;
  notHelpful: number;
  noOfReplies: number;
  info: ReviewThread;
  children: Review[];
  modifiedAt: Date;
}

export interface NewReview {
  _id?: string;
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
