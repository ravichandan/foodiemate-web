import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { filter, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Item } from '../models/Item';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { customerSelector, placeSelector } from '../selectors/foodie.selector';
import * as FoodieActions from '../actions/foodie.actions';
import { ItemListUnitComponent } from '../item-list-unit/item-list-unit.component';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NgbScrollSpy, NgbScrollSpyFragment } from '@ng-bootstrap/ng-bootstrap';
import { PlaceListUnitComponent } from '../place-list-unit/place-list-unit.component';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { FormsModule } from '@angular/forms';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    ItemListUnitComponent,
    NgIf,
    AsyncPipe,
    NgForOf,
    NgbScrollSpy,
    PlaceListUnitComponent,
    NgClass,
    NgbScrollSpyFragment,
    NgMultiSelectDropDownModule,
    FormsModule,
  ],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss',
})
export class ItemListComponent implements OnInit, OnDestroy {
  appService= inject(AppService);

  private readonly destroy$: Subject<any>;

  items$: Observable<Item[]> | undefined;
  private selectedPlaceId: any;
  selectedPlaceName: any;
  config: any;
  sortBy: string = 'Taste';
  pageSize: number = 1;
  currentPageNum: number = 0;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'label',
    textField: 'label',
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: false,
  };
  selectedAllergensFilter: any;
  // selectedStarFilter: any;
  //
  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private router: Router,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
  }

  ngOnInit() {
    this.selectedPlaceId = this.route.snapshot.paramMap.get('placeId');
    this.store
      .select(customerSelector())
      .pipe(
        takeUntil(this.destroy$),
        filter((x) => !!x),
      )
      .subscribe((c) => (this.selectedAllergensFilter = c?.allergens));
    // this.fetchPlaces();

    // Fetch an item, and it will have the list of places with ratings and reviews
    this.items$ = this.store.select(placeSelector(this.selectedPlaceId)).pipe(
      takeUntil(this.destroy$),
      filter((x) => !!x),
      tap((x) => console.log('Place received in item-list.component:: ', x)),
      tap((x) => console.log('items received in item-list.component, x.items:: ', x.items)),
      tap((x) => (this.selectedPlaceName = x.name)),

      map((x) => Object.values(x.items)),
      map((items: Item[]) => items?.filter((item) => !item?.allergens?.includes(this.selectedAllergensFilter))),
    );
    setTimeout(() => {}, 10000);

    console.log('hee', this.route.paramMap);

    this.route.paramMap
      .pipe(
        // tap(x => console.log('in paramMap, params:: ')),
        takeUntil(this.destroy$),
        tap((params: ParamMap) => {
          console.log('in paramMap, params:: ', params);
          this.selectedPlaceId = params.get('placeId');
          this.store.dispatch(FoodieActions.fetchPlace({ id: this.selectedPlaceId }));
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
  fetchItems(name: string) {}
  trackByItemId(_: number, i: Item) {
    return i.id;
  }

  openItemDetail(item: Item) {
    console.log('in item-list.component, opening details page for item:: ', item.id);
    this.router.navigate(['places/' + this.selectedPlaceId + '/items/' + item.id]);
    // this.router.navigate(['items/' + element.id],);
  }

  onReviewFilterChange($event: ListItem) {}
}
