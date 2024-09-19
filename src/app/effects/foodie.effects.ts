import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { AppService } from '../services/app.service';
import * as FoodieActions from '../actions/foodie.actions';
import { catchError, filter, map, mergeMap, of, switchMap, take, tap } from 'rxjs';
import { PopularResponse } from '../models/PopularResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { CuisinesResponse } from '../models/CuisinesResponse';
import { CuisinesItemsResponse } from '../models/CuisinesItemsResponse';
import { Item } from '../models/Item';
import { Place } from '../models/Place';
import { customerSelector, searchFilterSelector } from '../selectors/foodie.selector';
import { ItemResponse } from '../models/ItemResponse';
import { SuburbsResponse } from '../models/SuburbsResponse';

@Injectable({ providedIn: 'root' })
export class FoodieEffects {

  private actions$: Actions<any> = inject(Actions);

  // Effect mediates the 'fetching the popular searches'
  loadPopulars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.fetchPopular),
      switchMap((_) => this.store.select(searchFilterSelector()).pipe(filter(Boolean), take(1))),
      mergeMap((filters: any) =>
          this.appService.getPopularSearches({city: filters.address.city, suburb: filters.suburb, postcode: filters.address.postcode, diets: filters.diets }).pipe(
          map((popular: PopularResponse) => FoodieActions.fetchPopularSuccess({ popular })),
          catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
        ),
      ),
    ),
  );

  // Effect mediates the 'fetching the all cuisines'
  loadCuisines$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.fetchCuisines),
      tap((x) => console.log('in loadCuisines$ effect')),
      mergeMap(() =>
        this.appService.getAllCuisines().pipe(
          map((cuisinesResponse: CuisinesResponse) => FoodieActions.fetchCuisinesSuccess({ cuisinesResponse })),
          catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
        ),
      ),
    ),
  );

  // Effect mediates the 'fetching the all Suburbs'
  loadSuburbs = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.fetchSuburbs),
      tap((x) => console.log('in loadSuburbs effect')),
      mergeMap((action) =>
        this.appService.getAllSuburbs(action.city).pipe(
          map((suburbsResponse: SuburbsResponse) => FoodieActions.fetchSuburbsSuccess({ suburbsResponse })),
          catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
        ),
      ),
    ),
  );

  // Effect mediates the 'fetching the all cuisines items'
  loadCuisinesItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.fetchCuisinesItems),
      tap((x) => console.log('in loadCuisinesItems$ effect')),
      mergeMap(() =>
        this.appService.getCuisinesItems().pipe(
          map((cuisinesItemsResponse: CuisinesItemsResponse) =>
            FoodieActions.fetchCuisinesItemsSuccess({ cuisinesItemsResponse }),
          ),
          catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
        ),
      ),
    ),
  );
  // Effect mediates the 'fetching the asked item by id'
  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.fetchItem),
      tap((x) => console.log('in loadItem$ effect', x)),
      mergeMap((action) =>
        this.appService.getItem({ id: action.id }).pipe(
          map((item: Item) => FoodieActions.fetchItemSuccess({ item })),
          catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
        ),
      ),
    ),
  );

  // Effect mediates the 'fetching the asked item by id'
  loadAPlace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.fetchPlace),
      tap((x) => console.log('in loadAPlace$ effect', x)),
      mergeMap((action) =>
        this.appService.getPlace({ id: action.id, fetchMenu: action.fetchMenu ?? false, fetchReviews: action.fetchReviews ?? false }).pipe(
          filter(Boolean),
          map((place: Place) => FoodieActions.fetchPlaceSuccess({ place })),
          catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
        ),
      ),
    ),
  );
  // Effect mediates the 'fetching the asked item by id'
  fetchPlacesOfItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.fetchPlacesOfItem),
      tap((x) => console.log('in fetchPlacesOfItem$ effect', x)),
      mergeMap((action) =>
        this.appService.getItem({ id: action.id, city: action.city, suburb: action.suburb, postcode: action.postcode, pageSize: action.pageSize, pageNum: action.pageNum }).pipe(
          map((itemResponse: ItemResponse) => FoodieActions.fetchPlacesOfItemSuccess({ itemResponse })),
          catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
        ),
      ),
    ),
  );
  // Effect mediates the 'fetching the asked item by id'
  // Effect mediates the 'liking a review'
  fetchItemOfAPlaces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.fetchItemOfAPlace),
      tap((x) => console.log('in fetchPlacesOfItem$ effect', x)),
      switchMap((action) =>
        this.appService.fetchItemInAPlace({ itemId: action.itemId, placeId: action.placeId, placeItemId: action.placeItemId }).pipe(
          // map((place: Place) => FoodieActions.fetchItemOfAPlaceSuccess({response: { placeId: place.id, item: place.items[action.itemId]}})),
          tap(placesResponse => console.log('in 1.fetchPlacesOfItem$ effect, placesResponse', placesResponse)),
          map((response) => FoodieActions.fetchItemOfAPlaceSuccess({ response } )),
          catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
        ),
      ),
    ),
  );
  likeReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.likeReview),
      tap((x) => console.log('in likeReview$ effect', x)),
      mergeMap((action) =>
        this.appService
          .feedbackReview({ reviewId: action.reviewId, action: 'like' })
          .pipe(
            map((review: any) => FoodieActions.feedbackReviewSuccess({ review })),
            catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
          ),
      ),
    ),
  );
  // Effect mediates the 'unliking a review'
  unlikeReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.unlikeReview),
      tap((x) => console.log('in unlikeReview$ effect', x)),
      mergeMap((action) =>
        this.appService
          .feedbackReview({ reviewId: action.reviewId, action: 'unlike' })
          .pipe(
            map((review: any) => FoodieActions.feedbackReviewSuccess({ review })),
            catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
          ),
      ),
    ),
  );
  // Effect mediates the 'disliking a review'
  dislikeReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.dislikeReview),
      tap((x) => console.log('in dislikeReview$ effect', x)),
      mergeMap((action) =>
        this.appService
          .feedbackReview({ reviewId: action.reviewId, action: 'dislike' })
          .pipe(
            map((review: any) => FoodieActions.feedbackReviewSuccess({ review })),
            catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
          ),
      ),
    ),
  );
  // Effect mediates the 'undisliking a review'
  undislikeReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.undislikeReview),
      tap((x) => console.log('in undislikeReview$ effect', x)),
      mergeMap((action) =>
        this.appService
          .feedbackReview({ reviewId: action.reviewId, action: 'undislike' })
          .pipe(
            map((review: any) => FoodieActions.feedbackReviewSuccess({ review })),
            catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
          ),
      ),
    ),
  );
  // Effect mediates the 'undisliking a review'
  // postReview$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(FoodieActions.newPostReview),
  //     tap((x) => console.log('in postReview$ effect', x)),
  //     switchMap((_) => this.store.select(preloadReviewDataSelector()).pipe(filter(Boolean), take(1))),
  //     tap((x) => console.log('2. in postReview$ effect2 , review:: ', x)),
  //     mergeMap((review) =>
  //       this.appService.postReview(review).pipe(
  //         map((review: any) => FoodieActions.newPostReviewSuccess({ review })),
  //         catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
  //       ),
  //     ),
  //   ),
  // );

  // Effect mediates the 'logging in oidc customer'
  loginOidcCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.loginOidcCustomer),
      tap((x) => console.log('in loginOidcCustomer$ effect', x)),
      switchMap((action) =>
        // this.appService.getPopularSearches().pipe(
        //   tap((x) => console.log('in loginOidcCustomer$ getPopularSearches response', x)),
        //   map((popular: PopularResponse) => FoodieActions.fetchPopularSuccess({ popular })),
        //   catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
        this.appService.loginCustomer({ userInfo: action.userInfo}).pipe(
          // map((response: Response) => response.status === 201 ?
          //   FoodieActions.loginOidcCustomerSuccess({ customer }):
          //   FoodieActions.loginOidcCustomerSuccess({ customer: response.body as unknown as CustomerInfo }):
          // ),
          tap((customer) => console.log('in tap, customer:: ', customer)),
          map(
            (
              customer: any, //customer.status === 'verified' ?
            ) => FoodieActions.loginOidcCustomerSuccess({ customer: {...customer, id: customer._id} }),
            // : FoodieActions.askForVerification({ customer })
          ),
          catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
        ),
      ),
    ),
  );
  logoutCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.logoutCustomer),
      tap((x) => console.log('in logoutCustomer$ effect', x)),
      switchMap((_) => this.store.select(customerSelector()).pipe(filter(Boolean), take(1))),
      switchMap((customer) =>
        this.appService.logoutCustomer(customer?._id).pipe(
          map((_) => FoodieActions.logoutCustomerSuccess()),
          catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
        ),
      ),
    ),
  );
  // Effect mediates the 'update customer details'
  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FoodieActions.updateCustomer),
      tap((x) => console.log('in updateCustomer$ effect', x)),
      switchMap((_) => this.store.select(customerSelector()).pipe(filter(Boolean), take(1))),
      mergeMap((customer) =>
        !!customer
          ? this.appService.updateCustomer(customer).pipe(
              map((review: any) => FoodieActions.newPostReviewSuccess({ review })),
              catchError((error: HttpErrorResponse) => of(FoodieActions.failed({ error }))),
            )
          : of(FoodieActions.failed({ error: new Error('Customer is not found') })),
      ),
    ),
  );

  constructor(
    private store: Store<State>,
    private appService: AppService,
  ) {}
}
