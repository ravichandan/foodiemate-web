import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { filter, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { Place } from '../models/Place';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { placeSelector } from '../selectors/foodie.selector';
import * as FoodieActions from '../actions/foodie.actions';
import { Review } from '../models/Review';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { PlaceReviewsComponent } from '../place-reviews/place-reviews.component';
import { AsyncPipe, DecimalPipe, NgClass, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemListComponent } from '../item-list/item-list.component';
import { getMaterialIconNameForTag } from '../services/Utils';
import { preloadPostReviewData } from '../actions/foodie.actions';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [
    PlaceReviewsComponent,
    AsyncPipe,
    DecimalPipe,
    NgbCarouselModule,
    NgForOf,
    NgIf,
    // RouterModule,
    ItemListComponent,
    NgClass,
    RouterLink,
    TitleCasePipe,
  ],
  templateUrl: './place-detail.component.html',
  styleUrl: './place-detail.component.scss',
})
export class PlaceDetailComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<any>;
  config: any;
  protected readonly getMaterialIconNameForTag = getMaterialIconNameForTag;
  appService= inject(AppService);
  place$: Observable<Place | undefined> | undefined;
  // selectedItemId: any;
  selectedPlaceId: any;
  selectedPlace: Place | undefined;
  // item: Item | undefined;
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
  // selectedReviewFilter: any;
  // selectedStarFilter: any;
  showMenuItems: boolean = true;

  constructor(
    public route: ActivatedRoute,
    private store: Store<State>,
    private router: Router,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
  }

  ngOnInit() {
    console.log('in place-detail.component, ngOnInit()');
    this.selectedPlaceId = this.route.snapshot.paramMap.get('placeId');
    // this.selectedItemId = this.route.snapshot.paramMap.get('itemId');

    this.place$ = this.store.select(placeSelector(this.selectedPlaceId)).pipe(
      takeUntil(this.destroy$),
      filter((data) => !!data),
      tap((x) => (this.selectedPlace = x)),
      tap((x) => console.log('place received in place-detail.component:: ', x)),
    );

    // this.place$ = selected$;//.pipe(
    // tap((p: Place | undefined) => this.item = p?.items[this.selectedItemId]));

    this.route.paramMap
      .pipe(
        // tap(x => console.log('in paramMap, params:: ')),
        takeUntil(this.destroy$),
        tap((params: ParamMap) => {
          console.log('in paramMap, params:: ', params);
          // this.selectedItemId = params.get('itemId');
          this.selectedPlaceId = params.get('placeId');
          this.store.dispatch(FoodieActions.fetchPlace({ id: this.selectedPlaceId }));
        }),
      )
      .subscribe();

    // this.selectedReviewFilter = [this.config?.itemDetailFilterBy?.[0]];
    // this.selectedStarFilter = [this.config?.itemDetailFilterByStars?.[0]];
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  trackByReviewId(index: number, r: Review) {
    return r._id;
  }

  onGiveAReviewClick() {
    this.store.dispatch(FoodieActions.preloadPostReviewData({ place: this.selectedPlace }));
    this.router.navigate(['/new_review']);
  }

  protected readonly Object = Object;
  protected readonly JSON = JSON;
}
