import { Location } from "./Location";

export interface Address {
  id: string;
  suburb: string;
  city: string;
  postcode: string;
  location: Location;
}
