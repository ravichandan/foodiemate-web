import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, importProvidersFrom, inject, OnDestroy, OnInit, Provider, Renderer2, RendererFactory2, TemplateRef, ViewChild } from '@angular/core';
import { AsyncPipe, DecimalPipe, JsonPipe, NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
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
import { BsModalRef, BsModalService, ModalOptions, ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule, TypeaheadOrder } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule,NgStyle, HoverClassDirective, NgForOf, NgIf, NgMultiSelectDropDownModule,
    CollapseModule, ReactiveFormsModule, NgClass, DecimalPipe, JsonPipe, NgbCarousel, NgbSlide, FaIconComponent, ScrollPromptComponent,
    ScrollToDirective, ReplacePipe, NgTemplateOutlet, NgMultiSelectDropDownModule, NgSelectModule,ModalModule, TypeaheadModule],
    
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy, OnInit, AfterViewInit {
  config: any;
  @ViewChild('searchStr')
  searchInput: ElementRef | undefined;
  modalRef?: BsModalRef;
  modalService: BsModalService = inject(BsModalService);

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
  selectedSuburb: any;
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
  suburbTypeAheadConfig: TypeaheadOrder = {
    direction: 'asc',
    
    field: 'name'
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
        // this.selectedSuburb = !!params['suburbs'] ? params['suburbs'].split(',').map((sub: string) => suburbs!.find(s=> s?.name == sub)) : this.selectedSuburb;
        this.selectedSuburb = params['suburbs'] ?? this.selectedSuburb;

        this.placesResponse.places = [];
        this.itemsResponse.items = [];
        this.errorMessage = undefined;

        if (!!this.searchKey) {
          console.log('sending for search with key:: ',this.searchKey);
          // if(!this.dishFlag) {
          this.appService.searchPlaceWithName({
            placeName: this.searchKey,
            itemName: this.searchKey,
            suburbs: this.suburbsLength == this.selectedSuburb.length ? undefined : this.selectedSuburb.map((x: Suburb) => x?.name),
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
            suburbs: this.suburbsLength == this.selectedSuburb.length ? undefined : this.selectedSuburb.map((x: Suburb) => x?.name),
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

  openModal(template: TemplateRef<void>, suburbs: any[]) {
    const initialState: ModalOptions = {
      initialState: {
        suburbs: suburbs as any[],
      },
      class: 'modal-md h-75 mt-5',
      animated: true
    };

    this.modalRef = this.modalService.show(template, initialState);
  }

  popularItemSelected(element: Item|Place) {
    if ((element.type === 'item') || (element as Place)['item'] !== undefined) {
      this.router.navigate(['items/' + (element as Place).item]);
    } else {
      this.router.navigate(['places/' + element._id]);
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
          suburbs: this.selectedSuburb,
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
    setTimeout(()=>{
      const cuisinesStr = this.selectedCuisines?.join(',');
      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(
          ['home'],
          { queryParams: { 
            cuisines: cuisinesStr, 
            suburbs: this.selectedSuburb,
            distance: this.selectedDistance
          } },
        ));
    }, 0);
  }


  onDistanceSelectionChange(item: any) {
    console.log('in onDistanceSelectionChange, item:: ', item);
    this.store.dispatch(FoodieActions.distanceFilterChange({distance: this.selectedDistance}));
    setTimeout(()=>this.store.dispatch(FoodieActions.fetchPopular()), 0);
    setTimeout(()=>{
      const cuisinesStr = this.selectedCuisines?.join(',');
      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(
          ['home'],
          { queryParams: { 
            cuisines: cuisinesStr, 
            suburbs: this.selectedSuburb,
            distance: this.selectedDistance
          } },
        ));
    }, 0);
    
  }

  onSuburbSelectionChange($event: any) {
    if(!$event.item?.name){
      return ;
    }
    this.store.dispatch(FoodieActions.updateLocation({suburb: $event.item.name, postcode: $event.item.postcode}));
    setTimeout(()=>this.store.dispatch(FoodieActions.fetchPopular()), 0);
    setTimeout(()=>{
      const cuisinesStr = this.selectedCuisines?.join(',');
      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(
          ['home'],
          { queryParams: { 
            cuisines: cuisinesStr, 
            suburbs: this.selectedSuburb,
            distance: this.selectedDistance
          } },
        ));
    }, 0);
  }

  getAsArray = (suburbs: any): any[] => suburbs as any[]
}
