import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { filter, map, Observable, Subject, take, takeUntil, tap } from 'rxjs';
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
import { AccordionModule } from 'ngx-bootstrap/accordion';

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
    AccordionModule,
  ],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss',
})
export class ItemListComponent implements OnInit, OnDestroy {
  appService = inject(AppService);
  items$: Observable<Item[]> | undefined;
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
  isSortByTaste: boolean = false;
  allItems: Item[] | undefined = undefined;
  filtered: Item[] | undefined = undefined;

  private readonly destroy$: Subject<any>;
  private selectedPlaceId: any;

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

    // Fetch an item, and it will have the list of places with ratings and reviews
    this.onFilterChange();

    this.route.paramMap
      .pipe(
        // tap(x => console.log('in paramMap, params:: ')),
        takeUntil(this.destroy$),
        tap((params: ParamMap) => {
          this.selectedPlaceId = params.get('placeId');
          this.store.dispatch(FoodieActions.fetchPlace({ id: this.selectedPlaceId, fetchMenu: true }));
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  trackByItemId(_: number, i: Item) {
    return i._id;
  }

  onReviewFilterChange($event: ListItem) {
    this.onFilterChange();
  }

  goToItemDetail(itemId: string) {
    let r = '/places/:placeId/items/:itemId';
    r = r.replace(':placeId', this.selectedPlaceId);
    r = r.replace(':itemId', itemId);
    this.router.navigate([r]).then();
  }

  checkTasteSorting(isSortByTaste: boolean) {
    this.onFilterChange();
  }

  private onFilterChange() {
    this.store.select(placeSelector(this.selectedPlaceId)).pipe(
      filter((x) => !!x),
      take(1),
      tap((x) => (this.selectedPlaceName = x.name)),
      map((x) => this.allItems = x.items as Item[]),
      filter(x => !!x?.length),
      map((items: Item[]) => this.filtered = items.filter((item) => !item?.allergens?.includes(this.selectedAllergensFilter))),
      map((items: Item[]) => this.filtered = this.isSortByTaste ? items.sort((a, b) => a.ratingInfo.taste - b.ratingInfo.taste) : items),
    ).subscribe();
  }
}
