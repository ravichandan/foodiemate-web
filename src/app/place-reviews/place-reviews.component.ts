import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../models/Place';
import { Item } from '../models/Item';
import { filter, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { itemDetailOfAPlaceSelector, itemSelector, placeSelector } from '../selectors/foodie.selector';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Review } from '../models/Review';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { ReviewUnitComponent } from '../review-unit/review-unit.component';
import { PlaceReviewUnitComponent } from '../place-review-unit/place-review-unit.component';
import { placeRoutes } from '../place-detail/place-routing.module';
import { AppService } from '../services/app.service';
import * as FoodieActions from '../actions/foodie.actions';

@Component({
  selector: 'app-place-reviews',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    ReviewUnitComponent,
    PlaceReviewUnitComponent,
  ],
  templateUrl: './place-reviews.component.html',
  styleUrl: './place-reviews.component.scss',
})
export class PlaceReviewsComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<any>;
  config: any;

  appService= inject(AppService);

  @Input('place')
  place: Place | undefined;

  // @Input('item')
  // item!: Item;

  reviews$: Observable<Review[] | undefined> | undefined;

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'label',
    textField: 'label',
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: false,
  };
  selectedReviewFilter: any;
  selectedStarFilter: any;
  private selectedPlaceId: any;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
  }

  ngOnInit() {
    const pid = this.route.snapshot.paramMap.get('placeId') || '';
    console.log('in place-reviews.component, ngOnInit()', pid);

    this.reviews$ = this.store.select(placeSelector(pid)).pipe(
      takeUntil(this.destroy$),
      filter((x) => !!x),
      tap((x) => console.log('place received in place-reviews.component:: ', x)),
      tap((p) => (this.place = p)),
      map((x) => x?.reviews),
    );

    this.route.paramMap
      .pipe(
        // tap(x => console.log('in paramMap, params:: ')),
        takeUntil(this.destroy$),
        tap((params: ParamMap) => {
          console.log('in place-reviews->paramMap, params:: ', params);
          this.selectedPlaceId = params.get('placeId');
          this.store.dispatch(FoodieActions.fetchPlace({ id: this.selectedPlaceId, fetchReviews: true }));
        }),
      )
      .subscribe();

    // this.reviews$ = selected$.pipe(
    //     map(p => p?.reviews));

    console.log('in place-reviews.component, ngOninit');
    this.selectedReviewFilter = [this.config?.itemDetailFilterBy?.[0]];
    this.selectedStarFilter = [this.config?.itemDetailFilterByStars?.[0]];
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  onReviewFilterChange($event: ListItem) {}

  onStarFilterChange($event: ListItem) {}
}
