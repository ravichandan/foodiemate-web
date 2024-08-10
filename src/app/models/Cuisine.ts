
export enum Cuisine {
  INDIAN= 'Indian',
  ITALIAN= 'Italian',
  CHINESE='Chinese',
  JAPANESE='Japanese',
  MIDDLE_EAST='Middle East',
  MEXICAN='Mexican',
  GREEK='Greek',
  AFRICAN='African'

}

export function parseCuisine(cuisine: string): Cuisine {
  return Cuisine[cuisine as keyof typeof Cuisine];
}
