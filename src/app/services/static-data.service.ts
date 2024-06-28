import { Injectable } from '@angular/core';
import { CuisinesResponse } from '../models/CuisinesResponse';

@Injectable({ providedIn: 'root' })
export class StaticDataService {

  public getCuisines(): CuisinesResponse {
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
