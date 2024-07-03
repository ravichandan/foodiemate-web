import { Component, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { filter, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { itemSelector } from '../selectors/foodie.selector';
import * as FoodieActions from '../actions/foodie.actions';
import { AsyncPipe, DecimalPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { NgbCarouselModule, NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { PlaceListUnitComponent } from '../place-list-unit/place-list-unit.component';
import { ReplacePipe } from '../directives/replace.pipe';
import { HoverClassDirective } from '../directives/hover-class.directive';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ListItem } from 'ng-multiselect-dropdown/multiselect.model';
import { FormsModule } from '@angular/forms';
import { Place } from '../models/Place';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-place-list',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgTemplateOutlet,
    DecimalPipe,
    NgForOf,
    NgClass,
    NgbCarouselModule,
    PlaceListUnitComponent,
    ReplacePipe,
    HoverClassDirective,
    NgMultiSelectDropDownModule,
    FormsModule,
    NgbScrollSpyModule,
  ],
  templateUrl: './place-list.component.html',
  styleUrl: './place-list.component.scss',
})
export class PlaceListComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<any>;
  appService= inject(AppService);
  places$: Observable<Place[]> | undefined;
  selectedItemId: any;
  selectedItemName: any;
  config: any;
  // filterBy: string;
  sortBy: string;
  pageSize: number = 1;
  currentPageNum: number = 0;

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'label',
    textField: 'label',
    itemsShowLimit: 5,
    allowSearchFilter: false,
  };

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
  ) {
    this.destroy$ = new Subject<any>();
    this.config = this.appService.getConfig();
    this.pageSize = this.config.pageSize;
    // this.filterBy = 'Taste';
    this.sortBy = 'Taste';
  }

  ngOnInit() {
    this.selectedItemId = this.route.snapshot.paramMap.get('itemId');
    // this.fetchPlaces();

    // Fetch an item, and it will have the list of places with ratings and reviews
    this.places$ = this.store.select(itemSelector(this.selectedItemId)).pipe(
      takeUntil(this.destroy$),
      filter((x) => !!x),
      tap((x) => console.log('Places list received in place-list.component:: ', x)),
      tap((x) => (this.selectedItemName = x.name)),
      tap((x) => (this.currentPageNum += x.places.length / this.pageSize)),
      map((x) => x.places),
    );
    setTimeout(() => {}, 10000);

    this.route.paramMap
      .pipe(
        // tap(x => console.log('in paramMap, params:: ')),
        takeUntil(this.destroy$),
        tap((params: ParamMap) => {
          // console.log('in paramMap, params:: ', params)
          this.selectedItemId = params.get('itemId');
          this.store.dispatch(FoodieActions.fetchPlacesOfItem({ id: this.selectedItemId, pageSize: 1, pageNum: 1 }));
        }),
      )
      .subscribe();
  }

  fetchPlaces(str: string) {
    console.log('in fetchPlaces, idx:: ', str);
    const vals = str.split(',');
    const idx = +vals[0] + 1; // 20
    const totalItems = +vals[1]; //30
    if (totalItems - this.pageSize <= idx) {
      // 30      -       10 = 20 <= (20,21,22)
      this.store.dispatch(
        FoodieActions.fetchPlacesOfItem({
          id: this.selectedItemId,
          pageSize: this.pageSize,
          pageNum: this.currentPageNum + 1,
        }),
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  trackByPlaceId(index: number, pl: Place) {
    return pl.id;
  }

  onFilterChange($event: ListItem) {
    console.log('in onFilterChange, $event: ', $event);
  }

  onSortChange($event: ListItem) {
    console.log('in onSortChange, $event: ', $event);
  }
}
