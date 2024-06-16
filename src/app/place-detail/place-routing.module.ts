import { Routes } from '@angular/router';
import { PlaceDetailComponent } from './place-detail.component';
import { ItemListComponent } from '../item-list/item-list.component';
import { PlaceReviewsComponent } from '../place-reviews/place-reviews.component';

export const placeRoutes: Routes = [
  {
    path: '',
    component: PlaceDetailComponent,
  },
  // children: [
  {
    path: 'menu',
    component: ItemListComponent,
  },
  {
    path: 'reviews',
    component: PlaceDetailComponent,

    children: [
      {
        path: '',
        component: PlaceReviewsComponent,
      },
    ],
  },

  // path: 'places/:placeId',
  //     component: PlaceDetailComponent,
  //     children: [
  //         {
  //             path: '',
  //             redirectTo: '/menu',
  //             pathMatch: 'full'
  //         },
  //         // children: [
  //         {
  //             path: 'menu',
  //             component: ItemListComponent
  //         },
  //         {
  //             path: 'reviews',
  //             component: PlaceReviewsComponent
  //         },
  //         {
  //             path: 'items/:itemId',
  //             component: ItemDetailComponent
  //         }
  //         // ]
  //         // }
  //     ]
  // }
];
