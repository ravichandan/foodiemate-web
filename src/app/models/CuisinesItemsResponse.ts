import { Cuisine } from './Cuisine';

export interface CuisinesItemsResponse {
  data: CuisinesItems[];
}

export interface CuisinesItems {
  id: number;
  cuisine: string;
  items: [
    {
      id: number;
      name: string;
      category: string;
      cuisine: string;
      description: string;
      taste: number;
      presentation: number;
    },
  ];
}
