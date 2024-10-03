import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HoverClassDirective } from '../directives/hover-class.directive';
import { AppService } from '../services/app.service';
import { filter, forkJoin, map, mergeMap, Observable, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import * as FoodieActions from '../actions/foodie.actions';
import { Place } from '../models/Place';
import { Item } from '../models/Item';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { PlacesResponse } from '../models/PlacesResponse';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ItemResponse } from '../models/ItemResponse';
import { ScrollToDirective } from '../directives/scrollTo.directive';
import { ReplacePipe } from '../directives/replace.pipe';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { cuisinesSelector, popularsSelector, suburbsSelector } from '../selectors/foodie.selector';
import { SuburbsResponse } from '../models/SuburbsResponse';
import { Suburb } from '../models/Suburb';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ScrollPromptComponent } from '../cutil/scroll-prompt.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule,NgStyle, HoverClassDirective, NgForOf, NgIf, NgMultiSelectDropDownModule,
    CollapseModule, ReactiveFormsModule, NgClass, DecimalPipe, NgbCarousel, NgbSlide, FaIconComponent, ScrollPromptComponent,
    ScrollToDirective, ReplacePipe, NgTemplateOutlet, NgMultiSelectDropDownModule, NgSelectModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy, OnInit, AfterViewInit {
  config: any;
  @ViewChild('searchStr')
  searchInput: ElementRef | undefined;
  placesResponse$: Observable<PlacesResponse | undefined> | undefined;
  popularSearches$: Observable<any | undefined> | undefined;
  // randomSuggestions: any[] | undefined;
  placesResponse: PlacesResponse = {} as PlacesResponse;
  itemsResponse: ItemResponse = {} as ItemResponse;
  dishFlag: boolean = false;
  errorMessage: string | undefined = undefined;
  searchKey: string | null;
  dietaries: any[] = [];
  selectedCuisines: any[] = [];
  selectedSuburbs: any[] = [];
  suburbsLength: number = 0;
  selectedDiets: any[] = [];
  selectedDistance: any;
  suburbDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'name',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };
  
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'value',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };
  distanceDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    itemsShowLimit: 1,
    allowSearchFilter: false,
    // idField: 'id',
    // textField: 'text',
    limitSelection: 1,
    closeDropDownOnSelection: true

  };
  cuisines$: Observable<any> | undefined;
  suburbs$: Observable<Suburb[] | undefined> | undefined;
  isCollapsed = true;
  includeSurroundingSuburbs = true;
  protected readonly Object = Object;
  protected readonly JSON = JSON;
  private readonly destroy$: Subject<any>;

  constructor(
    private appService: AppService,
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
  ) {
    this.config = this.appService.getConfig();
    this.destroy$ = new Subject<any>();
    this.cuisines$ = this.store.select(cuisinesSelector()).pipe(takeUntil(this.destroy$));
    this.suburbs$ = this.store.select(suburbsSelector()).pipe(takeUntil(this.destroy$), filter(Boolean), map((suburbsResponse?: SuburbsResponse) => suburbsResponse?.suburbs), 
        tap(suburbs => this.suburbsLength = suburbs?.length ?? 0)
    );
    this.popularSearches$ = this.store.select(popularsSelector()).pipe(takeUntil(this.destroy$));
    this.dietaries = this.config.dietaries;
    this.placesResponse.places = [];
    this.searchKey = null;
    this.suburbs$
      .pipe(takeUntil(this.destroy$),
      mergeMap(suburbs => this.route.queryParams.pipe(map(params => ({ suburbs, params })))),
        filter(({ suburbs, params }) => !!suburbs && !!params),
      )
      .subscribe(( { suburbs, params }) => {

        this.searchKey = params!['search'];

        this.selectedCuisines = !!params['cuisines'] ? params['cuisines'].split(',') : this.selectedCuisines;
        this.selectedDistance = !!params['distance'] ? params['distance'] : this.selectedDistance;
        this.selectedSuburbs = !!params['suburbs'] ? params['suburbs'].split(',').map((sub: string) => suburbs!.find(s=> s?.name == sub)) : this.selectedSuburbs;

        this.placesResponse.places = [];
        this.itemsResponse.items = [];
        this.errorMessage = undefined;

        if (!!this.searchKey) {
          console.log('sending for search with key:: ',this.searchKey);
          // if(!this.dishFlag) {
          this.appService.searchPlaceWithName({
            placeName: this.searchKey,
            itemName: this.searchKey,
            suburbs: this.suburbsLength == this.selectedSuburbs.length ? undefined : this.selectedSuburbs.map((x: Suburb) => x?.name),
            includeSurroundingSuburbs: this.includeSurroundingSuburbs,
            distance: this.selectedDistance,
          })
            .pipe(filter(Boolean), take(1))
            .subscribe({
                next: res => {
                  // this.placesResponse = {
                  this.placesResponse.places.push(...res.places);
                  this.placesResponse.size = res.size /*+ this.placesResponse.size*/;
                  this.placesResponse.page = res.page;
                },
                error: err => {
                  console.log('Error while fetching places with given name:: ', err);
                  this.errorMessage = err.error ?? err.message;
                },
              },
            );

          this.appService.searchItemsWithName({ itemName: this.searchKey,
            suburbs: this.suburbsLength == this.selectedSuburbs.length ? undefined : this.selectedSuburbs.map((x: Suburb) => x?.name),
            includeSurroundingSuburbs: this.includeSurroundingSuburbs,
            distance: this.selectedDistance
          })
            .pipe(filter(Boolean), take(1))
            .subscribe({
                next: res => {
                  this.itemsResponse.items.push(...res.items);
                  this.itemsResponse.size = res.size /*+ this.placesResponse.size*/;
                  this.itemsResponse.page = res.page;
                },
                error: err => {
                  console.log('Error while fetching items with given name:: ', err);
                  this.errorMessage = err.error ?? err.message;
                },
              },
            );
        }
        if (this.searchInput) {
          this.searchInput.nativeElement.value = this.searchKey ?? null;
        }
      });
    this.selectedDistance = this.config.distances[0];
  }

  ngOnInit() {
    console.log('in home.component ngOnInit:: ', this.searchInput);

    this.store.dispatch(FoodieActions.fetchPopular());
    this.store.dispatch(FoodieActions.fetchSuburbs({ city: 'Sydney' }));

  }

  // }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.store.dispatch(FoodieActions.pageDestroyed());
  }

  popularItemSelected(element: Item) {
    if (element.type === 'item') {
      this.router.navigate(['items/' + element._id]);
    } else {
      this.router.navigate(['places/' + element.place._id]);
    }
  }

  search(element: HTMLInputElement) {
    const searchKey = element.value;
    const cuisinesStr = this.selectedCuisines?.join(',');
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(
        ['home'],
        { queryParams: { 
          search: searchKey, 
          cuisines: cuisinesStr, 
          suburbs: this.selectedSuburbs?.map((x: Suburb) => x?.name).join(','), 
          distance: this.selectedDistance
        } },
      ));
  }

  onViewPlaces(item: Item) {
    this.router.navigate(['items/' + item._id]).then();
  }

  onViewPlace(place: Place) {
    this.router.navigate(['places/' + place._id]).then();
  }

  onViewItem(place: Place, item: Item) {
    if(place && item) {
      this.router.navigate(['places/' + place._id+'/items/'+item._id]).then();
    }
  }

  public ngAfterViewInit(): void {
    console.log('in home.component.ts -> ngAfterViewInit()');
    if (this.searchInput) {
      this.searchInput.nativeElement.value = this.searchKey ?? null;
    }
    this.cdRef.detectChanges();
  }

  onDietSelectionChange(item: any) {
    this.store.dispatch(FoodieActions.dietsFilterChange({diets: this.selectedDiets}));
    setTimeout(()=>this.store.dispatch(FoodieActions.fetchPopular()), 0);
  }


  onDistanceSelectionChange(item: any) {
    console.log('in onDistanceSelectionChange, item:: ', item);
    this.store.dispatch(FoodieActions.distanceFilterChange({distance: this.selectedDistance}));
    setTimeout(()=>this.store.dispatch(FoodieActions.fetchPopular()), 0);
  }
}
