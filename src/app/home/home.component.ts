import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HoverClassDirective } from '../directives/hover-class.directive';
import { AppService } from '../services/app.service';
import { popularsSelector } from '../selectors/foodie.selector';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import * as FoodieActions from '../actions/foodie.actions';
import { Place } from '../models/Place';
import { Item } from '../models/Item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule, HoverClassDirective, NgForOf, NgIf, ReactiveFormsModule, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy, OnInit {
  config: any;
  private readonly destroy$: Subject<any>;
  popularSearches$: Observable<any> | undefined;
  randomSuggestions: any[] | undefined;

  constructor(
    private appService: AppService,
    private store: Store<State>,
    private router: Router,
  ) {
    this.config = this.appService.getConfig();
    this.destroy$ = new Subject<any>();

    this.popularSearches$ = this.store.select(popularsSelector).pipe(takeUntil(this.destroy$));
  }

  ngOnInit() {
    // consol
    this.setRandomSuggestions();
    this.store.dispatch(FoodieActions.fetchPopular());
  }

  public setRandomSuggestions() {
    const suggestions = this.config.suggestions;
    // Shuffle array
    const shuffled = suggestions.sort(() => 0.5 - Math.random());

    // Get sub-array of first n elements after shuffled
    let selected = shuffled.slice(0, this.config.noOfSuggestions);
    this.randomSuggestions = selected;
  }
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
}
