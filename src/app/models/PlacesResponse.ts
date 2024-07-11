import { Place } from './Place';

export interface PlacesResponse {
  size: number;
  page: number;
  places: Place[];
}
