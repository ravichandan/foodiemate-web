import { Injectable } from '@angular/core';
import { CuisinesResponse } from '../models/CuisinesResponse';
import { Cuisine } from '../models/Cuisine';

@Injectable({ providedIn: 'root' })
export class StaticDataService {

  public getCuisines(): CuisinesResponse {
    return {
      "cuisines": [
        Cuisine. INDIAN,
        Cuisine.ITALIAN,
        Cuisine. CHINESE,
        Cuisine. JAPANESE,
        Cuisine. MIDDLE_EAST,
        Cuisine. MEXICAN,
        Cuisine. GREEK,
        Cuisine. AFRICAN
      ]
      /*"cuisines": [
        {
          "name": "INDIAN",
          "value": 'Indian',
          "id": 1
        },
        {
          "name": "ITALIAN",
          "value": 'Italian',
          "id": 2
        },
        {
          "name": "CHINESE",
          "value": "Chinese",
          "id": 3
        },
        {
          "name": "JAPANESE",
          "value": "Japanese",
          "id": 4
        },
        {
          "name": "ASIAN",
          "value": "Asian",
          "id": 5
        },
        {
          "name": "MIDDLE_EAST",
          "value": "Middle East",
          "id": 6
        },
        {
          "name": "MEXICAN",
          "value": "Mexican",
          "id": 7
        },
        {
          "name": "GREEK",
          "value": "Greek",
          "id": 8
        },
        {
          "name": "AFRICAN",
          "value": "African",
          "id": 9
        }
      ]*/
    }

  }

  public getCuisineItems() {
    return {
      "cuisines": [
        {
          "name": "ITALIAN",
          "id": 1
        },
        {
          "name": "INDIAN",
          "id": 2
        },
        {
          "name": "CHINESE",
          "id": 3
        },
        {
          "name": "JAPANESE",
          "id": 4
        },
        {
          "name": "ASIAN",
          "id": 5
        },
        {
          "name": "INDO_CHINESE",
          "id": 6
        },
        {
          "name": "INDO_ITALIAN",
          "id": 7
        },
        {
          "name": "MIDDLE_EAST",
          "id": 8
        },
        {
          "name": "MEXICAN",
          "id": 9
        },
        {
          "name": "GREEK",
          "id": 10
        },
        {
          "name": "AFRICAN",
          "id": 11
        }
      ]
    }

  }

}
