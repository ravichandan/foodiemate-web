import { Media } from './Media';
import { Place } from './Place';
import { Review } from './Review';

export enum FoodAllergens {
  MILK = 'Milk',
  EGGS = 'Eggs',
  FISH = 'Fish',
  SHELLFISH = 'Crustacean shellfish',
  TREENUTS = 'Tree nuts',
  PEANUTS = 'Peanuts',
  WHEAT = 'Wheat',
  SOYBEANS = 'Soybeans',
}
export enum CalorieUnit {
  kJ = 'kJ',
  kcal = 'kcal',
}
export type CalorieInfo = {
  count: number;
  unit: CalorieUnit;
};
export interface Item {
  id: string;
  name: string;
  type: 'item';
  category: string;
  cuisine: string;
  description: string;
  allergens: FoodAllergens[];
  ingredients: string[];
  calorieInfo: CalorieInfo;
  taste: number;
  presentation: number;
  noOfReviews: number;
  price: number;
  medias: Media[];
  places: Place[];
  reviews: Review[];
}
