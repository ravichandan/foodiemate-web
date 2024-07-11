import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HoverClassDirective } from '../directives/hover-class.directive';
import { AppService } from '../services/app.service';
import { popularsSelector } from '../selectors/foodie.selector';
import { filter, Observable, Subject, take, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import * as FoodieActions from '../actions/foodie.actions';
import { Place } from '../models/Place';
import { Item } from '../models/Item';
import { Router } from '@angular/router';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { PlacesResponse } from '../models/PlacesResponse';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule, HoverClassDirective, NgForOf, NgIf, ReactiveFormsModule, NgClass, DecimalPipe, NgbCarousel, NgbSlide, FaIconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy, OnInit {
  config: any;
  private readonly destroy$: Subject<any>;
  popularSearches$: Observable<any> | undefined;
  // randomSuggestions: any[] | undefined;

  placesResponse$: Observable<PlacesResponse|undefined> | undefined;
  placesResponse: PlacesResponse = {} as PlacesResponse;
  dishFlag: boolean = false;
  errorMessage: string | undefined =undefined;

  constructor(
    private appService: AppService,
    private store: Store<State>,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.config = this.appService.getConfig();
    this.destroy$ = new Subject<any>();

    this.placesResponse.places=[];
    this.popularSearches$ = this.store.select(popularsSelector).pipe(takeUntil(this.destroy$));
  }

  ngOnInit() {
    // consol
    // this.setRandomSuggestions();
    this.store.dispatch(FoodieActions.fetchPopular());
  }

  // Removing showing random suggestions in badges
  // public setRandomSuggestions() {
  //   const suggestions = this.config.suggestions;
  //   // Shuffle array
  //   const shuffled = suggestions.sort(() => 0.5 - Math.random());
  //
  //   // Get sub-array of first n elements after shuffled
  //   let selected = shuffled.slice(0, this.config.noOfSuggestions);
  //   this.randomSuggestions = selected;
  // }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.store.dispatch(FoodieActions.pageDestroyed());
  }

  popularItemSelected(element: Item | Place) {
    if (element.type === 'item') {
      this.router.navigate(['items/' + element.id]);
    } else {
      this.router.navigate(['places/' + element.id]);
    }
  }

  search(element: HTMLInputElement) {
    console.log('in home.component->search(), element: ', element.value);
    this.errorMessage = undefined;
    if(!this.dishFlag) {
      this.appService.searchPlaceWithName({ placeName: element.value, itemName: element.value })
        .pipe(filter(Boolean), take(1))
        .subscribe({
          next: res => {
            // this.placesResponse = {
            console.log('this.res:: ', res);
            this.placesResponse.places.push(...res.places);
            this.placesResponse.size = res.size /*+ this.placesResponse.size*/;
            this.placesResponse.page = res.page;
            this.cdRef.detectChanges();
            console.log('this.placesResponse:: ', this.placesResponse);
            // };

          },
          error: err => {
            console.log('Error while fetching places with given name:: ', err);
            this.errorMessage = err.error ?? err.message;
          }
        },
      );
    } else {
      // TODO
    }
  }

  protected readonly Object = Object;
  protected readonly JSON = JSON;
}
