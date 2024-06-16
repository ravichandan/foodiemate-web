import { Media } from './Media';
import { FoodAllergens } from './Item';
import { Cuisine } from './Cuisine';

export enum ActivityLevels {
  BASIC = 'BASIC',
  FOODIE = 'FOODIE',
  INFLUENCER = 'INFLUENCER',
}
export interface CustomerInfo {
  id: string;
  name: string;
  media?: Media;
  email?: string;
  interestedIn: Cuisine[],
  allergens: FoodAllergens[];
  reviewedOn?: Date;
  totalPointsEarned: number;
  status: string;
  claimablePoints: number;
  level: ActivityLevels;
}
