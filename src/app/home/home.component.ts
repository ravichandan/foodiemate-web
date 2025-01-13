import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, importProvidersFrom, inject, OnDestroy, OnInit, Provider, Renderer2, RendererFactory2, TemplateRef, ViewChild } from '@angular/core';
import { AsyncPipe, DecimalPipe, JsonPipe, NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet, TitleCasePipe } from '@angular/common';
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
import { addressSelector, cuisinesSelector, currentSuburbSelector, popularItemsSelector, popularPlacesSelector, suburbsSelector } from '../selectors/foodie.selector';
import { SuburbsResponse } from '../models/SuburbsResponse';
import { Suburb } from '../models/Suburb';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ScrollPromptComponent } from '../cutil/scroll-prompt.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsModalRef, BsModalService, ModalOptions, ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule, TypeaheadOrder } from 'ngx-bootstrap/typeahead';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule,NgStyle, HoverClassDirective, NgForOf, NgIf, NgMultiSelectDropDownModule, NgxSpinnerModule,
    CollapseModule, ReactiveFormsModule, NgClass, DecimalPipe, TitleCasePipe, NgbCarousel, NgbSlide, FaIconComponent, ScrollPromptComponent,
    ScrollToDirective, ReplacePipe, NgTemplateOutlet, NgMultiSelectDropDownModule, NgSelectModule,ModalModule, TypeaheadModule],
    
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy, OnInit, AfterViewInit {
buttonClicked(ele: any) {
console.log('element:: ', ele)
}
  config: any;
  @ViewChild('searchStr')
  searchInput: ElementRef | undefined;
  searchableSuburbInput?: string;
  modalRef?: BsModalRef;
  modalService: BsModalService = inject(BsModalService);

  placesResponse$: Observable<PlacesResponse | undefined> | undefined;
  popularPlaces$: Observable<any | undefined> | undefined;
  popularItems$: Observable<any | undefined> | undefined;
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
  popularItemsPageNum = 1;
  popularItemsPageSize = 8;
  popularPlacesPageNum = 1;
  popularPlacesPageSize = 8;
  morePopularItemsInProgress = false;
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
  addressInState$: Observable<any> | undefined;
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
    private spinner: NgxSpinnerService
  ) {
    this.config = this.appService.getConfig();
    this.destroy$ = new Subject<any>();
    this.cuisines$ = this.store.select(cuisinesSelector()).pipe(takeUntil(this.destroy$));
    this.addressInState$ = this.store.select(addressSelector()).pipe(takeUntil(this.destroy$));
    this.suburbs$ = this.store.select(suburbsSelector()).pipe(takeUntil(this.destroy$), filter(Boolean), map((suburbsResponse?: SuburbsResponse) => suburbsResponse?.suburbs), 
        tap(suburbs => this.suburbsLength = suburbs?.length ?? 0)
    );
    this.popularItems$ = this.store.select(popularItemsSelector()).pipe(takeUntil(this.destroy$), tap(_ => this.morePopularItemsInProgress = false));
    this.popularPlaces$ = this.store.select(popularPlacesSelector()).pipe(takeUntil(this.destroy$));
    this.dietaries = this.config.dietaries;
    this.placesResponse.places = [];
    this.route.queryParams.pipe(tap(x => console.log('raw query params:: ', x))).subscribe();
    this.searchKey = null;
    this.suburbs$
      .pipe(takeUntil(this.destroy$),
      mergeMap(suburbs => this.route.queryParams.pipe(map(params => ({ suburbs, params })))),
        filter(({ suburbs, params }) => !!suburbs && !!params),
      )
      .subscribe(( { suburbs, params }) => {

        console.log('In route.queryparams, params:: ', params);
        this.searchKey = params!['search'];

        this.selectedCuisines = !!params['cuisines'] ? params['cuisines'].split(',') : this.selectedCuisines;
        this.selectedDistance = !!params['distance'] ? params['distance'] : this.selectedDistance;
        if(this.selectedDistance) {
          this.store.dispatch(FoodieActions.distanceFilterChange({distance: this.selectedDistance}));
          setTimeout(()=>this.store.dispatch(FoodieActions.fetchPopularItems({})), 0);
        }
        // ssss
        // this.selectedSuburb = !!params['suburbs'] ? params['suburbs'].split(',').map((sub: string) => suburbs!.find(s=> s?.name == sub)) : this.selectedSuburb;
        console.log('in route.queryparams, this.selectedSuburb:: ', this.selectedSuburb);
        this.selectedSuburb = params['suburbs'] ?? this.selectedSuburb;

        // this.placesResponse.places = [];
        // this.itemsResponse.items = [];
        this.errorMessage = undefined;

        if (!!this.searchKey) {
          this.placesResponse = {} as PlacesResponse;
          this.itemsResponse = {} as ItemResponse;
          console.log('sending for search with key:: ',this.searchKey);
          this.spinner.show();
          // if(!this.dishFlag) {
          this.appService.searchPlaceWithName({
            placeName: this.searchKey,
            itemName: this.searchKey,
            dietaries: this.selectedDiets,
            cuisines: this.selectedCuisines,
            // suburbs: this.suburbsLength == this.selectedSuburb?.length ? undefined : this.selectedSuburb.map((x: Suburb) => x?.name),
            suburbs: this.selectedSuburb ?? undefined,
            includeSurroundingSuburbs: this.includeSurroundingSuburbs,
            distance: this.selectedDistance,
          })
            .pipe(filter(Boolean), take(1))
            .subscribe({
                next: res => {
                  if(!this.placesResponse?.places) {
                    this.placesResponse.places = [];
                  }
                  
                  this.placesResponse.places.push(...res.places);
                  this.placesResponse.size = res.size /*+ this.placesResponse.size*/;
                  this.placesResponse.page = res.page;
                  this.spinner.hide();
                },
                error: err => {
                  console.log('Error while fetching places with given name:: ', err);
                  this.spinner.hide();
                  this.errorMessage = err.error ?? err.message;
                },
              },
            );

          this.appService.searchItemsWithName({ itemName: this.searchKey,
            suburbs: this.selectedSuburb?.name ?? undefined,
            dietaries: this.selectedDiets,
            cuisines: this.selectedCuisines,
            includeSurroundingSuburbs: this.includeSurroundingSuburbs,
            distance: this.selectedDistance
          }).pipe(filter(Boolean), take(1))
            .subscribe({
                next: res => {
                  if(!this.itemsResponse?.items) {
                    this.itemsResponse.items = [];
                  }
                  this.itemsResponse.items.push(...res.items);
                  this.itemsResponse.size = res.size;
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
    this.selectedDistance = this.config.distances[this.config.distances.length-1];
    if(!!this.selectedDistance) {
      // this.onDistanceSelectionChange();
    }
  }

  ngOnInit() {
    console.log('In home.component ngOnInit(), this.searchInput:: ', this.searchInput);

    this.store.dispatch(FoodieActions.fetchPopularItems({})); 
    this.store.dispatch(FoodieActions.fetchPopularPlaces());
    this.store.dispatch(FoodieActions.fetchSuburbs({ city: 'Sydney' }));
    this.store.select(currentSuburbSelector())
      .pipe(
        takeUntil(this.destroy$),
        filter(Boolean),
        tap(currSuburb => !this.selectedSuburb ? this.selectedSuburb = currSuburb : null),
        tap(_=> this.onSelectionChange()),
        filter(_=> !!this.selectedSuburb),
        take(1)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.store.dispatch(FoodieActions.pageDestroyed());
  } 

  openModal(template: TemplateRef<void>, suburbs: any[]) {
    console.log('in home.component, openModal');
    const initialState: ModalOptions = {
      initialState: {
        suburbs: suburbs as any[],
      },
      class: 'modal-md h-75 mt-5',
      animated: true
    };

    this.modalRef = this.modalService.show(template, initialState);
    setTimeout(()=> document.getElementById("suburbInput")?.focus(), 10); // focus on suburb input in the modal 
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
          key: searchKey, 
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

  onViewItemInPlace(place: Place, item: Item) {
    if(place && item) {
      this.router.navigate(['places/' + place._id+'/items/'+item._id]).then();
    }
  }


  onViewItem(item: Item) {
    if(item) {
      this.router.navigate(['items/'+item._id]).then();
    }
  }

  public ngAfterViewInit(): void {
    console.log('in home.component.ts -> ngAfterViewInit()');
    if (this.searchInput) {
      this.searchInput.nativeElement.value = this.searchKey ?? null;
    }
    this.cdRef.detectChanges();
  }

  onSelectionChange() {
    console.log('onselection change', this.searchKey);
    // setTimeout(()=>this.store.dispatch(FoodieActions.fetchPopularItems({})), 0);
    setTimeout(()=>this.store.dispatch(FoodieActions.fetchPopularPlaces()), 0);
    setTimeout(()=>{
      const dietsStr = this.selectedDiets?.map(d=>d?.name)?.join(',');
      const cuisinesStr = this.selectedCuisines?.join(',');
      const key = this.searchKey;
      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(
          ['home'],
          { queryParams: { 
            cuisines: cuisinesStr,
            diets: dietsStr,
            search: key,
            suburbs: this.selectedSuburb,
            distance: this.selectedDistance
          } },
        ));
    }, 0);
  }

  onMorePopularItems(hasModal?: boolean, template?: any, suburbs?: any): void {
    if(hasModal && template&& suburbs){
      this.openModal(template, suburbs);
      this.modalRef?.onHide?.subscribe(_ => {
        this.morePopularItemsInProgress = true;
        this.cdRef.detectChanges();
        // ++this.popularItemsPageNum;
        // setTimeout(()=> {
        this.store.dispatch(FoodieActions.fetchPopularItems({pageNum: this.popularItemsPageNum, pageSize: this.popularItemsPageSize}));
          // }, 0); 
      });
    } else {
      this.morePopularItemsInProgress = true;
      this.cdRef.detectChanges();
      ++this.popularItemsPageNum;
      setTimeout(()=> {
          this.store.dispatch(FoodieActions.fetchPopularItems({pageNum: this.popularItemsPageNum, pageSize: this.popularItemsPageSize}));
        }, 0);
    } 
  }



  onDietSelectionChange(item: any) {
    console.log('in onDietSelectionChange, item:: ', item);
    this.store.dispatch(FoodieActions.dietsFilterChange({diets: this.selectedDiets}));
    setTimeout(()=>this.store.dispatch(FoodieActions.fetchPopularItems({})), 0);
    this.onSelectionChange();
  }

  onCuisineSelectionChange(item: any) {
    console.log('in onDietSelectionChange, item:: ', item);
    this.store.dispatch(FoodieActions.dietsFilterChange({diets: this.selectedDiets}));
    setTimeout(()=>this.store.dispatch(FoodieActions.fetchPopularItems({})), 0);
    this.onSelectionChange();
  }


  onDistanceSelectionChange(item?: any) {
    // console.log('in onDistanceSelectionChange, item:: ', item);
    this.store.dispatch(FoodieActions.distanceFilterChange({distance: this.selectedDistance}));
    setTimeout(()=>this.store.dispatch(FoodieActions.fetchPopularItems({})), 0);
    this.onSelectionChange();
  }

  onSuburbSelectionChange($event: any) {
    console.log('in onSuburbSelectionChange, event:: ', $event);
    if(!$event.item?.name){
      return ;
    }
    this.selectedSuburb = $event.item?.name;
    this.store.dispatch(FoodieActions.updateLocation({suburb: $event.item.name, postcode: $event.item.postcode}));
    setTimeout(()=>this.store.dispatch(FoodieActions.fetchPopularItems({})), 0);
    this.modalRef?.hide();
    this.onSelectionChange();
  }

  getAsArray = (suburbs: any): any[] => suburbs as any[]
}
