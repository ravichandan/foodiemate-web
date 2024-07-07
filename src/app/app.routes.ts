import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BrowseComponent } from './browse/browse.component';
import { PlaceListComponent } from './place-list/place-list.component';
import { PostReviewComponent } from './post-review/post-review.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'index.html',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'browse',
    component: BrowseComponent,
  },
  {
    path: 'items/:itemId',
    component: PlaceListComponent,
  },
  {
    path: 'new_review',
    component: PostReviewComponent,
    // canActivate: [AuthGuardService],
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'places/:placeId',
    loadChildren: () =>
      import('./place-detail/place-routing.module').then((mod) => {
        console.log('loading mod.placeroutes');
        return mod.placeRoutes;
      }),
  },
  {
    path: 'places/:placeId/items/:itemId',
    component: ItemDetailComponent,
  },
];
// {
//   path:'places/:placeId',
//       component: PlaceDetailComponent
// },
// {
//   path:'places/:placeId/menu',
//       component: ItemListComponent
// },
// {
//   path:'places/:placeId/items/:itemId',
//       component: ItemDetailComponent
// },
