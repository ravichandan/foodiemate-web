import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { filter, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { Item } from '../models/Item';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { customerSelector, placeSelector } from '../selectors/foodie.selector';
import * as FoodieActions from '../actions/foodie.actions';
import { ItemListUnitComponent } from '../item-list-unit/item-list-unit.component';
import { AsyncPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { PlaceListUnitComponent } from '../place-list-unit/place-list-unit.component';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { FormsModule } from '@angular/forms';
import { AppService } from '../services/app.service';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ScrollToDirective } from '../directives/scrollTo.directive';
import { ScrolledToDirective } from '../directives/scrolledTo.directive';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    ItemListUnitComponent,
    NgIf,
    AsyncPipe,
    NgForOf,
    NgbScrollSpyModule,
    PlaceListUnitComponent,
    NgClass,
    NgStyle,
    NgMultiSelectDropDownModule,
    FormsModule,
    AccordionModule,
    ScrollToDirective,
    ScrolledToDirective,
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
  // categories = new SetWithContentEquality<any>( category => category.label); 
  categories: any[] = []; 


  filteredItems: {[category: string]: Item[]} = {} as any;
  

  private readonly destroy$: Subject<any>;
  private selectedPlaceId: any;
  protected readonly Object = Object;
  public innerWidth: any;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    console.log('this.innerWidth:: ',this.innerWidth);
  }

  // activeChanged(arg0: any) {

  //   const targetElement: any = document.querySelector('#'+arg0);
  //   console.log('in activeChanged:: ', arg0);
  //   console.log('in activeChanged, targetElement.data:: ', targetElement.data);
  //   console.log('in activeChanged, targetElement:: ', targetElement);
  //   targetElement?.click();
  //   // document.querySelector(arg0).click();
  // }


  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private router: Router,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
    this.innerWidth = window.innerWidth;

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
    const tempCats = new Set<string>();
    this.store.select(placeSelector(this.selectedPlaceId)).pipe(
      filter((x) => !!x),
      takeUntil(this.destroy$),
      tap((x) => (this.selectedPlaceName = x.name)),
      map((x) => this.allItems = x.items as Item[]),
      filter(x => !!x?.length),
      map((items: Item[]) => this.filtered = items.filter((item) => !item?.allergens?.includes(this.selectedAllergensFilter))),
      tap((items: Item[]) => items.forEach((item) => tempCats.add(item?.placeItem.category))),      
      tap((items: Item[]) => this.categories = Array.from(tempCats).map((cat) => ({label: cat, active: false, selected: false, focus: false}))),
      tap((items: Item[]) => this.categories.forEach((cat: any)=> this.filteredItems[cat.label]=[])),
      map((items: Item[]) => this.filtered = this.isSortByTaste ? items.sort((a, b) => (a.ratingInfo?.taste ?? 0) - (b.ratingInfo?.taste ?? 0)) : items),
      tap((items: Item[]) => this.filtered?.forEach((it:Item) => (it.placeItem?.category &&
        this.filteredItems[it.placeItem.category as string].push(it))
      )),
    ).subscribe();
  }


}
