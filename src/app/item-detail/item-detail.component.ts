import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { filter, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { Item } from '../models/Item';
import * as FoodieActions from '../actions/foodie.actions';
import { itemDetailOfAPlaceSelector } from '../selectors/foodie.selector';
import { Place } from '../models/Place';
import { AsyncPipe, DecimalPipe, LowerCasePipe, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { Review } from '../models/Review';
import { NgbCarousel, NgbSlide, NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import configJson from '../../config.json';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {PlaceReviewsComponent} from "../item-detail/item-detail.component";
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReviewUnitComponent } from '../review-unit/review-unit.component';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf,
    NgbCarousel,
    NgbSlide,
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    ReviewUnitComponent,
    NgbTooltipModule,
    LowerCasePipe,
    TitleCasePipe,
  ],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss',
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<any>;
  config: any;

  place$: Observable<Place | undefined> | undefined;
  selectedItemId: any;
  selectedPlaceId: any;
  item: Item | undefined;
  selectedPlace: Place | undefined;
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<State>,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = configJson;
  }

  ngOnInit() {
    console.log('in item-detail.component, ngOnInit()');
    this.selectedPlaceId = this.route.snapshot.paramMap.get('placeId');
    this.selectedItemId = this.route.snapshot.paramMap.get('itemId');

    const selected$ = this.store.select(itemDetailOfAPlaceSelector(this.selectedPlaceId, this.selectedItemId)).pipe(
      takeUntil(this.destroy$),
      filter((data) => !!data),
      tap((x) => console.log('place received in item-detail.component:: ', x)),
    );

    this.place$ = selected$.pipe(
      tap((p) => (this.selectedPlace = p)),
      tap((p: Place | undefined) => (this.item = p?.items[this.selectedItemId])),
    );

    this.reviews$ = selected$.pipe(map((x) => x?.items[this.selectedItemId].reviews));

    this.route.paramMap
      .pipe(
        // tap(x => console.log('in paramMap, params:: ')),
        takeUntil(this.destroy$),
        tap((params: ParamMap) => {
          console.log('in paramMap, params:: ', params);
          this.selectedItemId = params.get('itemId');
          this.selectedPlaceId = params.get('placeId');
          this.store.dispatch(
            FoodieActions.fetchItemOfAPlace({ placeId: this.selectedPlaceId, itemId: this.selectedItemId }),
          );
        }),
      )
      .subscribe();

    this.selectedReviewFilter = [this.config?.itemDetailFilterBy?.[0]];
    this.selectedStarFilter = [this.config?.itemDetailFilterByStars?.[0]];
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  trackByReviewId(index: number, r: Review) {
    return r.id;
  }

  onReviewFilterChange($event: ListItem) {
    console.log('In onReviewFilterChange, $event: ', $event);
  }

  onStarFilterChange($event: ListItem) {
    console.log('In onStarFilterChange, $event: ', $event);
  }

  onGiveAReviewClick() {
    console.log('in item-detail-> onGiveAReviewClick(), ');
    this.store.dispatch(FoodieActions.preloadPostReviewData({ place: this.selectedPlace, item: this.item }));
    this.router.navigate(['/new_review']);
  }
}
