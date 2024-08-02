import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { filter, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { Item } from '../models/Item';
import * as FoodieActions from '../actions/foodie.actions';
import { itemDetailOfAPlaceSelector, placeItemFromItemDataSelector } from '../selectors/foodie.selector';
import { Place } from '../models/Place';
import { AsyncPipe, DecimalPipe, LowerCasePipe, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { Review } from '../models/Review';
import { NgbCarousel, NgbSlide, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReviewUnitComponent } from '../review-unit/review-unit.component';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
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
  changeDetection: ChangeDetectionStrategy.OnPush
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
  appService= inject(AppService);

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
    this.config = this.appService.getConfig();
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
      tap((p: Place | undefined) => (this.item = p?.items[0])),
    );

    this.reviews$ = selected$.pipe(map((x) => x?.items[0].placeItem.reviews));

    this.route.paramMap
      .pipe(
        // tap(x => console.log('in paramMap, params:: ')),
        takeUntil(this.destroy$),

        tap((params: ParamMap) => {
          console.log('in paramMap, params:: ', params);
          this.selectedItemId = params.get('itemId');
          this.selectedPlaceId = params.get('placeId');
        }),
        switchMap((params: ParamMap) =>
          this.store.select(placeItemFromItemDataSelector(this.selectedPlaceId, this.selectedItemId )).
            pipe(
              // filter(Boolean),
              map(item => item)
          )
        ),
        tap(x => console.log('in item-detail.component, item:: ',x)),
        tap((item: Item| undefined) =>
          // item?.placeItemId
          //   ? this.store.dispatch(
          //     FoodieActions.fetchItemOfAPlace({ placeItemId: item.placeItemId }))
          //   :
            this.store.dispatch(
              FoodieActions.fetchItemOfAPlace({ placeId: this.selectedPlaceId, itemId: this.selectedItemId }),
        )),
      )
      .subscribe();

    this.selectedReviewFilter = [this.config?.itemDetailFilterBy?.[0]];
    this.selectedStarFilter = [this.config?.itemDetailFilterByStars?.[0]];
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  trackByReviewId(index: number, r: Review) {
    return r._id;
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

  protected readonly JSON = JSON;
}
