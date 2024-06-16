import { Cuisine } from './Cuisine';

export interface ItemResponse {
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
