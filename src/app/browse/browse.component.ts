import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { filter, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { AppService } from '../services/app.service';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { AsyncPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { cuisinesItemsSelector, cuisinesSelector, popularsSelector } from '../selectors/foodie.selector';
import * as FoodieActions from '../actions/foodie.actions';
import { HoverClassDirective } from '../directives/hover-class.directive';
import { CuisinesItems } from '../models/CuisinesItemsResponse';
import { Item } from '../models/Item';
import { Router } from '@angular/router';
@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    NgForOf,
    NgMultiSelectDropDownModule,
    FormsModule,
    NgIf,
    AsyncPipe,
    NgTemplateOutlet,
    HoverClassDirective,
    NgClass,
    TitleCasePipe,
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<any>;
  config: any;
  dietaries: any[] = [];
  selectedCuisines: any[] = [];
  selectedDiets: any[] = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
  cuisines$: Observable<any> | undefined;
  cuisinesItems$: Observable<any> | undefined;

  constructor(
    private appService: AppService,
    private store: Store<State>,
    private router: Router,
  ) {
    this.config = this.appService.getConfig();
    this.destroy$ = new Subject<any>();
  }

  ngOnInit(): void {
    this.cuisines$ = this.store.select(cuisinesSelector()).pipe(takeUntil(this.destroy$));
    this.cuisinesItems$ = this.store.select(cuisinesItemsSelector()).pipe(
      takeUntil(this.destroy$),
      filter((cir) => !!cir),
      map((cir) => cir?.data.map((ci: CuisinesItems) => ({ ...ci, showMore: false }))),
      tap((d) => console.log('in tap of cuisinesItems:: ', d)),
    );
    this.store.dispatch(FoodieActions.fetchCuisines());
    this.store.dispatch(FoodieActions.fetchCuisinesItems());
    this.dietaries = this.config.dietaries;
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  openItem(item: Item | any) {
    this.router.navigate(['/items', item._id]);
  }
}
