import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HoverClassDirective } from '../directives/hover-class.directive';
import { AppService } from '../services/app.service';
import { filter, Observable, Subject, take } from 'rxjs';
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule, HoverClassDirective, NgForOf, NgIf, ReactiveFormsModule, NgClass, DecimalPipe, NgbCarousel, NgbSlide, FaIconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy, OnInit, AfterViewInit {
  config: any;

  @ViewChild('searchStr')
  searchInput: ElementRef | undefined;


  placesResponse$: Observable<PlacesResponse | undefined> | undefined;
  // randomSuggestions: any[] | undefined;
  placesResponse: PlacesResponse = {} as PlacesResponse;
  itemsResponse: ItemResponse = {} as ItemResponse;
  dishFlag: boolean = true;
  errorMessage: string | undefined = undefined;
  searchKey: string|null;
  protected readonly Object = Object;
  protected readonly JSON = JSON;
  private readonly destroy$: Subject<any>;

  // Removing showing random suggestions in badges
  // public setRandomSuggestions() {
  //   const suggestions = this.config.suggestions;
  //   // Shuffle array
  //   const shuffled = suggestions.sort(() => 0.5 - Math.random());
  //
  //   // Get sub-array of first n elements after shuffled
  //   let selected = shuffled.slice(0, this.config.noOfSuggestions);
  //   this.randomSuggestions = selected;

  constructor(
    private appService: AppService,
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
  ) {
    this.config = this.appService.getConfig();
    this.destroy$ = new Subject<any>();

    this.placesResponse.places = [];
    this.searchKey=null;
    this.route.queryParams.subscribe(params => {
      const srch = params['search'];
      // if(!!srch)
        this.searchKey = srch ;

      this.placesResponse.places = [];
      this.itemsResponse.items = [];
      this.errorMessage = undefined;

      if (!!this.searchKey) {
        // console.log('sending for search with key:: ',this.searchKey);
        // if(!this.dishFlag) {
        this.appService.searchPlaceWithName({ placeName: this.searchKey, itemName: this.searchKey })
          .pipe(filter(Boolean), take(1))
          .subscribe({
              next: res => {
                // this.placesResponse = {
                console.log('this.res:: ', res);
                this.placesResponse.places.push(...res.places);
                this.placesResponse.size = res.size /*+ this.placesResponse.size*/;
                this.placesResponse.page = res.page;
                // this.cdRef.detectChanges();
                console.log('this.placesResponse:: ', this.placesResponse);
                // };

              },
              error: err => {
                console.log('Error while fetching places with given name:: ', err);
                this.errorMessage = err.error ?? err.message;
              },
            },
          );

        this.appService.searchItemsWithName({ itemName: this.searchKey })
          .pipe(filter(Boolean), take(1))
          .subscribe({
              next: res => {
                console.log('in home.component->search(), this.itemsResponse:: :: ', res);
                this.itemsResponse.items.push(...res.items);
                this.itemsResponse.size = res.size /*+ this.placesResponse.size*/;
                this.itemsResponse.page = res.page;
                // this.cdRef.detectChanges();
                console.log('this.itemsResponse:: ', this.itemsResponse);
                // };

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



      // }
      // this.param2 = params['param2'];
    });
    // this.popularSearches$ = this.store.select(popularsSelector).pipe(takeUntil(this.destroy$));
  }

  ngOnInit() {
    // consol
    // this.setRandomSuggestions();
    console.log('in home.componne,t ngOnInitL:: ', this.searchInput);
    this.store.dispatch(FoodieActions.fetchPopular());

    // if()
  }

  // }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.store.dispatch(FoodieActions.pageDestroyed());
  }

  popularItemSelected(element: Item | Place) {
    if (element.type === 'item') {
      this.router.navigate(['items/' + element._id]);
    } else {
      this.router.navigate(['places/' + element._id]);
    }
  }

  search(element: HTMLInputElement) {
    // console.log('in home.component->search(), element: ', element.value);
    // console.log(this.searchInput);

    const searchKey = element.value;
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['home'], { queryParams: { search: searchKey } }));

  }

  onViewPlaces(item: Item) {
    this.router.navigate(['items/' + item._id]).then();
  }

  onViewPlace(place: Place) {
    this.router.navigate(['places/' + place._id]).then();
  }

  public ngAfterViewInit(): void
  {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = this.searchKey ?? null;
    }
  //   this.childrenComponent.changes.subscribe((comps: QueryList<MyComponent>) =>
  //   {
  //     // Now you can access the child component
  //   });
  }
}
