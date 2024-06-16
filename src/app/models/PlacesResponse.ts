import { Place } from './Place';

export interface PlacesResponse {
  size: number;
  pageNum: number;
  places: Place[];
}
